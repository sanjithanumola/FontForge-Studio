import React from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  RotateCw,
  Compass,
  Type,
} from 'lucide-react';
import { TextLayer, CurvedTextConfig } from '../../types';

interface TypographyPanelProps {
  layer: TextLayer;
  onUpdateLayer: (updates: Partial<TextLayer>) => void;
}

const WEIGHT_OPTIONS = [
  { value: 100, label: '100 Thin' },
  { value: 300, label: '300 Light' },
  { value: 400, label: '400 Regular' },
  { value: 500, label: '500 Medium' },
  { value: 600, label: '600 SemiBold' },
  { value: 700, label: '700 Bold' },
  { value: 800, label: '800 ExtraBold' },
  { value: 900, label: '900 Black' },
];

export const TypographyPanel: React.FC<TypographyPanelProps> = ({ layer, onUpdateLayer }) => {
  const handleCaseChange = (c: 'none' | 'uppercase' | 'lowercase' | 'capitalize') => {
    onUpdateLayer({ textTransform: c });
  };

  const handleCurvedChange = (updates: Partial<CurvedTextConfig>) => {
    onUpdateLayer({
      curvedText: { ...layer.curvedText, ...updates },
    });
  };

  return (
    <div className="flex flex-col gap-4 text-xs text-neutral-300">
      {/* 1. Text Content Editor Area */}
      <div className="flex flex-col gap-1.5 p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <label className="font-semibold text-neutral-200 flex items-center gap-1.5">
          <Type size={14} className="text-amber-400" />
          Text Content
        </label>
        <textarea
          rows={3}
          value={layer.text}
          onChange={(e) => onUpdateLayer({ text: e.target.value })}
          placeholder="Enter custom typography text..."
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 resize-none font-sans"
        />
      </div>

      {/* 2. Alignment, Case & Style Format Buttons */}
      <div className="flex flex-col gap-2 p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <span className="font-semibold text-neutral-200">Alignment & Formatting</span>

        {/* Text Alignment */}
        <div className="grid grid-cols-4 gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          {(['left', 'center', 'right', 'justify'] as const).map((align) => {
            const Icon =
              align === 'left'
                ? AlignLeft
                : align === 'center'
                ? AlignCenter
                : align === 'right'
                ? AlignRight
                : AlignJustify;
            return (
              <button
                key={align}
                onClick={() => onUpdateLayer({ textAlign: align })}
                className={`py-1.5 flex items-center justify-center rounded transition-colors ${
                  layer.textAlign === align
                    ? 'bg-neutral-800 text-amber-400 shadow-sm'
                    : 'text-neutral-500 hover:text-white'
                }`}
                title={`Align ${align}`}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>

        {/* Text Transform / Case */}
        <div className="grid grid-cols-4 gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => handleCaseChange('none')}
            className={`py-1 text-[11px] font-medium rounded transition-colors ${
              layer.textTransform === 'none' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            As Typed
          </button>
          <button
            onClick={() => handleCaseChange('uppercase')}
            className={`py-1 text-[11px] font-medium rounded transition-colors ${
              layer.textTransform === 'uppercase' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            UPPER
          </button>
          <button
            onClick={() => handleCaseChange('lowercase')}
            className={`py-1 text-[11px] font-medium rounded transition-colors ${
              layer.textTransform === 'lowercase' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            lower
          </button>
          <button
            onClick={() => handleCaseChange('capitalize')}
            className={`py-1 text-[11px] font-medium rounded transition-colors ${
              layer.textTransform === 'capitalize' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            Title
          </button>
        </div>

        {/* Italic, Underline, Strikethrough */}
        <div className="flex items-center gap-1 pt-1 border-t border-neutral-800/80">
          <button
            onClick={() =>
              onUpdateLayer({
                fontStyle: layer.fontStyle === 'italic' ? 'normal' : 'italic',
              })
            }
            className={`flex-1 py-1.5 flex items-center justify-center rounded border transition-colors ${
              layer.fontStyle === 'italic'
                ? 'border-amber-500/60 bg-amber-500/10 text-amber-400'
                : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
            }`}
            title="Italic"
          >
            <Italic size={14} />
          </button>

          <button
            onClick={() =>
              onUpdateLayer({
                textDecoration: layer.textDecoration === 'underline' ? 'none' : 'underline',
              })
            }
            className={`flex-1 py-1.5 flex items-center justify-center rounded border transition-colors ${
              layer.textDecoration === 'underline'
                ? 'border-amber-500/60 bg-amber-500/10 text-amber-400'
                : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
            }`}
            title="Underline"
          >
            <Underline size={14} />
          </button>

          <button
            onClick={() =>
              onUpdateLayer({
                textDecoration: layer.textDecoration === 'line-through' ? 'none' : 'line-through',
              })
            }
            className={`flex-1 py-1.5 flex items-center justify-center rounded border transition-colors ${
              layer.textDecoration === 'line-through'
                ? 'border-amber-500/60 bg-amber-500/10 text-amber-400'
                : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
            }`}
            title="Strikethrough"
          >
            <Strikethrough size={14} />
          </button>
        </div>
      </div>

      {/* 3. Font Size & Weight */}
      <div className="flex flex-col gap-3 p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <span className="font-semibold text-neutral-200">Size & Weight</span>

        {/* Font Size */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-neutral-400 w-16">Font Size</span>
          <input
            type="range"
            min="12"
            max="220"
            value={layer.fontSize}
            onChange={(e) => onUpdateLayer({ fontSize: Number(e.target.value) })}
            className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded-lg cursor-pointer"
          />
          <input
            type="number"
            min="12"
            max="300"
            value={layer.fontSize}
            onChange={(e) => onUpdateLayer({ fontSize: Number(e.target.value) })}
            className="w-12 bg-neutral-950 border border-neutral-800 rounded px-1.5 py-0.5 text-center font-mono text-[11px] text-neutral-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Font Weight */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-neutral-400 w-16">Weight</span>
          <select
            value={layer.fontWeight}
            onChange={(e) => onUpdateLayer({ fontWeight: Number(e.target.value) })}
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {WEIGHT_OPTIONS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Spacing, Line Height & Opacity */}
      <div className="flex flex-col gap-3 p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <span className="font-semibold text-neutral-200">Spacing & Geometry</span>

        {/* Letter Spacing */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-neutral-400 w-20">Letter Space</span>
          <input
            type="range"
            min="-5"
            max="35"
            value={layer.letterSpacing}
            onChange={(e) => onUpdateLayer({ letterSpacing: Number(e.target.value) })}
            className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded-lg cursor-pointer"
          />
          <span className="font-mono text-[11px] w-8 text-right">{layer.letterSpacing}px</span>
        </div>

        {/* Line Height */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-neutral-400 w-20">Line Height</span>
          <input
            type="range"
            min="0.8"
            max="2.5"
            step="0.05"
            value={layer.lineHeight}
            onChange={(e) => onUpdateLayer({ lineHeight: Number(e.target.value) })}
            className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded-lg cursor-pointer"
          />
          <span className="font-mono text-[11px] w-8 text-right">{layer.lineHeight.toFixed(2)}</span>
        </div>

        {/* Word Spacing */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-neutral-400 w-20">Word Space</span>
          <input
            type="range"
            min="-5"
            max="30"
            value={layer.wordSpacing}
            onChange={(e) => onUpdateLayer({ wordSpacing: Number(e.target.value) })}
            className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded-lg cursor-pointer"
          />
          <span className="font-mono text-[11px] w-8 text-right">{layer.wordSpacing}px</span>
        </div>

        {/* Opacity */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-neutral-800">
          <span className="text-[11px] text-neutral-400 w-20">Opacity</span>
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={layer.opacity}
            onChange={(e) => onUpdateLayer({ opacity: Number(e.target.value) })}
            className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded-lg cursor-pointer"
          />
          <span className="font-mono text-[11px] w-8 text-right">{Math.round(layer.opacity * 100)}%</span>
        </div>

        {/* Rotation */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-neutral-800">
          <span className="text-[11px] text-neutral-400 w-20 flex items-center gap-1">
            <RotateCw size={12} /> Rotation
          </span>
          <input
            type="range"
            min="-180"
            max="180"
            value={layer.rotation}
            onChange={(e) => onUpdateLayer({ rotation: Number(e.target.value) })}
            className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded-lg cursor-pointer"
          />
          <button
            onClick={() => onUpdateLayer({ rotation: 0 })}
            title="Reset rotation to 0°"
            className="font-mono text-[11px] w-8 text-right hover:text-amber-400 transition-colors"
          >
            {layer.rotation}°
          </button>
        </div>
      </div>

      {/* 5. Curved Text & Circular Paths (SVG TextPath) */}
      <div className="flex flex-col gap-3 p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-neutral-200">
            <input
              type="checkbox"
              checked={layer.curvedText.enabled}
              onChange={(e) => handleCurvedChange({ enabled: e.target.checked })}
              className="accent-amber-500 rounded cursor-pointer"
            />
            Curved Text (SVG Arc)
          </label>
        </div>

        {layer.curvedText.enabled && (
          <div className="flex flex-col gap-3 pt-2 border-t border-neutral-800/80">
            {/* Arc vs Circle Mode */}
            <div className="grid grid-cols-2 gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
              <button
                onClick={() => handleCurvedChange({ type: 'arc' })}
                className={`py-1 text-[11px] font-medium rounded transition-colors ${
                  layer.curvedText.type === 'arc'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-500 hover:text-white'
                }`}
              >
                Arc Curve
              </button>
              <button
                onClick={() => handleCurvedChange({ type: 'circle' })}
                className={`py-1 text-[11px] font-medium rounded transition-colors ${
                  layer.curvedText.type === 'circle'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-500 hover:text-white'
                }`}
              >
                360° Circle
              </button>
            </div>

            {/* Curvature Slider (Arc mode) */}
            {layer.curvedText.type === 'arc' && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-neutral-400 w-16">Curvature</span>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={layer.curvedText.curvature}
                  onChange={(e) => handleCurvedChange({ curvature: Number(e.target.value) })}
                  className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded-lg cursor-pointer"
                />
                <span className="font-mono text-[11px] w-8 text-right">
                  {layer.curvedText.curvature}%
                </span>
              </div>
            )}

            {/* Radius Slider */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-neutral-400 w-16">Radius</span>
              <input
                type="range"
                min="100"
                max="800"
                value={layer.curvedText.radius}
                onChange={(e) => handleCurvedChange({ radius: Number(e.target.value) })}
                className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded-lg cursor-pointer"
              />
              <span className="font-mono text-[11px] w-8 text-right">
                {layer.curvedText.radius}px
              </span>
            </div>

            {/* Reverse Direction */}
            <label className="flex items-center gap-2 text-[11px] text-neutral-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={layer.curvedText.reverse}
                onChange={(e) => handleCurvedChange({ reverse: e.target.checked })}
                className="accent-amber-500 rounded cursor-pointer"
              />
              Invert / Flip Arc Direction
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
