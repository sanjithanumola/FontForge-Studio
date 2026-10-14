import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col text-neutral-200 text-xs">
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-rose-400">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <AlertTriangle size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-neutral-100">Reset Design Canvas?</span>
              <span className="text-[11px] text-neutral-400">This will revert all text layers and background to default.</span>
            </div>
          </div>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            Any unsaved customizations will be replaced. You can undo this action immediately after with Ctrl+Z if needed.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-neutral-800 bg-neutral-950/80">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-1.5 font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow transition-colors"
          >
            Yes, Reset All
          </button>
        </div>
      </div>
    </div>
  );
};
