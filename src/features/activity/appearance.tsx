import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react';
export const darkPalette = {
  bg: '#1F1F1F', card: '#252A33', line: '#8190A5', text: '#F1F5F9', muted: '#B3C0D2',
  primary: '#93C5FD', accent: '#93C5FD', onAccent: '#102238', selected: '#203653', selectedBorder: '#7DA8DB',
  done: '#1B304A', doneBorder: '#7DA8DB', tab: '#22262D', track: '#334155', purple: '#93C5FD', warning: '#FDBA74',
  primaryTrack: '#4B78AA',
};
export type Palette = typeof darkPalette;
export const lightPalette: Palette = {
  bg: '#F9FAFB', card: '#FFFFFF', line: '#8190A5', text: '#172033', muted: '#4B5B70',
  primary: '#1D4ED8', accent: '#1D4ED8', onAccent: '#FFFFFF', selected: '#E7EFFF', selectedBorder: '#476EA8',
  done: '#EBF2FF', doneBorder: '#476EA8', tab: '#FFFFFF', track: '#DCE5F1', purple: '#1D4ED8', warning: '#9A3412',
  primaryTrack: '#173B9E',
};
type Appearance = { mode: 'dark' | 'light'; palette: Palette; setMode: (mode: 'dark' | 'light') => void; error: boolean };
const Context = createContext<Appearance>({ mode: 'dark', palette: darkPalette, setMode: () => {}, error: false });
export function AppearanceProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const writes = useRef(Promise.resolve());
  useEffect(() => { let active = true; AsyncStorage.getItem('dayly.appearance').then(value => { if (active && (value === 'light' || value === 'dark')) setMode(value); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setReady(true); }); return () => { active = false; }; }, []);
  useEffect(() => { if (!ready) return; writes.current = writes.current.then(async () => { try { await AsyncStorage.setItem('dayly.appearance',mode); setError(false); } catch { setError(true); } }); }, [mode,ready]);
  const value = useMemo(() => ({ mode, palette: mode === 'dark' ? darkPalette : lightPalette, setMode, error }), [mode,error]);
  return <Context.Provider value={value}>{ready ? children : null}</Context.Provider>;
}
export const useAppearance = () => useContext(Context);
export function useStyles<T>(factory: (palette: Palette) => T): T { const { palette } = useAppearance(); return useMemo(() => factory(palette), [factory,palette]); }
