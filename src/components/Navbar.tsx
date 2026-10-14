import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  FolderOpen,
  Keyboard,
  Moon,
  Sun,
  Type,
  Layers,
  Edit2,
  Check,
} from 'lucide-react';

export interface NavbarProps {
  projectTitle: string;
  onUpdateTitle: (title: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onOpenProjects: () => void;
  onOpenShortcuts: () => void;
  onOpenExport: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  activeLayerCount: number;
  mobileActiveTab?: string;
  onSetMobileTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  projectTitle,
  onUpdateTitle,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  onOpenProjects,
  onOpenShortcuts,
  onOpenExport,
  theme,
  onToggleTheme,
  activeLayerCount,
  mobileActiveTab,
  onSetMobileTab,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(projectTitle);

  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      onUpdateTitle(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="h-14 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md px-4 flex items-center justify-between gap-4 z-30 select-none shrink-0 transition-colors">
      {/* Zone 1: Brand Wordmark & Project Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-500/10">
          <Type className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold tracking-tight text-white font-['Outfit',sans-serif]">
            FontForge<span className="text-amber-400">.</span>
          </span>
          <span className="text-xs text-neutral-400 font-medium hidden sm:inline">
            Studio
          </span>
        </div>

        {/* Editable Project Title */}
        <div className="hidden lg:flex items-center gap-1.5 ml-2 pl-3 border-l border-neutral-800 text-xs text-neutral-300">
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
                autoFocus
                className="bg-neutral-900 border border-amber-400 rounded px-1.5 py-0.5 text-xs text-white"
              />
              <button onClick={handleSaveTitle} className="text-amber-400 p-0.5">
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => {
                setTitleInput(projectTitle);
                setIsEditingTitle(true);
              }}
              className="flex items-center gap-1 cursor-pointer hover:text-white group"
            >
              <span className="font-medium truncate max-w-[140px]">{projectTitle}</span>
              <Edit2 className="w-2.5 h-2.5 text-neutral-500 group-hover:text-amber-400 opacity-60" />
            </div>
          )}
        </div>
      </div>

      {/* Zone 2: Editor Quick Tools */}
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-md text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-neutral-300 transition-colors cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-md text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-neutral-300 transition-colors cursor-pointer"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onReset}
          title="Reset All Styles"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 border border-neutral-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden md:inline">Reset</span>
        </button>

        <button
          onClick={onOpenProjects}
          title="Projects & Templates"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 border border-neutral-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
        >
          <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Projects</span>
        </button>

        <div className="h-4 w-px bg-neutral-800 hidden sm:block mx-1" />

        <button
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts (?)"
          className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 rounded-lg transition-colors hidden sm:flex cursor-pointer"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
        </button>

        {/* Mobile View Toggle if screen is small */}
        {onSetMobileTab && (
          <div className="flex md:hidden bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 ml-1">
            <button
              onClick={() => onSetMobileTab('canvas')}
              className={`px-2 py-1 text-[10px] rounded ${
                mobileActiveTab === 'canvas' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400'
              }`}
            >
              Canvas
            </button>
            <button
              onClick={() => onSetMobileTab('inspector')}
              className={`px-2 py-1 text-[10px] rounded ${
                mobileActiveTab === 'inspector' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400'
              }`}
            >
              Tools
            </button>
          </div>
        )}
      </div>

      {/* Zone 3: Primary Export Action */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-400 mr-1">
          <Layers className="w-3.5 h-3.5 text-neutral-500" />
          <span>{activeLayerCount} {activeLayerCount === 1 ? 'layer' : 'layers'}</span>
        </div>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg shadow-sm shadow-amber-400/20 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
