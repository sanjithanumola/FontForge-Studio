import React, { useState } from 'react';
import {
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Edit2,
  AlignCenterHorizontal,
  AlignCenterVertical,
} from 'lucide-react';
import { TextLayer } from '../../types';

interface LayersPanelProps {
  layers: TextLayer[];
  activeLayerId: string;
  onSelectLayer: (id: string) => void;
  onAddLayer: () => void;
  onDuplicateLayer: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onUpdateLayer: (id: string, updates: Partial<TextLayer>) => void;
  onReorderLayer: (id: string, direction: 'up' | 'down') => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  activeLayerId,
  onSelectLayer,
  onAddLayer,
  onDuplicateLayer,
  onDeleteLayer,
  onUpdateLayer,
  onReorderLayer,
}) => {
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [tempName, setTempName] = useState<string>('');

  const handleStartRename = (layer: TextLayer) => {
    setEditingLayerId(layer.id);
    setTempName(layer.name);
  };

  const handleSaveRename = (id: string) => {
    if (tempName.trim()) {
      onUpdateLayer(id, { name: tempName.trim() });
    }
    setEditingLayerId(null);
  };

  return (
    <div className="flex flex-col gap-4 text-xs text-neutral-300">
      {/* Header with Add Layer CTA */}
      <div className="flex items-center justify-between p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <span className="font-semibold text-neutral-200">Canvas Layers ({layers.length})</span>
        <button
          onClick={onAddLayer}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-105 rounded-md shadow-sm transition-all active:scale-95"
        >
          <Plus size={13} />
          <span>New Layer</span>
        </button>
      </div>

      {/* Layer Alignment Toolbar for Active Layer */}
      <div className="flex items-center justify-between p-2.5 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <span className="text-[11px] text-neutral-400 font-medium">Align Active Layer</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onUpdateLayer(activeLayerId, { x: 50 })}
            title="Center Horizontally"
            className="p-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded border border-neutral-800 transition-colors"
          >
            <AlignCenterHorizontal size={13} />
          </button>
          <button
            onClick={() => onUpdateLayer(activeLayerId, { y: 50 })}
            title="Center Vertically"
            className="p-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded border border-neutral-800 transition-colors"
          >
            <AlignCenterVertical size={13} />
          </button>
        </div>
      </div>

      {/* Layers List */}
      <div className="flex flex-col gap-1.5 max-h-[380px] overflow-y-auto pr-1">
        {layers.map((layer, index) => {
          const isSelected = layer.id === activeLayerId;
          const isFirst = index === 0;
          const isLast = index === layers.length - 1;

          return (
            <div
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'border-amber-500/70 bg-amber-500/10 text-white'
                  : 'border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900 text-neutral-400'
              }`}
            >
              {/* Layer Title & Preview */}
              <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: layer.colorMode === 'solid' ? layer.solidColor : '#FFE066' }}
                />

                {editingLayerId === layer.id ? (
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => handleSaveRename(layer.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(layer.id)}
                    autoFocus
                    className="bg-neutral-950 border border-amber-500 rounded px-1.5 py-0.5 text-xs text-white outline-none w-28"
                  />
                ) : (
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium text-xs text-neutral-200 truncate">{layer.name}</span>
                    <span className="text-[10px] text-neutral-500 truncate font-mono">
                      {layer.text || '(Empty)'}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                {/* Reorder Buttons */}
                <button
                  onClick={() => onReorderLayer(layer.id, 'up')}
                  disabled={isFirst}
                  title="Bring Forward"
                  className="p-1 hover:text-white text-neutral-500 disabled:opacity-20 transition-colors"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={() => onReorderLayer(layer.id, 'down')}
                  disabled={isLast}
                  title="Send Backward"
                  className="p-1 hover:text-white text-neutral-500 disabled:opacity-20 transition-colors"
                >
                  <ArrowDown size={12} />
                </button>

                {/* Edit Name */}
                <button
                  onClick={() => handleStartRename(layer)}
                  title="Rename Layer"
                  className="p-1 hover:text-white text-neutral-500 transition-colors"
                >
                  <Edit2 size={12} />
                </button>

                {/* Visibility Toggle */}
                <button
                  onClick={() => onUpdateLayer(layer.id, { visible: !layer.visible })}
                  title={layer.visible ? 'Hide layer' : 'Show layer'}
                  className="p-1 hover:text-white text-neutral-500 transition-colors"
                >
                  {layer.visible ? <Eye size={13} /> : <EyeOff size={13} className="text-neutral-600" />}
                </button>

                {/* Lock Toggle */}
                <button
                  onClick={() => onUpdateLayer(layer.id, { locked: !layer.locked })}
                  title={layer.locked ? 'Unlock layer' : 'Lock layer'}
                  className="p-1 hover:text-white text-neutral-500 transition-colors"
                >
                  {layer.locked ? <Lock size={13} className="text-amber-400" /> : <Unlock size={13} />}
                </button>

                {/* Duplicate */}
                <button
                  onClick={() => onDuplicateLayer(layer.id)}
                  title="Duplicate Layer"
                  className="p-1 hover:text-amber-400 text-neutral-500 transition-colors"
                >
                  <Copy size={12} />
                </button>

                {/* Delete */}
                {layers.length > 1 && (
                  <button
                    onClick={() => onDeleteLayer(layer.id)}
                    title="Delete Layer"
                    className="p-1 hover:text-rose-400 text-neutral-500 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
