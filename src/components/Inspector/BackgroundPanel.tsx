import React from 'react';
import { Image as ImageIcon, Upload, Trash2, Sliders } from 'lucide-react';
import {
  CanvasBackground,
  CanvasConfig,
  AspectRatioType,
  BackgroundType,
} from '../../types';
import { BACKGROUND_PRESETS } from '../../data/colorPresets';

interface BackgroundPanelProps {
  background: CanvasBackground;
  onChangeBackground: (background: CanvasBackground) => void;
  canvas: CanvasConfig;
  onChangeCanvas: (canvas: Partial<CanvasConfig>) => void;
}

const ASPECT_RATIO_PRESETS: {
  type: AspectRatioType;
  label: string;
  width: number;
  height: number;
}[] = [
  { type: '16:9', label: '16:9 Landscape', width: 1200, height: 675 },
  { type: '1:1', label: '1:1 Square', width: 1080, height: 1080 },
  { type: '9:16', label: '9:16 Story / Reel', width: 1080, height: 1920 },
  { type: '4:5', label: '4:5 Social Post', width: 1080, height: 1350 },
  { type: '3:1', label: '3:1 Banner / Header', width: 1200, height: 400 },
];

export const BackgroundPanel: React.FC<BackgroundPanelProps> = ({
  background,
  onChangeBackground,
  canvas,
  onChangeCanvas,
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChangeBackground({
          ...background,
          type: 'image',
          imageUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAspectRatioSelect = (preset: (typeof ASPECT_RATIO_PRESETS)[0]) => {
    onChangeCanvas({
      aspectRatio: preset.type,
      width: preset.width,
      height: preset.height,
    });
  };

  return (
    <div className="flex flex-col gap-5 text-xs text-neutral-300">
      {/* 1. Canvas Dimensions & Aspect Ratio */}
      <div className="flex flex-col gap-3 p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <span className="font-semibold text-neutral-200">Canvas Dimensions</span>

        {/* Aspect Ratio Buttons */}
        <div className="grid grid-cols-2 gap-1.5">
          {ASPECT_RATIO_PRESETS.map((preset) => (
            <button
              key={preset.type}
              onClick={() => handleAspectRatioSelect(preset)}
              className={`p-2 rounded-lg border text-left transition-colors ${
                canvas.aspectRatio === preset.type
                  ? 'border-amber-500/60 bg-amber-500/10 text-white'
                  : 'border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-400'
              }`}
            >
              <div className="font-medium text-[11px] truncate">{preset.label}</div>
              <div className="text-[10px] text-neutral-500 font-mono">
                {preset.width} × {preset.height}
              </div>
            </button>
          ))}
        </div>

        {/* Custom Width & Height inputs */}
        <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/80">
          <div className="flex-1 flex items-center bg-neutral-950 border border-neutral-800 rounded px-2 py-1">
            <span className="text-[10px] text-neutral-500 mr-1">W</span>
            <input
              type="number"
              min="200"
              max="4000"
              value={canvas.width}
              onChange={(e) =>
                onChangeCanvas({
                  aspectRatio: 'custom',
                  width: Number(e.target.value) || 1200,
                })
              }
              className="w-full bg-transparent font-mono text-xs text-neutral-200 outline-none"
            />
            <span className="text-[10px] text-neutral-500">px</span>
          </div>

          <span className="text-neutral-500 font-mono">×</span>

          <div className="flex-1 flex items-center bg-neutral-950 border border-neutral-800 rounded px-2 py-1">
            <span className="text-[10px] text-neutral-500 mr-1">H</span>
            <input
              type="number"
              min="200"
              max="4000"
              value={canvas.height}
              onChange={(e) =>
                onChangeCanvas({
                  aspectRatio: 'custom',
                  height: Number(e.target.value) || 675,
                })
              }
              className="w-full bg-transparent font-mono text-xs text-neutral-200 outline-none"
            />
            <span className="text-[10px] text-neutral-500">px</span>
          </div>
        </div>
      </div>

      {/* 2. Background Mode Selection */}
      <div className="flex flex-col gap-3 p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <span className="font-semibold text-neutral-200">Canvas Background</span>

        {/* Type selector */}
        <div className="grid grid-cols-4 gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          {(['solid', 'gradient', 'transparent', 'image'] as BackgroundType[]).map((t) => (
            <button
              key={t}
              onClick={() => onChangeBackground({ ...background, type: t })}
              className={`py-1 text-[11px] font-medium rounded capitalize transition-colors ${
                background.type === t
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Solid Background Color */}
        {background.type === 'solid' && (
          <div className="flex items-center gap-2 pt-2">
            <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-lg border border-neutral-800">
              <input
                type="color"
                value={background.color}
                onChange={(e) => onChangeBackground({ ...background, color: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border border-neutral-700 bg-transparent"
              />
              <input
                type="text"
                value={background.color}
                onChange={(e) => onChangeBackground({ ...background, color: e.target.value })}
                className="bg-transparent font-mono text-xs text-neutral-200 w-20 outline-none uppercase"
              />
            </div>
          </div>
        )}

        {/* Gradient Background */}
        {background.type === 'gradient' && (
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-neutral-400">Angle</span>
              <input
                type="range"
                min="0"
                max="360"
                value={background.gradient.angle}
                onChange={(e) =>
                  onChangeBackground({
                    ...background,
                    gradient: { ...background.gradient, angle: Number(e.target.value) },
                  })
                }
                className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded-lg cursor-pointer"
              />
              <span className="font-mono text-[11px] w-9 text-right">
                {background.gradient.angle}°
              </span>
            </div>

            {/* Gradient Stops mini editor */}
            <div className="flex items-center gap-2">
              {background.gradient.stops.map((stop, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-neutral-950 p-1.5 rounded-lg border border-neutral-800"
                >
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => {
                      const nextStops = [...background.gradient.stops];
                      nextStops[i] = { ...stop, color: e.target.value };
                      onChangeBackground({
                        ...background,
                        gradient: { ...background.gradient, stops: nextStops },
                      });
                    }}
                    className="w-5 h-5 rounded cursor-pointer border border-neutral-700 bg-transparent"
                  />
                  <span className="font-mono text-[10px] text-neutral-400 uppercase">
                    {stop.color}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Background */}
        {background.type === 'image' && (
          <div className="flex flex-col gap-3 pt-2">
            {background.imageUrl ? (
              <div className="flex flex-col gap-2">
                <div className="relative h-28 rounded-lg border border-neutral-800 overflow-hidden bg-neutral-950 group">
                  <img
                    src={background.imageUrl}
                    alt="Custom canvas background"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onChangeBackground({ ...background, imageUrl: undefined })}
                    className="absolute top-2 right-2 p-1.5 bg-neutral-950/80 hover:bg-rose-500 text-white rounded transition-colors"
                    title="Remove Image"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Blur Slider */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-neutral-400 w-14">Blur</span>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={background.imageBlur}
                    onChange={(e) =>
                      onChangeBackground({ ...background, imageBlur: Number(e.target.value) })
                    }
                    className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono text-[11px] w-8 text-right">
                    {background.imageBlur}px
                  </span>
                </div>

                {/* Opacity Slider */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-neutral-400 w-14">Opacity</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={background.imageOpacity}
                    onChange={(e) =>
                      onChangeBackground({
                        ...background,
                        imageOpacity: Number(e.target.value),
                      })
                    }
                    className="flex-1 accent-amber-500 h-1 bg-neutral-700 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono text-[11px] w-8 text-right">
                    {Math.round(background.imageOpacity * 100)}%
                  </span>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-800 hover:border-amber-500/50 rounded-lg cursor-pointer transition-colors bg-neutral-950/50 group">
                <Upload
                  size={20}
                  className="text-neutral-500 group-hover:text-amber-400 transition-colors mb-1"
                />
                <span className="text-xs text-neutral-300 font-medium">Upload Background Image</span>
                <span className="text-[10px] text-neutral-500">JPG, PNG, WebP up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        )}
      </div>

      {/* 3. Curated Background Presets */}
      <div className="flex flex-col gap-2 p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
        <span className="font-semibold text-neutral-200">Studio Backdrops</span>
        <div className="grid grid-cols-2 gap-1.5">
          {BACKGROUND_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() =>
                onChangeBackground({
                  type: preset.type,
                  color: preset.color,
                  gradient: preset.gradient,
                  imageBlur: 0,
                  imageOpacity: 1,
                })
              }
              className="flex items-center gap-2 p-2 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-left transition-colors"
            >
              <div
                className="w-5 h-5 rounded border border-neutral-700 shrink-0"
                style={{
                  background:
                    preset.type === 'solid'
                      ? preset.color
                      : preset.type === 'gradient'
                      ? `linear-gradient(${preset.gradient.angle}deg, ${preset.gradient.stops
                          .map((s) => `${s.color} ${s.offset}%`)
                          .join(', ')})`
                      : 'transparent',
                }}
              />
              <span className="text-[11px] text-neutral-300 truncate font-medium">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
