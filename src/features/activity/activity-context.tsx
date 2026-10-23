import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Pressable, Text, View } from 'react-native';
import { checkpointTimers, suspendTimers, completedEntries, dateKey, decodeStore, Habit, initialStore, isDue, isTimedHabit, logAmount, planDay, Store, TimerAction, updateTimer } from './model';
import { useAppearance } from './appearance';
import { syncReminders } from './reminders';
export { challenges } from './model';
export type { Category, Challenge } from './model';
const KEY = 'dayly.store.v1';
type ActivityState = {
  store: Store; day: string; habits: Habit[]; daily: Habit[]; completed: string[];
  points: number; totalPoints: number; name: string; error: string;
  setName: (name: string) => void; createDemoAccount: (name: string, email: string) => void; setDemoSignedIn: (value: boolean) => void;
  changeAmount: (habit: Habit, delta: number) => void; saveHabit: (habit: Habit) => void;
  timerAction: (habit: Habit, action: TimerAction) => void;
  archiveHabit: (id: string) => void; retrySave: () => void;
};
const ActivityContext = createContext<ActivityState | null>(null);
export function ActivityProvider({ children }: PropsWithChildren) {
  const { palette } = useAppearance();
  const [store, setStore] = useState<Store>(initialStore);
  const [day, setDay] = useState(dateKey);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const writes = useRef(Promise.resolve());
  const notifications = useRef(Promise.resolve());
  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(KEY).then(raw => {
      const saved = raw ? decodeStore(raw) : initialStore();
      if (alive) { setStore(planDay(suspendTimers(saved), dateKey())); setReady(true); setLoadError(false); }
    }).catch(() => { if (alive) setLoadError(true); });
    return () => { alive = false; };
  }, [retry]);
  useEffect(() => {
    const refresh = () => { const current = dateKey(); setDay(current); setStore(old => planDay(old, current)); };
    const timer = setInterval(() => { refresh(); if (AppState.currentState === 'active') setStore(old => checkpointTimers(old)); }, 5_000);
    const subscription = AppState.addEventListener('change', state => { if (state === 'active') refresh(); else setStore(old => suspendTimers(old, Date.now())); });
    return () => { clearInterval(timer); subscription.remove(); };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const raw = JSON.stringify(store);
    writes.current = writes.current.then(async () => {
      try { await AsyncStorage.setItem(KEY, raw); setError(''); }
      catch { setError('Хадгалж чадсангүй. Доорх товчоор дахин оролдоорой.'); }
    });
  }, [store, ready]);
  useEffect(() => {
    if (!ready) return;
    notifications.current = notifications.current.then(() => syncReminders(store.habits)).catch(() => {
      setError('Сануулгыг тохируулж чадсангүй. Төхөөрөмжийн мэдэгдлийн зөвшөөрлийг шалгаарай.');
    });
  }, [store.habits, ready, day]);
  const mutate = (update: (old: Store) => Store) => {
    const current = dateKey();
    setDay(current);
    setStore(old => planDay(update(planDay(old, current)), current));
  };
  const habits = store.habits;
  const completed = completedEntries(store.logs[day]).map(e => e.habit.id);
  const entries = completedEntries(store.logs[day]);
  const allEntries = Object.values(store.logs).flatMap(completedEntries);
  if (!ready) return <View style={{ flex: 1, backgroundColor: palette.bg, alignItems: 'center', justifyContent: 'center', gap: 20, padding: 30 }}>
    {loadError ? <><Text style={{ color: palette.text, textAlign: 'center' }}>Хадгалсан мэдээллийг нээж чадсангүй. Түүхийг хамгаалахын тулд мэдээллийг дарж бичээгүй.</Text><Pressable accessibilityRole="button" onPress={() => setRetry(n => n + 1)} style={{ padding: 20 }}><Text style={{ color: palette.accent }}>Дахин оролдох</Text></Pressable></> : <ActivityIndicator color={palette.accent} />}
  </View>;
  return <ActivityContext.Provider value={{
    store, habits, day, daily: habits.filter(h => isDue(h, day)), completed, error,
    points: entries.reduce((sum, e) => sum + e.habit.points, 0),
    totalPoints: allEntries.reduce((sum, e) => sum + e.habit.points, 0), name: store.name,
    createDemoAccount: (name, email) => mutate(old => ({ ...old, name: name.trim(), demoAccount: { email: email.trim().toLowerCase(), createdAt: new Date().toISOString() }, demoSignedIn: true })),
    setDemoSignedIn: value => mutate(old => ({ ...suspendTimers(old, Date.now()), demoSignedIn: value })),
    setName: name => mutate(old => ({ ...old, name })),
    timerAction: (habit, action) => mutate(old => updateTimer(old, habit, dateKey(), action)),
    changeAmount: (habit, delta) => mutate(old => { if (isTimedHabit(habit)) return old; const entry = old.logs[dateKey()]?.entries[habit.id]; return logAmount(old, habit, dateKey(), habit.target, habit.unit, (entry?.amount ?? 0) + delta); }),
    saveHabit: habit => mutate(old => ({ ...old, habits: old.habits.some(h => h.id === habit.id) ? old.habits.map(h => h.id === habit.id ? habit : h) : [...old.habits, habit] })),
    archiveHabit: id => mutate(old => {
      const habit = old.habits.find(h => h.id === id);
      const paused = habit && !habit.archived && old.logs[dateKey()]?.entries[id]?.timer ? updateTimer(old, habit, dateKey(), 'pause') : old;
      return { ...paused, habits: paused.habits.map(h => h.id === id ? { ...h, archived: !h.archived, reminder: '' } : h) };
    }),
    retrySave: () => setStore(old => ({ ...old, habits: [...old.habits] })),
  }}>{children}</ActivityContext.Provider>;
}
export function useActivity() { const state = useContext(ActivityContext); if (!state) throw new Error('ActivityProvider is required'); return state; }
