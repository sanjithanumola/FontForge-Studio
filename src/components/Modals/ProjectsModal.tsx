import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  FolderOpen,
  Trash2,
  Download,
  Upload,
  Calendar,
  Layers,
  Check,
} from 'lucide-react';
import { Project, TextLayer, CanvasBackground, CanvasConfig } from '../../types';

export interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLayers: TextLayer[];
  currentBackground: CanvasBackground;
  currentCanvas: CanvasConfig;
  onLoadProject: (project: Project) => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  currentLayers,
  currentBackground,
  currentCanvas,
  onLoadProject,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [justSaved, setJustSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load projects from localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('fontforge_saved_projects');
        if (saved) {
          setProjects(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Failed to parse saved projects', err);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const saveProjectsToStorage = (updated: Project[]) => {
    setProjects(updated);
    try {
      localStorage.setItem('fontforge_saved_projects', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save projects', err);
    }
  };

  const handleSaveCurrentProject = () => {
    const title = newProjectTitle.trim() || `Design #${projects.length + 1}`;
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      title,
      updatedAt: Date.now(),
      layers: currentLayers,
      background: currentBackground,
      canvas: currentCanvas,
    };

    const updated = [newProject, ...projects];
    saveProjectsToStorage(updated);
    setNewProjectTitle('');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = projects.filter((p) => p.id !== id);
    saveProjectsToStorage(updated);
  };

  const handleExportProjectJson = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${project.title.toLowerCase().replace(/\s+/g, '_')}_fontforge.json`;
    a.click();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string) as Project;
          if (imported.layers && imported.background && imported.canvas) {
            imported.id = `proj_${Date.now()}`;
            imported.updatedAt = Date.now();
            const updated = [imported, ...projects];
            saveProjectsToStorage(updated);
            onLoadProject(imported);
            onClose();
          }
        } catch {
          alert('Invalid project JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Project Library</h3>
              <p className="text-xs text-neutral-400">
                Save, reopen, and export designs locally in your browser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-5">
          {/* Save Current Design section */}
          <div className="p-4 bg-neutral-950/70 border border-neutral-800 rounded-xl flex flex-col gap-2.5">
            <span className="text-xs font-semibold text-neutral-200">
              Save Current Workspace
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Give your project a title..."
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveCurrentProject()}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={handleSaveCurrentProject}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
              >
                {justSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{justSaved ? 'Saved!' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Import / Export JSON buttons */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300">
              Saved Designs ({projects.length})
            </span>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Import JSON</span>
              </button>
            </div>
          </div>

          {/* Saved Projects List */}
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
            {projects.length === 0 ? (
              <div className="py-8 text-center text-neutral-500 text-xs">
                No saved projects yet. Enter a title above to save your first project!
              </div>
            ) : (
              projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    onLoadProject(proj);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl border border-neutral-800 bg-neutral-950/60 hover:bg-neutral-950 hover:border-amber-400/50 cursor-pointer transition-all group"
                >
                  <div className="flex flex-col gap-1 min-w-0 pr-3">
                    <span className="text-xs font-semibold text-white group-hover:text-amber-300 truncate transition-colors">
                      {proj.title}
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-neutral-500" />
                        <span>{proj.layers.length} layers</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono text-[10px]">
                        <Calendar className="w-3 h-3 text-neutral-500" />
                        <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => handleExportProjectJson(proj, e)}
                      title="Export as JSON"
                      className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteProject(proj.id, e)}
                      title="Delete Project"
                      className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
