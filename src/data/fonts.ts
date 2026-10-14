import { FontCategory, FontItem } from '../types';

export const FONT_CATEGORIES: { id: FontCategory; label: string }[] = [
  { id: 'sans-serif', label: 'Sans-Serif' },
  { id: 'serif', label: 'Serif' },
  { id: 'display', label: 'Display' },
  { id: 'script', label: 'Script' },
  { id: 'handwriting', label: 'Handwriting' },
  { id: 'monospace', label: 'Monospace' },
  { id: 'retro', label: 'Retro' },
  { id: 'futuristic', label: 'Futuristic' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'elegant', label: 'Elegant' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'decorative', label: 'Decorative' },
];

export const FONT_LIBRARY: FontItem[] = [
  // Sans-Serif
  { id: 'outfit', name: 'Outfit', category: 'sans-serif', googleFont: 'Outfit:wght@300;400;600;700;800;900', weights: [300, 400, 600, 700, 800, 900], fallback: 'sans-serif' },
  { id: 'plus-jakarta-sans', name: 'Plus Jakarta Sans', category: 'sans-serif', googleFont: 'Plus+Jakarta+Sans:wght@400;500;600;700;800', weights: [400, 500, 600, 700, 800], fallback: 'sans-serif' },
  { id: 'dm-sans', name: 'DM Sans', category: 'sans-serif', googleFont: 'DM+Sans:ital,wght@0,400;0,700;1,400', weights: [400, 700], fallback: 'sans-serif' },
  { id: 'poppins', name: 'Poppins', category: 'sans-serif', googleFont: 'Poppins:wght@300;400;600;700;900', weights: [300, 400, 600, 700, 900], fallback: 'sans-serif' },
  { id: 'montserrat', name: 'Montserrat', category: 'sans-serif', googleFont: 'Montserrat:wght@400;600;700;800;900', weights: [400, 600, 700, 800, 900], fallback: 'sans-serif' },
  { id: 'raleway', name: 'Raleway', category: 'sans-serif', googleFont: 'Raleway:wght@400;600;700;900', weights: [400, 600, 700, 900], fallback: 'sans-serif' },

  // Serif
  { id: 'playfair-display', name: 'Playfair Display', category: 'serif', googleFont: 'Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700', weights: [400, 700, 900], fallback: 'serif' },
  { id: 'cinzel', name: 'Cinzel', category: 'serif', googleFont: 'Cinzel:wght@400;600;700;800;900', weights: [400, 600, 700, 800, 900], fallback: 'serif' },
  { id: 'cormorant-garamond', name: 'Cormorant Garamond', category: 'serif', googleFont: 'Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400', weights: [400, 600, 700], fallback: 'serif' },
  { id: 'fraunces', name: 'Fraunces', category: 'serif', googleFont: 'Fraunces:wght@400;600;700;900', weights: [400, 600, 700, 900], fallback: 'serif' },
  { id: 'merriweather', name: 'Merriweather', category: 'serif', googleFont: 'Merriweather:wght@400;700;900', weights: [400, 700, 900], fallback: 'serif' },
  { id: 'lora', name: 'Lora', category: 'serif', googleFont: 'Lora:wght@400;600;700', weights: [400, 600, 700], fallback: 'serif' },

  // Display
  { id: 'bebas-neue', name: 'Bebas Neue', category: 'display', googleFont: 'Bebas+Neue', weights: [400], fallback: 'sans-serif' },
  { id: 'anton', name: 'Anton', category: 'display', googleFont: 'Anton', weights: [400], fallback: 'sans-serif' },
  { id: 'righteous', name: 'Righteous', category: 'display', googleFont: 'Righteous', weights: [400], fallback: 'cursive' },
  { id: 'alfa-slab-one', name: 'Alfa Slab One', category: 'display', googleFont: 'Alfa+Slab+One', weights: [400], fallback: 'serif' },
  { id: 'shrikhand', name: 'Shrikhand', category: 'display', googleFont: 'Shrikhand', weights: [400], fallback: 'cursive' },
  { id: 'abril-fatface', name: 'Abril Fatface', category: 'display', googleFont: 'Abril+Fatface', weights: [400], fallback: 'serif' },
  { id: 'bungee', name: 'Bungee', category: 'display', googleFont: 'Bungee', weights: [400], fallback: 'sans-serif' },

  // Script
  { id: 'great-vibes', name: 'Great Vibes', category: 'script', googleFont: 'Great+Vibes', weights: [400], fallback: 'cursive' },
  { id: 'alex-brush', name: 'Alex Brush', category: 'script', googleFont: 'Alex+Brush', weights: [400], fallback: 'cursive' },
  { id: 'allura', name: 'Allura', category: 'script', googleFont: 'Allura', weights: [400], fallback: 'cursive' },
  { id: 'satisfy', name: 'Satisfy', category: 'script', googleFont: 'Satisfy', weights: [400], fallback: 'cursive' },
  { id: 'dancing-script', name: 'Dancing Script', category: 'script', googleFont: 'Dancing+Script:wght@400;700', weights: [400, 700], fallback: 'cursive' },

  // Handwriting
  { id: 'caveat', name: 'Caveat', category: 'handwriting', googleFont: 'Caveat:wght@400;700', weights: [400, 700], fallback: 'cursive' },
  { id: 'pacifico', name: 'Pacifico', category: 'handwriting', googleFont: 'Pacifico', weights: [400], fallback: 'cursive' },
  { id: 'shadows-into-light', name: 'Shadows Into Light', category: 'handwriting', googleFont: 'Shadows+Into+Light', weights: [400], fallback: 'cursive' },
  { id: 'kalam', name: 'Kalam', category: 'handwriting', googleFont: 'Kalam:wght@400;700', weights: [400, 700], fallback: 'cursive' },
  { id: 'architects-daughter', name: 'Architects Daughter', category: 'handwriting', googleFont: 'Architects+Daughter', weights: [400], fallback: 'cursive' },

  // Monospace
  { id: 'space-mono', name: 'Space Mono', category: 'monospace', googleFont: 'Space+Mono:ital,wght@0,400;0,700;1,400', weights: [400, 700], fallback: 'monospace' },
  { id: 'fira-code', name: 'Fira Code', category: 'monospace', googleFont: 'Fira+Code:wght@400;600;700', weights: [400, 600, 700], fallback: 'monospace' },
  { id: 'source-code-pro', name: 'Source Code Pro', category: 'monospace', googleFont: 'Source+Code+Pro:wght@400;600;700', weights: [400, 600, 700], fallback: 'monospace' },
  { id: 'vt323', name: 'VT323', category: 'monospace', googleFont: 'VT323', weights: [400], fallback: 'monospace' },

  // Retro
  { id: 'lobster', name: 'Lobster', category: 'retro', googleFont: 'Lobster', weights: [400], fallback: 'cursive' },
  { id: 'bungee-shade', name: 'Bungee Shade', category: 'retro', googleFont: 'Bungee+Shade', weights: [400], fallback: 'sans-serif' },
  { id: 'monoton', name: 'Monoton', category: 'retro', googleFont: 'Monoton', weights: [400], fallback: 'cursive' },
  { id: 'rye', name: 'Rye', category: 'retro', googleFont: 'Rye', weights: [400], fallback: 'serif' },
  { id: 'faster-one', name: 'Faster One', category: 'retro', googleFont: 'Faster+One', weights: [400], fallback: 'cursive' },
  { id: 'fascinate', name: 'Fascinate', category: 'retro', googleFont: 'Fascinate', weights: [400], fallback: 'cursive' },

  // Futuristic
  { id: 'orbitron', name: 'Orbitron', category: 'futuristic', googleFont: 'Orbitron:wght@400;600;700;900', weights: [400, 600, 700, 900], fallback: 'sans-serif' },
  { id: 'audiowide', name: 'Audiowide', category: 'futuristic', googleFont: 'Audiowide', weights: [400], fallback: 'sans-serif' },
  { id: 'michroma', name: 'Michroma', category: 'futuristic', googleFont: 'Michroma', weights: [400], fallback: 'sans-serif' },
  { id: 'russo-one', name: 'Russo One', category: 'futuristic', googleFont: 'Russo+One', weights: [400], fallback: 'sans-serif' },
  { id: 'exo-2', name: 'Exo 2', category: 'futuristic', googleFont: 'Exo+2:wght@400;700;900', weights: [400, 700, 900], fallback: 'sans-serif' },

  // Gaming
  { id: 'press-start-2p', name: 'Press Start 2P', category: 'gaming', googleFont: 'Press+Start+2P', weights: [400], fallback: 'monospace' },
  { id: 'black-ops-one', name: 'Black Ops One', category: 'gaming', googleFont: 'Black+Ops+One', weights: [400], fallback: 'cursive' },
  { id: 'silkscreen', name: 'Silkscreen', category: 'gaming', googleFont: 'Silkscreen:wght@400;700', weights: [400, 700], fallback: 'monospace' },
  { id: 'tourney', name: 'Tourney', category: 'gaming', googleFont: 'Tourney:wght@400;700;900', weights: [400, 700, 900], fallback: 'sans-serif' },

  // Elegant
  { id: 'cormorant', name: 'Cormorant', category: 'elegant', googleFont: 'Cormorant:wght@400;600;700', weights: [400, 600, 700], fallback: 'serif' },
  { id: 'marcellus', name: 'Marcellus', category: 'elegant', googleFont: 'Marcellus', weights: [400], fallback: 'serif' },
  { id: 'prata', name: 'Prata', category: 'elegant', googleFont: 'Prata', weights: [400], fallback: 'serif' },
  { id: 'italianno', name: 'Italianno', category: 'elegant', googleFont: 'Italianno', weights: [400], fallback: 'cursive' },

  // Minimal
  { id: 'syne', name: 'Syne', category: 'minimal', googleFont: 'Syne:wght@400;600;700;800', weights: [400, 600, 700, 800], fallback: 'sans-serif' },
  { id: 'tenor-sans', name: 'Tenor Sans', category: 'minimal', googleFont: 'Tenor+Sans', weights: [400], fallback: 'sans-serif' },
  { id: 'jost', name: 'Jost', category: 'minimal', googleFont: 'Jost:wght@300;400;600;700', weights: [300, 400, 600, 700], fallback: 'sans-serif' },
  { id: 'questrial', name: 'Questrial', category: 'minimal', googleFont: 'Questrial', weights: [400], fallback: 'sans-serif' },

  // Decorative
  { id: 'creepster', name: 'Creepster', category: 'decorative', googleFont: 'Creepster', weights: [400], fallback: 'cursive' },
  { id: 'special-elite', name: 'Special Elite', category: 'decorative', googleFont: 'Special+Elite', weights: [400], fallback: 'cursive' },
  { id: 'nosifer', name: 'Nosifer', category: 'decorative', googleFont: 'Nosifer', weights: [400], fallback: 'cursive' },
  { id: 'rubik-glitch', name: 'Rubik Glitch', category: 'decorative', googleFont: 'Rubik+Glitch', weights: [400], fallback: 'cursive' },
];

const loadedFonts = new Set<string>();

/**
 * Dynamically loads a Google Font if it hasn't been loaded yet.
 */
export function loadGoogleFont(fontName: string): Promise<boolean> {
  const fontItem = FONT_LIBRARY.find(
    (f) => f.name.toLowerCase() === fontName.toLowerCase() || f.id === fontName.toLowerCase()
  );

  if (!fontItem || loadedFonts.has(fontItem.id)) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    try {
      const linkId = `google-font-${fontItem.id}`;
      if (document.getElementById(linkId)) {
        loadedFonts.add(fontItem.id);
        resolve(true);
        return;
      }

      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontItem.googleFont}&display=swap`;
      link.onload = () => {
        loadedFonts.add(fontItem.id);
        // Wait for document.fonts to register the new face
        if ('fonts' in document) {
          document.fonts.ready.then(() => resolve(true)).catch(() => resolve(true));
        } else {
          resolve(true);
        }
      };
      link.onerror = () => {
        console.warn(`Failed to load Google Font: ${fontItem.name}, falling back to system font.`);
        resolve(false);
      };
      document.head.appendChild(link);
    } catch {
      resolve(false);
    }
  });
}
