import React, { useState, useEffect } from 'react';
import { Pipette, Plus, Trash2 } from 'lucide-react';
import { ColorMode, GradientConfig, GradientStop } from '../../types';
import {
  GRADIENT_PRESETS,
  SOLID_PALETTES,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
} from '../../data/colorPresets';

interface ColorPanelProps {
  colorMode: ColorMode;
  solidColor: string;
  gradient: GradientConfig;
  onChangeColorMode: (mode: ColorMode) => void;
  onChangeSolidColor: (color: string) => void;
  onChangeGradient: (gradient: GradientConfig) => void;
}

export const ColorPanel: React.FC<ColorPanelProps> = ({
  colorMode,
  solidColor,
  gradient,
  onChangeColorMode,
  onChangeSolidColor,
  onChangeGradient,
}) => {
  // Color format tabs: hex, rgb, hsl
  const [colorFormat, setColorFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');

  // Input states
  const [hexInput, setHexInput] = useState(solidColor || '#FFFFFF');
  const [rgbInput, setRgbInput] = useState(() => hexToRgb(solidColor || '#FFFFFF'));
  const [hslInput, setHslInput] = useState(() => {
    const { r, g, b } = hexToRgb(solidColor || '#FFFFFF');
    return rgbToHsl(r, g, b);
  });

  // Active color stop index for gradients
  const [activeStopIdx, setActiveStopIdx] = useState<number>(0);

  // Custom user palettes saved in localStorage
  const [customPalette, setCustomPalette] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('fontforge_custom_palette') || '[]');
    } catch {
      return [];
    }
  });

  // Recent colors
  const [recentColors, setRecentColors] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('fontforge_recent_colors') || '[]');
    } catch {
      return [];
    }
  });

  const saveRecentColor = (color: string) => {
    if (!color || color === 'transparent') return;
    const updated = [color, ...recentColors.filter((c) => c !== color)].slice(0, 12);
    setRecentColors(updated);
    try {
      localStorage.setItem('fontforge_recent_colors', JSON.stringify(updated));
    } catch {}
  };

  // Sync inputs when solidColor prop changes
  useEffect(() => {
    if (solidColor) {
      setHexInput(solidColor);
      const rgb = hexToRgb(solidColor);
      setRgbInput(rgb);
      setHslInput(rgbToHsl(rgb.r, rgb.g, rgb.b));
    }
  }, [solidColor]);

  const handleHexChange = (val: string) => {
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      if (colorMode === 'solid') {
        onChangeSolidColor(val);
        saveRecentColor(val);
      } else {
        updateActiveGradientStopColor(val);
      }
      const rgb = hexToRgb(val);
      setRgbInput(rgb);
      setHslInput(rgbToHsl(rgb.r, rgb.g, rgb.b));
    }
  };

  const handleRgbChange = (part: 'r' | 'g' | 'b', val: number) => {
    const newRgb = { ...rgbInput, [part]: Math.max(0, Math.min(255, val)) };
    setRgbInput(newRgb);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHexInput(hex);
    setHslInput(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));

    if (colorMode === 'solid') {
      onChangeSolidColor(hex);
    } else {
      updateActiveGradientStopColor(hex);
    }
  };

  const handleHslChange = (part: 'h' | 's' | 'l', val: number) => {
    const maxVal = part === 'h' ? 360 : 100;
    const newHsl = { ...hslInput, [part]: Math.max(0, Math.min(maxVal, val)) };
    setHslInput(newHsl);
    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgbInput(rgb);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setHexInput(hex);

    if (colorMode === 'solid') {
      onChangeSolidColor(hex);
    } else {
      updateActiveGradientStopColor(hex);
    }
  };

  // Native EyeDropper API
  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          handleHexChange(result.sRGBHex);
        }
      } catch {
        // User cancelled picker
      }
    }
  };

  const addCurrentToCustomPalette = () => {
    const colorToAdd = colorMode === 'solid' ? solidColor : gradient.stops[activeStopIdx]?.color;
    if (colorToAdd && !customPalette.includes(colorToAdd)) {
      const updated = [...customPalette, colorToAdd];
      setCustomPalette(updated);
      try {
        localStorage.setItem('fontforge_custom_palette', JSON.stringify(updated));
      } catch {}
    }
  };

  const removeCustomColor = (color: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customPalette.filter((c) => c !== color);
    setCustomPalette(updated);
    try {
      localStorage.setItem('fontforge_custom_palette', JSON.stringify(updated));
    } catch {}
  };

  // Gradient helper methods
  const updateActiveGradientStopColor = (color: string) => {
    const newStops = [...gradient.stops];
    if (newStops[activeStopIdx]) {
      newStops[activeStopIdx] = { ...newStops[activeStopIdx], color };
      onChangeGradient({ ...gradient, stops: newStops });
      saveRecentColor(color);
    }
  };

  const addGradientStop = () => {
    if (gradient.stops.length >= 6) return;
    const lastStop = gradient.stops[gradient.stops.length - 1];
    const newOffset = Math.min(100, (lastStop?.offset || 0) + 15);
    const newStops = [...gradient.stops, { color: '#00F0FF', offset: newOffset }].sort(
      (a, b) => a.offset - b.offset
    );
    onChangeGradient({ ...gradient, stops: newStops });
    setActiveStopIdx(newStops.length - 1);
  };

  const removeGradientStop = (idx: number) => {
    if (gradient.stops.length <= 2) return;
    const newStops = gradient.stops.filter((_, i) => i !== idx);
    onChangeGradient({ ...gradient, stops: newStops });
    setActiveStopIdx(Math.max(0, idx - 1));
  };

  const activeColorValue =
    colorMode === 'solid' ? solidColor : gradient.stops[activeStopIdx]?.color || '#FFFFFF';

  return (
    <div className="flex flex-col gap-3">
      {/* Mode Selector Tabs (Solid / Linear / Radial) */}
      <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
        <button
          onClick={() => onChangeColorMode('solid')}
          className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors ${
            colorMode === 'solid' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Solid
        </button>
        <button
          onClick={() => onChangeColorMode('linear')}
          className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors ${
            colorMode === 'linear' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Linear Grad
        </button>
        <button
          onClick={() => onChangeColorMode('radial')}
          className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors ${
            colorMode === 'radial' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Radial Grad
        </button>
      </div>

      {/* Main Color Picker Box */}
      <div className="flex items-center gap-3 p-2 bg-neutral-900/60 border border-neutral-800/80 rounded-lg">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-neutral-700 shrink-0 cursor-pointer shadow-inner">
          <input
            type="color"
            value={activeColorValue}
            onChange={(e) => {
              if (colorMode === 'solid') {
                onChangeSolidColor(e.target.value);
                saveRecentColor(e.target.value);
              } else {
                updateActiveGradientStopColor(e.target.value);
              }
            }}
            className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer opacity-0"
          />
          <div className="w-full h-full" style={{ backgroundColor: activeColorValue }} />
        </div>

        <div className="flex-1 flex flex-col gap-1.5">
          {/* Format selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {(['hex', 'rgb', 'hsl'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setColorFormat(fmt)}
                  className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${
                    colorFormat === fmt ? 'text-amber-400 bg-amber-400/10 font-bold' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {'EyeDropper' in window && (
              <button
                onClick={handleEyeDropper}
                title="Sample color from screen"
                className="p-1 text-neutral-400 hover:text-amber-400 rounded transition-colors"
              >
                <Pipette className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sync Value Inputs */}
          {colorFormat === 'hex' && (
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
            />
          )}

          {colorFormat === 'rgb' && (
            <div className="grid grid-cols-3 gap-1">
              <input
                type="number"
                min="0"
                max="255"
                value={rgbInput.r}
                onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
                className="bg-neutral-950 border border-neutral-800 rounded px-1.5 py-1 text-xs text-white font-mono text-center"
              />
              <input
                type="number"
                min="0"
                max="255"
                value={rgbInput.g}
                onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
                className="bg-neutral-950 border border-neutral-800 rounded px-1.5 py-1 text-xs text-white font-mono text-center"
              />
              <input
                type="number"
                min="0"
                max="255"
                value={rgbInput.b}
                onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
                className="bg-neutral-950 border border-neutral-800 rounded px-1.5 py-1 text-xs text-white font-mono text-center"
              />
            </div>
          )}

          {colorFormat === 'hsl' && (
            <div className="grid grid-cols-3 gap-1">
              <input
                type="number"
                min="0"
                max="360"
                value={hslInput.h}
                onChange={(e) => handleHslChange('h', parseInt(e.target.value) || 0)}
                className="bg-neutral-950 border border-neutral-800 rounded px-1.5 py-1 text-xs text-white font-mono text-center"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={hslInput.s}
                onChange={(e) => handleHslChange('s', parseInt(e.target.value) || 0)}
                className="bg-neutral-950 border border-neutral-800 rounded px-1.5 py-1 text-xs text-white font-mono text-center"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={hslInput.l}
                onChange={(e) => handleHslChange('l', parseInt(e.target.value) || 0)}
                className="bg-neutral-950 border border-neutral-800 rounded px-1.5 py-1 text-xs text-white font-mono text-center"
              />
            </div>
          )}
        </div>
      </div>

      {/* Gradient Controls (Angle & Color Stops) */}
      {colorMode !== 'solid' && (
        <div className="flex flex-col gap-2 p-2 bg-neutral-900/60 border border-neutral-800/80 rounded-lg">
          {colorMode === 'linear' && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Angle</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={gradient.angle}
                  onChange={(e) =>
                    onChangeGradient({ ...gradient, angle: parseInt(e.target.value) })
                  }
                  className="w-24 accent-amber-400"
                />
                <span className="font-mono text-neutral-300 w-8 text-right text-[11px]">
                  {gradient.angle}°
                </span>
              </div>
            </div>
          )}

          {/* Color Stop preview bar with interactive stop points */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>Color Stops ({gradient.stops.length})</span>
              <button
                onClick={addGradientStop}
                disabled={gradient.stops.length >= 6}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 disabled:opacity-40"
              >
                <Plus className="w-3 h-3" />
                <span>Add Stop</span>
              </button>
            </div>

            <div
              className="h-5 w-full rounded border border-neutral-700 relative overflow-hidden"
              style={{
                background: `linear-gradient(90deg, ${gradient.stops
                  .map((s) => `${s.color} ${s.offset}%`)
                  .join(', ')})`,
              }}
            />

            {/* List of stops */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {gradient.stops.map((stop, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveStopIdx(idx)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs cursor-pointer transition-colors ${
                    activeStopIdx === idx
                      ? 'bg-amber-400/10 border-amber-400/60 text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full border border-neutral-700" style={{ backgroundColor: stop.color }} />
                  <span className="text-[10px] font-mono">{stop.offset}%</span>
                  {gradient.stops.length > 2 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeGradientStop(idx);
                      }}
                      className="text-neutral-500 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preset Gradients Grid */}
      {colorMode !== 'solid' && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-neutral-400 font-medium">Gradient Presets</span>
          <div className="grid grid-cols-4 gap-1.5">
            {GRADIENT_PRESETS.map((p) => {
              const bgGradient = `linear-gradient(${p.gradient.angle}deg, ${p.gradient.stops
                .map((s) => `${s.color} ${s.offset}%`)
                .join(', ')})`;
              return (
                <button
                  key={p.name}
                  onClick={() => onChangeGradient(p.gradient)}
                  title={p.name}
                  className="h-8 rounded border border-neutral-800 hover:border-amber-400/60 transition-transform active:scale-95 overflow-hidden group relative"
                  style={{ background: bgGradient }}
                >
                  <span className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white font-medium transition-opacity px-0.5 text-center leading-tight">
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Solid Palette Swatches */}
      {colorMode === 'solid' && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-neutral-400 font-medium">Palette Colors</span>
          <div className="grid grid-cols-7 gap-1.5">
            {SOLID_PALETTES.map((hex) => (
              <button
                key={hex}
                onClick={() => {
                  onChangeSolidColor(hex);
                  saveRecentColor(hex);
                }}
                className={`h-6 rounded border transition-transform active:scale-90 ${
                  solidColor.toLowerCase() === hex.toLowerCase()
                    ? 'border-amber-400 ring-2 ring-amber-400/30'
                    : 'border-neutral-800 hover:border-neutral-600'
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Custom & Recent Palettes */}
      <div className="flex flex-col gap-2 pt-2 border-t border-neutral-800/60">
        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <span>Custom Palette</span>
          <button
            onClick={addCurrentToCustomPalette}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
          >
            <Plus className="w-3 h-3" />
            <span>Save Color</span>
          </button>
        </div>

        {customPalette.length === 0 ? (
          <div className="text-[11px] text-neutral-600 italic">No saved colors yet</div>
        ) : (
          <div className="flex items-center gap-1.5 flex-wrap">
            {customPalette.map((hex) => (
              <div
                key={hex}
                onClick={() => {
                  if (colorMode === 'solid') onChangeSolidColor(hex);
                  else updateActiveGradientStopColor(hex);
                }}
                className="group relative w-6 h-6 rounded border border-neutral-700 cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: hex }}
              >
                <button
                  onClick={(e) => removeCustomColor(hex, e)}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-neutral-900 border border-neutral-700 rounded-full text-neutral-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px]"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Recently used colors */}
        {recentColors.length > 0 && (
          <div className="flex flex-col gap-1 pt-1">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Recently Used</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {recentColors.map((hex) => (
                <button
                  key={hex}
                  onClick={() => {
                    if (colorMode === 'solid') onChangeSolidColor(hex);
                    else updateActiveGradientStopColor(hex);
                  }}
                  className="w-5 h-5 rounded-full border border-neutral-800 hover:border-neutral-500 transition-transform active:scale-90"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
