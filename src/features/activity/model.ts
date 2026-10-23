export type Category = 'Хөдөлгөөн' | 'Төвлөрөл' | 'Өөртөө';
export type Challenge = {
  id: string; title: string; description: string; category: Category;
  minutes: number; points: number; icon: 'walk' | 'mind' | 'water' | 'book' | 'stretch' | 'sun';
  color: string; steps: string[]; tracking?: 'count' | 'timer';
};
export const challenges: Challenge[] = [
  { id: 'walk', title: 'Гадаа 20 минут алх', description: 'Гадаа 20 минут алхах.', category: 'Хөдөлгөөн', minutes: 20, points: 100, icon: 'walk', color: '#93C5FD', steps: ['Тухтай гутлаа өмсөөд гадаа гараарай.', '20 минут өөрт тохирсон хурдаар алхаарай.', 'Эргэн тойрноосоо өмнө нь анзаараагүй 3 зүйл олоорой.'] },
  { id: 'breathe', title: 'Амьсгалдаа анхаар', description: '5 минут амьсгалдаа анхаарах.', category: 'Төвлөрөл', minutes: 5, points: 40, icon: 'mind', color: '#C6B8F5', steps: ['Тайван, тухтай газар суугаарай.', 'Амьсгалаа хүчлэхгүйгээр ажиглаарай.', 'Бодол сарнивал амьсгалдаа зөөлөн буцаарай.'] },
  { id: 'water', title: 'Нэг аяга ус уугаарай', description: 'Нэг аяга ус уух.', category: 'Өөртөө', minutes: 2, points: 20, icon: 'water', color: '#A8D9E8', steps: ['Аягандаа ус хийгээрэй.', 'Яаралгүй уугаад, хэсэг амраарай.'] },
  { id: 'stretch', title: 'Биеэ зөөлөн сунга', description: '10 минутын сунгалт хийх.', category: 'Хөдөлгөөн', minutes: 10, points: 60, icon: 'stretch', color: '#F2BD96', steps: ['Мөр, гараа зөөлөн хөдөлгөөрэй.', 'Өөрт тухтай хүрээнд биеэ сунгаарай.', 'Өвдөлт мэдрэгдвэл зогсоорой.'] },
  { id: 'read', title: 'Номын 10 хуудас унш', description: 'Номын 10 хуудас унших.', category: 'Төвлөрөл', minutes: 15, points: 80, icon: 'book', color: '#C6B8F5', steps: ['Унших дуртай номоо сонгоорой.', '10 хуудас анхаарлаа төвлөрүүлэн уншаарай.', 'Таалагдсан нэг санаагаа тэмдэглээрэй.'] },
  { id: 'gratitude', title: 'Талархах 3 зүйлээ бич', description: 'Талархаж буй 3 зүйлээ тэмдэглэх.', category: 'Өөртөө', minutes: 5, points: 40, icon: 'sun', color: '#F4D785', steps: ['Цаас эсвэл тэмдэглэлээ нээгээрэй.', 'Талархаж байгаа 3 зүйлээ бичээрэй.', 'Нэгийг нь яагаад сонгосноо бодоорой.'] },
];

export type Period = 'Өглөө' | 'Өдөр' | 'Орой';
export type Habit = Challenge & {
  days: number[]; period: Period; target: number; unit: string;
  archived: boolean; created: string; reminder: string;
};
export type Entry = { habit: Challenge; target: number; unit: string; amount: number; completedAt?: string; timer?: { elapsedMs: number; runningSince?: number } };
export type DayLog = { planned: string[]; entries: Record<string, Entry> };
export type Store = { version: 1; name: string; demoAccount?: { email: string; createdAt: string }; demoSignedIn?: boolean; habits: Habit[]; logs: Record<string, DayLog> };
export const dateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const parseDate = (key: string) => new Date(`${key}T12:00:00`);
export function shiftDay(key: string, offset: number) { const d = parseDate(key); d.setDate(d.getDate() + offset); return dateKey(d); }
export const isDue = (habit: Habit, day: string) => !habit.archived && habit.created <= day && habit.days.includes(parseDate(day).getDay());
export function initialStore(): Store {
  return { version: 1, name: 'Тэмүүлэн', logs: {}, habits: challenges.slice(0, 3).map((item, i) => ({ ...item, days: [0,1,2,3,4,5,6], period: i === 0 ? 'Өглөө' : 'Өдөр', target: 1, unit: 'удаа', archived: false, created: dateKey(), reminder: '' })) };
}
export function planDay(store: Store, day: string): Store {
  const last = Object.keys(store.logs).filter(key => key < day).sort().at(-1);
  if (last && !store.logs[day]) {
    const logs = { ...store.logs };
    for (let key = shiftDay(last, 1); key < day; key = shiftDay(key, 1)) {
      if (!logs[key]) logs[key] = { planned: store.habits.filter(h => isDue(h, key)).map(h => h.id), entries: {} };
    }
    store = { ...store, logs };
  }
  const planned = store.habits.filter(h => isDue(h, day)).map(h => h.id);
  const old = store.logs[day];
  if (old && JSON.stringify(old.planned) === JSON.stringify(planned)) return store;
  return { ...store, logs: { ...store.logs, [day]: { planned, entries: old?.entries ?? {} } } };
}
export function logAmount(store: Store, habit: Challenge, day: string, target: number, unit: string, amount: number): Store {
  const old = store.logs[day] ?? { planned: [], entries: {} };
  const previous = old.entries[habit.id];
  if (previous?.timer) return store;
  const value = Math.max(0, Math.min(amount, previous?.target ?? target));
  const entry: Entry = { habit: previous?.habit ?? { ...habit }, target: previous?.target ?? target, unit: previous?.unit ?? unit, amount: value };
  if (value >= entry.target) entry.completedAt = previous?.completedAt ?? new Date().toISOString();
  return { ...store, logs: { ...store.logs, [day]: { ...old, entries: { ...old.entries, [habit.id]: entry } } } };
}
export const completedEntries = (log?: DayLog) => Object.values(log?.entries ?? {}).filter(e => e.amount >= e.target);
export function streak(habit: Habit, logs: Store['logs'], today: string): number {
  let count = 0;
  for (let day = today; day >= habit.created; day = shiftDay(day, -1)) {
    const log = logs[day];
    const scheduled = log ? log.planned.includes(habit.id) : habit.days.includes(parseDate(day).getDay());
    if (!scheduled) continue;
    const e = log?.entries[habit.id];
    if (e && e.amount >= e.target) count++;
    else if (day !== today) break;
  }
  return count;
}
export function decodeStore(raw: string): Store {
  const value = JSON.parse(raw) as Store;
  if (value.version !== 1 || typeof value.name !== 'string' || !Array.isArray(value.habits) || !value.logs || typeof value.logs !== 'object') throw new Error('Invalid saved data');
  for (const h of value.habits) {
    if (typeof h.id !== 'string' || typeof h.title !== 'string' || !Array.isArray(h.days) || !h.days.length || h.days.some(d => !Number.isInteger(d) || d < 0 || d > 6) || !Number.isFinite(h.target) || h.target < 1 || !['Өглөө','Өдөр','Орой'].includes(h.period) || typeof h.created !== 'string' || !Array.isArray(h.steps) || !Number.isFinite(h.minutes) || h.minutes < 1 || (h.tracking !== undefined && !['count','timer'].includes(h.tracking))) throw new Error('Invalid habit');
  }
  for (const log of Object.values(value.logs)) {
    if (!Array.isArray(log.planned) || !log.entries || typeof log.entries !== 'object') throw new Error('Invalid log');
    for (const e of Object.values(log.entries)) {
      if (e.timer && (!Number.isFinite(e.timer.elapsedMs) || e.timer.elapsedMs < 0 || (e.timer.runningSince !== undefined && !Number.isFinite(e.timer.runningSince)))) throw new Error('Invalid timer');
      if (!e.habit || typeof e.habit.title !== 'string' || !Number.isFinite(e.target) || e.target < 1 || !Number.isFinite(e.amount) || e.amount < 0) throw new Error('Invalid entry');
    }
  }
  for (const h of value.habits) if (['#D6F67A','#C4B5FD'].includes(h.color?.toUpperCase())) h.color = '#93C5FD';
  for (const log of Object.values(value.logs)) for (const e of Object.values(log.entries)) if (['#D6F67A','#C4B5FD'].includes(e.habit.color?.toUpperCase())) e.habit.color = '#93C5FD';
  return value;
}

export const isTimedHabit = (habit: Challenge) => habit.tracking ? habit.tracking === 'timer' : ['walk','breathe','stretch'].includes(habit.id);
export const formatDuration = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(Math.floor(seconds % 60)).padStart(2,'0')}`;
export function timerElapsed(entry: Entry | undefined, day: string, now = Date.now()): number {
  if (!entry?.timer) return 0;
  const end = new Date(`${day}T00:00:00`); end.setDate(end.getDate()+1);
  const clock = Math.min(now, end.getTime());
  const elapsed = entry.timer.elapsedMs + (entry.timer.runningSince === undefined ? 0 : Math.max(0, clock - entry.timer.runningSince));
  return Math.min(entry.target * 1000, elapsed);
}
export type TimerAction = 'start' | 'pause' | 'finish' | 'reset';
export function updateTimer(store: Store, habit: Habit, day: string, action: TimerAction, now = Date.now()): Store {
  const log = store.logs[day] ?? { planned: [], entries: {} };
  const previous = log.entries[habit.id];
  if (!isTimedHabit(habit) && !previous?.timer) return store;
  const fresh: Entry = { habit: { ...habit }, target: habit.minutes * 60, unit: 'сек', amount: 0, timer: { elapsedMs: 0 } };
  const entry = action === 'reset' ? fresh : previous?.timer ? previous : previous?.amount ? previous : fresh;
  if (!entry.timer || (entry.completedAt && action !== 'reset')) return store;
  const elapsedMs = timerElapsed(entry, day, now);
  let next: Entry = { ...entry, timer: { elapsedMs } };
  if (action === 'start') {
    if (entry.timer.runningSince !== undefined) return store;
    if (elapsedMs < entry.target * 1000) next.timer = { elapsedMs, runningSince: now };
  }
  if (action === 'finish') {
    if (elapsedMs < entry.target * 1000) return store;
    next = { ...next, amount: entry.target, completedAt: new Date(now).toISOString() };
  }
  return { ...store, logs: { ...store.logs, [day]: { ...log, entries: { ...log.entries, [habit.id]: next } } } };
}

// On reopening, require an explicit resume; only previously saved elapsed time survives.
export function suspendTimers(store: Store, now?: number): Store {
  let changed = false;
  const logs = Object.fromEntries(Object.entries(store.logs).map(([day, log]) => {
    const entries = Object.fromEntries(Object.entries(log.entries).map(([id, entry]) => {
      if (entry.timer?.runningSince === undefined) return [id, entry];
      changed = true;
      return [id, { ...entry, timer: { elapsedMs: now === undefined ? entry.timer.elapsedMs : timerElapsed(entry, day, now) } }];
    }));
    return [day, { ...log, entries }];
  }));
  return changed ? { ...store, logs } : store;
}
export function checkpointTimers(store: Store, now = Date.now()): Store {
  let changed = false;
  const day = dateKey(new Date(now));
  const log = store.logs[day];
  if (!log) return store;
  const entries = Object.fromEntries(Object.entries(log.entries).map(([id, entry]) => {
    if (entry.timer?.runningSince === undefined) return [id, entry];
    changed = true;
    return [id, { ...entry, timer: { elapsedMs: timerElapsed(entry, day, now), runningSince: now } }];
  }));
  return changed ? { ...store, logs: { ...store.logs, [day]: { ...log, entries } } } : store;
}
