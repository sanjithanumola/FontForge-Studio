import { useState, useEffect, useCallback, useRef } from 'react';
import { Project, TextLayer, CanvasBackground, CanvasConfig, TextPreset } from './types';
import { INITIAL_PROJECT, INITIAL_LAYER } from './data/defaultProject';
import {
  loadCurrentProject,
  saveCurrentProject,
  getThemePreference,
  saveThemePreference,
} from './utils/storageUtils';
import { loadGoogleFont } from './data/fonts';
import { Navbar } from './components/Navbar';
import { CanvasArea } from './components/CanvasArea';
import { Sidebar, ActiveSidebarTab } from './components/Inspector/Sidebar';
import { ExportModal } from './components/Modals/ExportModal';
import { ProjectsModal } from './components/Modals/ProjectsModal';
import { ResetConfirmModal } from './components/Modals/ResetConfirmModal';
import { ShortcutsModal } from './components/Modals/ShortcutsModal';

export default function App() {
  const [project, setProject] = useState<Project>(() => loadCurrentProject());
  const [activeLayerId, setActiveLayerId] = useState<string>(() => {
    const initial = loadCurrentProject();
    return initial.layers[0]?.id || 'layer-1';
  });

  const [activeSidebarTab, setActiveSidebarTab] = useState<ActiveSidebarTab>('text');

  // Undo / Redo history stacks
  const [history, setHistory] = useState<Project[]>([]);
  const [redoStack, setRedoStack] = useState<Project[]>([]);

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => getThemePreference());

  // Modal open states
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Mobile navigation tab switch
  const [mobileTab, setMobileTab] = useState<'canvas' | 'inspector'>('canvas');

  // Debounced auto-save
  const saveTimeoutRef = useRef<any>(null);

  useEffect(() => {
    saveThemePreference(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Preload fonts used in project
  useEffect(() => {
    project.layers.forEach((l) => {
      if (l.fontFamily) loadGoogleFont(l.fontFamily);
    });
  }, [project.layers]);

  // Push state to undo stack before mutative change
  const pushHistory = useCallback((current: Project) => {
    setHistory((prev) => [...prev.slice(-30), JSON.parse(JSON.stringify(current))]);
    setRedoStack([]);
  }, []);

  // Update whole project and queue auto-save
  const updateProjectWithHistory = useCallback(
    (updater: (prev: Project) => Project) => {
      setProject((prev) => {
        pushHistory(prev);
        const next = updater(prev);
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => saveCurrentProject(next), 400);
        return next;
      });
    },
    [pushHistory]
  );

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setRedoStack((prev) => [...prev, project]);
    setProject(previous);
    saveCurrentProject(previous);
    if (!previous.layers.some((l) => l.id === activeLayerId) && previous.layers.length > 0) {
      setActiveLayerId(previous.layers[0].id);
    }
  }, [history, project, activeLayerId]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    setHistory((prev) => [...prev, project]);
    setProject(next);
    saveCurrentProject(next);
    if (!next.layers.some((l) => l.id === activeLayerId) && next.layers.length > 0) {
      setActiveLayerId(next.layers[0].id);
    }
  }, [redoStack, project, activeLayerId]);

  // Layer Update Handler
  const handleUpdateLayer = useCallback(
    (id: string, updates: Partial<TextLayer>) => {
      updateProjectWithHistory((prev) => ({
        ...prev,
        layers: prev.layers.map((l) => (l.id === id ? { ...l, ...updates } : l)),
      }));
    },
    [updateProjectWithHistory]
  );

  const handleUpdateActiveLayer = useCallback(
    (updates: Partial<TextLayer>) => {
      if (!activeLayerId) return;
      handleUpdateLayer(activeLayerId, updates);
    },
    [activeLayerId, handleUpdateLayer]
  );

  // Background Update Handler
  const handleUpdateBackground = useCallback(
    (nextBg: CanvasBackground) => {
      updateProjectWithHistory((prev) => ({
        ...prev,
        background: nextBg,
      }));
    },
    [updateProjectWithHistory]
  );

  // Canvas Config Update Handler
  const handleUpdateCanvas = useCallback(
    (updates: Partial<CanvasConfig>) => {
      updateProjectWithHistory((prev) => ({
        ...prev,
        canvas: { ...prev.canvas, ...updates },
      }));
    },
    [updateProjectWithHistory]
  );

  // Add New Text Layer
  const handleAddLayer = useCallback(() => {
    const newId = `layer-${Date.now()}`;
    const newLayer: TextLayer = {
      ...JSON.parse(JSON.stringify(INITIAL_LAYER)),
      id: newId,
      name: `Text ${project.layers.length + 1}`,
      text: 'NEW TEXT',
      fontSize: 64,
      x: 50,
      y: 50,
      rotation: 0,
      colorMode: 'solid',
      solidColor: '#FFFFFF',
      stroke: { enabled: false, color: '#000000', width: 0, hollow: false, doubleOutline: false },
      shadow: { enabled: true, type: 'drop', color: '#000000', blur: 10, offsetX: 0, offsetY: 4, opacity: 0.4 },
      specialEffect: 'none',
    };

    updateProjectWithHistory((prev) => ({
      ...prev,
      layers: [...prev.layers, newLayer],
    }));
    setActiveLayerId(newId);
    setActiveSidebarTab('text');
  }, [project.layers.length, updateProjectWithHistory]);

  // Duplicate Layer
  const handleDuplicateLayer = useCallback(
    (id: string) => {
      const source = project.layers.find((l) => l.id === id);
      if (!source) return;
      const copyId = `layer-${Date.now()}`;
      const copy: TextLayer = {
        ...JSON.parse(JSON.stringify(source)),
        id: copyId,
        name: `${source.name} Copy`,
        x: Math.min(90, source.x + 3),
        y: Math.min(90, source.y + 4),
      };

      updateProjectWithHistory((prev) => ({
        ...prev,
        layers: [...prev.layers, copy],
      }));
      setActiveLayerId(copyId);
    },
    [project.layers, updateProjectWithHistory]
  );

  // Delete Layer
  const handleDeleteLayer = useCallback(
    (id: string) => {
      if (project.layers.length <= 1) return;
      updateProjectWithHistory((prev) => {
        const filtered = prev.layers.filter((l) => l.id !== id);
        return {
          ...prev,
          layers: filtered,
        };
      });
      if (activeLayerId === id) {
        const remaining = project.layers.filter((l) => l.id !== id);
        setActiveLayerId(remaining[0]?.id || 'layer-1');
      }
    },
    [project.layers, activeLayerId, updateProjectWithHistory]
  );

  // Reorder Layer
  const handleReorderLayer = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const idx = project.layers.findIndex((l) => l.id === id);
      if (idx === -1) return;
      if (direction === 'up' && idx === project.layers.length - 1) return;
      if (direction === 'down' && idx === 0) return;

      updateProjectWithHistory((prev) => {
        const newLayers = [...prev.layers];
        const targetIdx = direction === 'up' ? idx + 1 : idx - 1;
        const temp = newLayers[idx];
        newLayers[idx] = newLayers[targetIdx];
        newLayers[targetIdx] = temp;
        return { ...prev, layers: newLayers };
      });
    },
    [project.layers, updateProjectWithHistory]
  );

  // Visibility toggle
  const handleToggleVisibility = useCallback(
    (id: string) => {
      updateProjectWithHistory((prev) => ({
        ...prev,
        layers: prev.layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)),
      }));
    },
    [updateProjectWithHistory]
  );

  // Lock toggle
  const handleToggleLock = useCallback(
    (id: string) => {
      updateProjectWithHistory((prev) => ({
        ...prev,
        layers: prev.layers.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l)),
      }));
    },
    [updateProjectWithHistory]
  );

  // Rename layer
  const handleRenameLayer = useCallback(
    (id: string, name: string) => {
      handleUpdateLayer(id, { name });
    },
    [handleUpdateLayer]
  );

  // Center layer
  const handleCenterLayer = useCallback(
    (id: string, axis: 'x' | 'y' | 'both') => {
      updateProjectWithHistory((prev) => ({
        ...prev,
        layers: prev.layers.map((l) => {
          if (l.id !== id) return l;
          return {
            ...l,
            x: axis === 'x' || axis === 'both' ? 50 : l.x,
            y: axis === 'y' || axis === 'both' ? 50 : l.y,
          };
        }),
      }));
    },
    [updateProjectWithHistory]
  );

  // Apply preset
  const handleApplyPreset = useCallback(
    (preset: TextPreset) => {
      if (!activeLayerId) return;
      updateProjectWithHistory((prev) => ({
        ...prev,
        layers: prev.layers.map((l) => {
          if (l.id !== activeLayerId) return l;
          return {
            ...l,
            ...preset.layer,
            name: l.name,
            x: l.x,
            y: l.y,
          };
        }),
        background: preset.background
          ? { ...prev.background, ...preset.background }
          : prev.background,
      }));
    },
    [activeLayerId, updateProjectWithHistory]
  );

  // Reset Canvas
  const handleResetCanvas = useCallback(() => {
    updateProjectWithHistory(() => ({
      ...JSON.parse(JSON.stringify(INITIAL_PROJECT)),
      id: `proj_${Date.now()}`,
      updatedAt: Date.now(),
    }));
    setActiveLayerId(INITIAL_PROJECT.layers[0].id);
  }, [updateProjectWithHistory]);

  // Load project
  const handleLoadProject = useCallback(
    (loaded: Project) => {
      pushHistory(project);
      setProject(loaded);
      saveCurrentProject(loaded);
      if (loaded.layers[0]) {
        setActiveLayerId(loaded.layers[0].id);
      }
      loaded.layers.forEach((l) => {
        if (l.fontFamily) loadGoogleFont(l.fontFamily);
      });
    },
    [project, pushHistory]
  );

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea';

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsExportOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && !isInput) {
        if (activeLayerId) {
          e.preventDefault();
          handleDuplicateLayer(activeLayerId);
        }
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput) {
        if (activeLayerId && project.layers.length > 1) {
          e.preventDefault();
          handleDeleteLayer(activeLayerId);
        }
      } else if (e.key === '?' && !isInput) {
        e.preventDefault();
        setIsShortcutsOpen(true);
      } else if (e.key === 'Escape') {
        setIsExportOpen(false);
        setIsProjectsOpen(false);
        setIsShortcutsOpen(false);
        setIsResetConfirmOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, activeLayerId, project.layers.length, handleDuplicateLayer, handleDeleteLayer]);

  const activeLayer =
    project.layers.find((l) => l.id === activeLayerId) || project.layers[0] || null;

  return (
    <div
      className={`h-screen w-screen flex flex-col overflow-hidden font-sans select-none ${
        theme === 'dark' ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-100 text-neutral-900'
      }`}
    >
      {/* 1. Top Bar Navigation */}
      <Navbar
        projectTitle={project.title}
        onUpdateTitle={(title: string) => updateProjectWithHistory((p) => ({ ...p, title }))}
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={() => setIsResetConfirmOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenProjects={() => setIsProjectsOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        activeLayerCount={project.layers.length}
        mobileActiveTab={mobileTab}
        onSetMobileTab={(tab: string) => setMobileTab(tab as any)}
      />

      {/* 2. Main Studio Area (Center Canvas + Right Inspector) */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Canvas Stage */}
        <div className={`flex-1 h-full ${mobileTab === 'inspector' ? 'hidden md:flex' : 'flex'}`}>
          <CanvasArea
            layers={project.layers}
            activeLayerId={activeLayer?.id || null}
            onSelectLayer={(id) => setActiveLayerId(id)}
            onUpdateLayer={handleUpdateLayer}
            background={project.background}
            canvasConfig={project.canvas}
            onUpdateCanvasConfig={handleUpdateCanvas}
          />
        </div>

        {/* Inspector Sidebar */}
        <div
          className={`h-full ${
            mobileTab === 'canvas' ? 'hidden md:flex' : 'flex w-full md:w-auto'
          }`}
        >
          <Sidebar
            activeTab={activeSidebarTab}
            onChangeTab={setActiveSidebarTab}
            activeLayer={activeLayer}
            onUpdateActiveLayer={handleUpdateActiveLayer}
            layers={project.layers}
            activeLayerId={activeLayer?.id || null}
            onSelectLayer={(id) => setActiveLayerId(id)}
            onAddLayer={handleAddLayer}
            onDuplicateLayer={handleDuplicateLayer}
            onDeleteLayer={handleDeleteLayer}
            onReorderLayer={handleReorderLayer}
            onToggleVisibility={handleToggleVisibility}
            onToggleLock={handleToggleLock}
            onRenameLayer={handleRenameLayer}
            onCenterLayer={handleCenterLayer}
            background={project.background}
            onChangeBackground={handleUpdateBackground}
            canvasConfig={project.canvas}
            onChangeCanvasConfig={handleUpdateCanvas}
            onApplyPreset={handleApplyPreset}
          />
        </div>
      </main>

      {/* 3. Dialog Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        layers={project.layers}
        background={project.background}
        canvasConfig={project.canvas}
        activeLayer={activeLayer}
      />

      <ProjectsModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        currentLayers={project.layers}
        currentBackground={project.background}
        currentCanvas={project.canvas}
        onLoadProject={handleLoadProject}
      />

      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetCanvas}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
