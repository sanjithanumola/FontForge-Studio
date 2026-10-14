import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { TEXT_PRESETS } from '../../data/presets';
import { TextPreset, PresetCategory, TextLayer, CanvasBackground } from '../../types';
import { loadGoogleFont } from '../../data/fonts';

interface PresetsPanelProps {
  onApplyPreset: (preset: TextPreset) => void;
  activeLayer: TextLayer;
  background: CanvasBackground;
}

const CATEGORIES: ('All' | PresetCategory)[] = [
  'All',
  'Gaming Logos',
  'YouTube Thumbnails',
  'Social Media Titles',
  'Instagram Typography',
  'Modern Business Headings',
  'Luxury Branding',
  'Movie Titles',
  'Cyberpunk',
  'Graffiti',
  'Retro Arcade',
  'Futuristic Technology',
  'Minimalist Typography',
  'Wedding & Invitation',
  'Neon Signage',
  '3D Headline Styles',
];

export const PresetsPanel: React.FC<PresetsPanelProps> = ({ onApplyPreset }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | PresetCategory>('All');

  const filteredPresets = TEXT_PRESETS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.previewText.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePresetClick = (preset: TextPreset) => {
    if (preset.layer.fontFamily) {
      loadGoogleFont(preset.layer.fontFamily);
    }
    onApplyPreset(preset);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search styles (e.g. Cyberpunk, 3D, Gold)..."
          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/70 transition-colors"
        />
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-amber-400 text-neutral-950 font-semibold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-[480px] overflow-y-auto pr-1">
        {filteredPresets.map((preset) => {
          return (
            <div
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              onMouseEnter={() => {
                if (preset.layer.fontFamily) loadGoogleFont(preset.layer.fontFamily);
              }}
              className="group p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900 hover:border-amber-400/50 cursor-pointer flex flex-col justify-between gap-2 transition-all hover:scale-[1.02]"
            >
              {/* Visual Card Preview */}
              <div
                className="h-16 rounded-md flex items-center justify-center p-2 overflow-hidden shadow-inner border border-neutral-800/80"
                style={{
                  backgroundColor: preset.background?.color || '#0B0F19',
                }}
              >
                <span
                  className="text-base font-bold text-center leading-tight truncate tracking-wide"
                  style={{
                    fontFamily: `"${preset.layer.fontFamily}", sans-serif`,
                    color: preset.layer.solidColor || '#FFFFFF',
                    letterSpacing: `${(preset.layer.letterSpacing || 0) * 0.5}px`,
                    textTransform: preset.layer.textTransform,
                  }}
                >
                  {preset.previewText}
                </span>
              </div>

              {/* Title & Category */}
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                  {preset.name}
                </span>
                <span className="text-[10px] text-neutral-400 truncate">
                  {preset.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
