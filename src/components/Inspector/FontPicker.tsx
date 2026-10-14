import React, { useState, useEffect } from 'react';
import { Search, Star, Clock } from 'lucide-react';
import { FONT_LIBRARY, FONT_CATEGORIES, loadGoogleFont } from '../../data/fonts';
import { FontCategory, FontItem } from '../../types';

interface FontPickerProps {
  currentFont: string;
  onSelectFont: (font: FontItem) => void;
}

export const FontPicker: React.FC<FontPickerProps> = ({ currentFont, onSelectFont }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FontCategory | 'all'>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('fontforge_favorite_fonts') || '["outfit","playfair-display","cinzel","bebas-neue"]');
    } catch {
      return ['outfit', 'playfair-display'];
    }
  });
  const [recentFonts, setRecentFonts] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('fontforge_recent_fonts') || '[]');
    } catch {
      return [];
    }
  });

  const toggleFavorite = (fontId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.includes(fontId)
      ? favorites.filter((id) => id !== fontId)
      : [...favorites, fontId];
    setFavorites(updated);
    try {
      localStorage.setItem('fontforge_favorite_fonts', JSON.stringify(updated));
    } catch {}
  };

  const handleSelectFont = (font: FontItem) => {
    loadGoogleFont(font.name);
    onSelectFont(font);

    // Save to recents
    const updatedRecent = [font.id, ...recentFonts.filter((id) => id !== font.id)].slice(0, 8);
    setRecentFonts(updatedRecent);
    try {
      localStorage.setItem('fontforge_recent_fonts', JSON.stringify(updatedRecent));
    } catch {}
  };

  // Preload visible fonts on scroll or filter
  useEffect(() => {
    loadGoogleFont(currentFont);
  }, [currentFont]);

  const filteredFonts = FONT_LIBRARY.filter((font) => {
    const matchesSearch =
      font.name.toLowerCase().includes(search.toLowerCase()) ||
      font.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || font.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search 60+ fonts..."
          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/70 transition-colors"
        />
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-amber-400 text-neutral-950 font-semibold'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          All
        </button>
        {FONT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-amber-400 text-neutral-950 font-semibold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Recents list if available */}
      {recentFonts.length > 0 && search === '' && selectedCategory === 'all' && (
        <div className="flex flex-col gap-1.5 pt-1 border-t border-neutral-800/60">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium">
            <Clock className="w-3 h-3 text-neutral-500" />
            <span>Recently Used</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {recentFonts.map((id) => {
              const font = FONT_LIBRARY.find((f) => f.id === id);
              if (!font) return null;
              const isSelected = font.name.toLowerCase() === currentFont.toLowerCase();
              return (
                <button
                  key={id}
                  onClick={() => handleSelectFont(font)}
                  className={`px-2 py-1 text-xs rounded border transition-colors ${
                    isSelected
                      ? 'bg-amber-400/10 text-amber-300 border-amber-400/40'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                  }`}
                  style={{ fontFamily: `"${font.name}", sans-serif` }}
                >
                  {font.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Font list with live preview */}
      <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
        {filteredFonts.length === 0 ? (
          <div className="py-6 text-center text-neutral-500 text-xs">
            No fonts found matching "{search}"
          </div>
        ) : (
          filteredFonts.map((font) => {
            const isSelected = font.name.toLowerCase() === currentFont.toLowerCase();
            const isFavorite = favorites.includes(font.id);

            return (
              <div
                key={font.id}
                onClick={() => handleSelectFont(font)}
                onMouseEnter={() => loadGoogleFont(font.name)}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-amber-400/10 border-amber-400/50 text-white'
                    : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800/80 text-neutral-200'
                }`}
              >
                <div className="flex flex-col gap-0.5 overflow-hidden pr-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold">{font.name}</span>
                    <span className="text-[10px] text-neutral-500 uppercase">{font.category}</span>
                  </div>
                  <span
                    className="text-base text-neutral-300 truncate tracking-wide"
                    style={{ fontFamily: `"${font.name}", ${font.fallback}` }}
                  >
                    Sphinx of black quartz, judge my vow
                  </span>
                </div>

                <button
                  onClick={(e) => toggleFavorite(font.id, e)}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  className="p-1 text-neutral-500 hover:text-amber-400 transition-colors shrink-0"
                >
                  <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
