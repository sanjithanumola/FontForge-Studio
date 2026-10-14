import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: ['Ctrl', 'Z'], desc: 'Undo last change' },
  { keys: ['Ctrl', 'Y'], desc: 'Redo previously undone change' },
  { keys: ['Ctrl', 'D'], desc: 'Duplicate selected layer' },
  { keys: ['Del'], desc: 'Delete selected layer' },
  { keys: ['Ctrl', 'E'], desc: 'Open Export menu' },
  { keys: ['Space', '+ Drag'], desc: 'Pan canvas workspace freely' },
  { keys: ['Click + Drag'], desc: 'Reposition active text layer' },
  { keys: ['Esc'], desc: 'Close open dialogs' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Keyboard Shortcuts</h3>
              <p className="text-xs text-neutral-400">
                Speed up your workflow in FontForge Studio
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

        {/* Shortcuts List */}
        <div className="p-6 flex flex-col gap-2.5 max-h-96 overflow-y-auto">
          {SHORTCUTS.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-neutral-800/60 last:border-0"
            >
              <span className="text-xs text-neutral-300 font-medium">{sc.desc}</span>
              <div className="flex items-center gap-1">
                {sc.keys.map((k, j) => (
                  <kbd
                    key={j}
                    className="px-2 py-0.5 bg-neutral-950 border border-neutral-700 rounded text-[11px] font-mono text-amber-300 shadow-sm"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
