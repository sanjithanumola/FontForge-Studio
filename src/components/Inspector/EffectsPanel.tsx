import React from 'react';
import { Sparkles, Layers, Sliders, Shield } from 'lucide-react';
import {
  ShadowConfig,
  StrokeConfig,
  SpecialEffect,
  SpecialEffectSettings,
  ShadowType,
} from '../../types';

interface EffectsPanelProps {
  shadow: ShadowConfig;
  stroke: StrokeConfig;
  specialEffect: SpecialEffect;
  specialEffectSettings: SpecialEffectSettings;
  onChangeShadow: (shadow: ShadowConfig) => void;
  onChangeStroke: (stroke: StrokeConfig) => void;
  onChangeSpecialEffect: (effect: SpecialEffect) => void;
  onChangeSpecialEffectSettings: (settings: SpecialEffectSettings) => void;
}

const SHADOW_TYPES: { type: ShadowType; label: string }[] = [
  { type: 'drop', label: 'Drop' },
  { type: 'layered', label: '3D Layer' },
  { type: 'soft', label: 'Soft' },
  { type: 'hard', label: 'Hard' },
  { type: 'neon', label: 'Neon Glow' },
];

const SPECIAL_EFFECTS_LIST: { id: SpecialEffect; label: string; desc: string; previewBadge: string }[] = [
  { id: 'none', label: 'Standard', desc: 'No special filter applied', previewBadge: 'Aa' },
  { id: 'metallic-gold', label: 'Metallic Gold', desc: 'Specular gold bevel reflection', previewBadge: '🥇' },
  { id: 'silver-chrome', label: 'Silver Chrome', desc: 'High-contrast liquid platinum', previewBadge: '🥈' },
  { id: 'neon-sign', label: 'Neon Sign', desc: 'Luminescent gas tube glow', previewBadge: '⚡' },
  { id: 'fire', label: 'Firestorm', desc: 'Warm blazing ember gradients', previewBadge: '🔥' },
  { id: 'ice', label: 'Glacial Ice', desc: 'Sub-zero frosted cyan glow', previewBadge: '❄️' },
  { id: 'holographic', label: 'Holographic', desc: 'Iridescent chromatic shimmer', previewBadge: '🌈' },
  { id: 'retro-3d', label: 'Retro 3D', desc: 'Isometric vintage pop extrusion', previewBadge: '🧊' },
  { id: 'emboss', label: 'Embossed', desc: 'Raised surface relief texture', previewBadge: '📐' },
  { id: 'engrave', label: 'Engraved', desc: 'Carved letterpress imprint', previewBadge: '🖋️' },
  { id: 'glitch', label: 'RGB Glitch', desc: 'Chromatic split displacement', previewBadge: '📺' },
  { id: 'pixel', label: '8-Bit Pixel', desc: 'Stepped retro video game style', previewBadge: '👾' },
  { id: 'vintage-print', label: 'Vintage Print', desc: 'Aged ink letterpress imprint', previewBadge: '📰' },
];

export const EffectsPanel: React.FC<EffectsPanelProps> = ({
  shadow,
  stroke,
  specialEffect,
  specialEffectSettings,
  onChangeShadow,
  onChangeStroke,
  onChangeSpecialEffect,
  onChangeSpecialEffectSettings,
}) => {
  return (
    <div className="flex flex-col gap-5 text-xs text-neutral-300">
      {/* 1. Special Text Effects (Configurable) */}
      <div className="flex flex-col gap-3 p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-400" />
            Special Effects
          </span>
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
            {specialEffect === 'none' ? 'None' : specialEffect}
          </span>
        </div>

        {/* Effects Grid */}
        <div className="grid grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto pr-1">
          {SPECIAL_EFFECTS_LIST.map((eff) => (
            <button
              key={eff.id}
              onClick={() => onChangeSpecialEffect(eff.id)}
              className={`flex items-start gap-2 p-2 rounded-lg border text-left transition-all ${
                specialEffect === eff.id
                  ? 'border-amber-500/60 bg-amber-500/10 text-white'
                  : 'border-neutral-800/80 bg-neutral-900 hover:bg-neutral-800/80 text-neutral-400'
              }`}
            >
              <span className="text-base leading-none select-none">{eff.previewBadge}</span>
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium text-[11px] truncate">{eff.label}</span>
                <span className="text-[9px] text-neutral-500 leading-tight truncate">{eff.desc}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Effect Fine-Tuning Slider (if active) */}
        {specialEffect !== 'none' && (
          <div className="flex flex-col gap-2 pt-2 border-t border-neutral-800/80">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400 flex items-center gap-1">
                <Sliders size={12} /> Effect Intensity
              </span>
              <span className="font-mono text-amber-400">{specialEffectSettings.intensity}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={specialEffectSettings.intensity}
              onChange={(e) =>
                onChangeSpecialEffectSettings({
                  ...specialEffectSettings,
                  intensity: Number(e.target.value),
                })
              }
              className="accent-amber-500 h-1 bg-neutral-700 rounded-lg cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* 2. Shadow Effects */}
      <div className="flex flex-col gap-3 p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-neutral-200">
            <input
              type="checkbox"
              checked={shadow.enabled}
              onChange={(e) => onChangeShadow({ ...shadow, enabled: e.target.checked })}
              className="accent-amber-500 rounded cursor-pointer"
            />
            Shadow & Glow
          </label>
        </div>

        {shadow.enabled && (
          <div className="flex flex-col gap-3 pt-2 border-t border-neutral-800/80">
            {/* Shadow Type Selector */}
            <div className="grid grid-cols-5 gap-1 bg-neutral-950 p-1 rounded-md border border-neutral-800">
              {SHADOW_TYPES.map((st) => (
                <button
                  key={st.type}
                  onClick={() => onChangeShadow({ ...shadow, type: st.type })}
                  className={`py-1 text-[11px] font-medium rounded transition-colors text-center ${
                    shadow.type === st.type
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Shadow Color & Opacity */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-lg border border-neutral-800">
                <input
                  type="color"
                  value={shadow.color}
                  onChange={(e) => onChangeShadow({ ...shadow, color: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border border-neutral-700 bg-transparent"
                />
                <input
                  type="text"
                  value={shadow.color}
                  onChange={(e) => onChangeShadow({ ...shadow, color: e.target.value })}
                  className="bg-transparent font-mono text-[11px] text-neutral-300 w-16 outline-none uppercase"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-neutral-950 px-2 py-1.5 rounded-lg border border-neutral-800">
                <span className="text-[10px] text-neutral-400">Opac</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={shadow.opacity}
                  onChange={(e) => onChangeShadow({ ...shadow, opacity: Number(e.target.value) })}
                  className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded cursor-pointer"
                />
                <span className="font-mono text-[10px] w-6 text-right">
                  {Math.round(shadow.opacity * 100)}%
                </span>
              </div>
            </div>

            {/* Blur & Offsets */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-neutral-400 w-16">Blur</span>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={shadow.blur}
                  onChange={(e) => onChangeShadow({ ...shadow, blur: Number(e.target.value) })}
                  className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded cursor-pointer"
                />
                <span className="font-mono text-[11px] w-8 text-right">{shadow.blur}px</span>
              </div>

              {shadow.type !== 'neon' && (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-neutral-400 w-16">Offset X</span>
                    <input
                      type="range"
                      min="-40"
                      max="40"
                      value={shadow.offsetX}
                      onChange={(e) => onChangeShadow({ ...shadow, offsetX: Number(e.target.value) })}
                      className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded cursor-pointer"
                    />
                    <span className="font-mono text-[11px] w-8 text-right">{shadow.offsetX}px</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-neutral-400 w-16">Offset Y</span>
                    <input
                      type="range"
                      min="-40"
                      max="40"
                      value={shadow.offsetY}
                      onChange={(e) => onChangeShadow({ ...shadow, offsetY: Number(e.target.value) })}
                      className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded cursor-pointer"
                    />
                    <span className="font-mono text-[11px] w-8 text-right">{shadow.offsetY}px</span>
                  </div>
                </>
              )}

              {/* Layered 3D Count Slider */}
              {shadow.type === 'layered' && (
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-800">
                  <span className="text-[11px] text-neutral-400 w-16">3D Layers</span>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    value={shadow.layers ?? 5}
                    onChange={(e) => onChangeShadow({ ...shadow, layers: Number(e.target.value) })}
                    className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded cursor-pointer"
                  />
                  <span className="font-mono text-[11px] w-8 text-right">{shadow.layers ?? 5}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Outline / Stroke Effects */}
      <div className="flex flex-col gap-3 p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-neutral-200">
            <input
              type="checkbox"
              checked={stroke.enabled}
              onChange={(e) => onChangeStroke({ ...stroke, enabled: e.target.checked })}
              className="accent-amber-500 rounded cursor-pointer"
            />
            Text Stroke & Outline
          </label>
        </div>

        {stroke.enabled && (
          <div className="flex flex-col gap-3 pt-2 border-t border-neutral-800/80">
            {/* Stroke Color & Thickness */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-lg border border-neutral-800">
                <input
                  type="color"
                  value={stroke.color}
                  onChange={(e) => onChangeStroke({ ...stroke, color: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border border-neutral-700 bg-transparent"
                />
                <input
                  type="text"
                  value={stroke.color}
                  onChange={(e) => onChangeStroke({ ...stroke, color: e.target.value })}
                  className="bg-transparent font-mono text-[11px] text-neutral-300 w-16 outline-none uppercase"
                />
              </div>

              <div className="flex-1 flex items-center justify-between gap-2 px-2 py-1.5 bg-neutral-950 rounded-lg border border-neutral-800">
                <span className="text-[11px] text-neutral-400">Width</span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={stroke.width}
                  onChange={(e) => onChangeStroke({ ...stroke, width: Number(e.target.value) })}
                  className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded cursor-pointer"
                />
                <span className="font-mono text-[11px] w-6 text-right">{stroke.width}px</span>
              </div>
            </div>

            {/* Hollow Text Option */}
            <label className="flex items-center gap-2 text-[11px] text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={stroke.hollow}
                onChange={(e) => onChangeStroke({ ...stroke, hollow: e.target.checked })}
                className="accent-amber-500 rounded cursor-pointer"
              />
              Hollow Text (Transparent fill with visible stroke)
            </label>

            {/* Double Outline Option */}
            <div className="flex flex-col gap-2 pt-2 border-t border-neutral-800/60">
              <label className="flex items-center gap-2 text-[11px] text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stroke.doubleOutline}
                  onChange={(e) => onChangeStroke({ ...stroke, doubleOutline: e.target.checked })}
                  className="accent-amber-500 rounded cursor-pointer"
                />
                Double Outline Layer
              </label>

              {stroke.doubleOutline && (
                <div className="flex items-center gap-2 pl-4">
                  <div className="flex items-center gap-1.5 bg-neutral-950 p-1.5 rounded-lg border border-neutral-800">
                    <input
                      type="color"
                      value={stroke.secondaryColor || '#000000'}
                      onChange={(e) => onChangeStroke({ ...stroke, secondaryColor: e.target.value })}
                      className="w-4 h-4 rounded cursor-pointer border border-neutral-700 bg-transparent"
                    />
                    <span className="font-mono text-[10px] text-neutral-400 uppercase">
                      {stroke.secondaryColor || '#000000'}
                    </span>
                  </div>

                  <div className="flex-1 flex items-center justify-between gap-1.5 px-2 py-1.5 bg-neutral-950 rounded-lg border border-neutral-800">
                    <span className="text-[10px] text-neutral-400">Outer</span>
                    <input
                      type="range"
                      min={stroke.width + 1}
                      max="30"
                      value={stroke.secondaryWidth ?? 8}
                      onChange={(e) => onChangeStroke({ ...stroke, secondaryWidth: Number(e.target.value) })}
                      className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded cursor-pointer"
                    />
                    <span className="font-mono text-[10px] w-6 text-right">
                      {stroke.secondaryWidth ?? 8}px
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
