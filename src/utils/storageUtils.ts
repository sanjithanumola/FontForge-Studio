import { Project } from '../types';
import { INITIAL_PROJECT } from '../data/defaultProject';

const STORAGE_KEYS = {
  CURRENT_PROJECT: 'fontforge_current_project_v1',
  PROJECT_LIST: 'fontforge_saved_projects_v1',
  FAVORITE_FONTS: 'fontforge_favorite_fonts_v1',
  RECENT_COLORS: 'fontforge_recent_colors_v1',
  CUSTOM_PALETTES: 'fontforge_custom_palettes_v1',
  THEME: 'fontforge_theme_mode_v1',
};

export function loadCurrentProject(): Project {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.layers) && parsed.canvas) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse current project from storage:', e);
  }
  return INITIAL_PROJECT;
}

export function saveCurrentProject(project: Project): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, JSON.stringify(project));
  } catch (e) {
    console.error('Failed to save project to localStorage:', e);
  }
}

export function getSavedProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECT_LIST);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load saved projects:', e);
  }
  return [];
}

export function saveProjectToList(project: Project): Project[] {
  const list = getSavedProjects();
  const existingIdx = list.findIndex((p) => p.id === project.id);
  const updatedProject = { ...project, updatedAt: Date.now() };

  let nextList: Project[];
  if (existingIdx >= 0) {
    nextList = [...list];
    nextList[existingIdx] = updatedProject;
  } else {
    nextList = [updatedProject, ...list];
  }

  try {
    localStorage.setItem(STORAGE_KEYS.PROJECT_LIST, JSON.stringify(nextList));
  } catch (e) {
    console.error('Failed to persist project list:', e);
  }
  return nextList;
}

export function deleteSavedProject(id: string): Project[] {
  const list = getSavedProjects().filter((p) => p.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECT_LIST, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to delete project:', e);
  }
  return list;
}

export function getFavoriteFonts(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITE_FONTS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return ['Outfit', 'Cinzel', 'Tourney', 'Fraunces', 'Press Start 2P'];
}

export function toggleFavoriteFont(fontName: string): string[] {
  const current = getFavoriteFonts();
  const next = current.includes(fontName)
    ? current.filter((f) => f !== fontName)
    : [...current, fontName];
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITE_FONTS, JSON.stringify(next));
  } catch {}
  return next;
}

export function getRecentColors(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENT_COLORS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return ['#FFFFFF', '#FFE066', '#F59E0B', '#00F2FE', '#FF007F', '#10B981', '#0F172A'];
}

export function addRecentColor(color: string): string[] {
  if (!color || color === 'transparent') return getRecentColors();
  const current = getRecentColors().filter((c) => c.toLowerCase() !== color.toLowerCase());
  const next = [color, ...current].slice(0, 16);
  try {
    localStorage.setItem(STORAGE_KEYS.RECENT_COLORS, JSON.stringify(next));
  } catch {}
  return next;
}

export function getThemePreference(): 'dark' | 'light' {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {}
  return 'dark';
}

export function saveThemePreference(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch {}
}
