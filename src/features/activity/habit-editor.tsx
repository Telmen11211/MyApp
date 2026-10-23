import { Palette } from './appearance';
import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActivity } from './activity-context';
import { Category, Challenge, dateKey, Habit, isTimedHabit, Period } from './model';
import { requestReminderPermission } from './reminders';
import { useUI, useStyles, Button, Icon } from './ui';
const weekdays = ['Ня', 'Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя'];
export function HabitEditor({ habit, onClose }: { habit?: Habit | Challenge; onClose: () => void }) {
  const { palette, s } = useUI();
  const styles = useStyles(makeStyles);
  const { saveHabit, archiveHabit, habits } = useActivity();
  const existing = habit && 'days' in habit ? habit : undefined;
  const [title, setTitle] = useState(habit?.title ?? '');
  const [category, setCategory] = useState<Category>(habit?.category ?? 'Өөртөө');
  const [period, setPeriod] = useState<Period>(existing?.period ?? 'Өглөө');
  const [days, setDays] = useState(existing?.days ?? [0,1,2,3,4,5,6]);
  const [target, setTarget] = useState(String(existing?.target ?? 1));
  const [tracking, setTracking] = useState<'count' | 'timer'>(habit && isTimedHabit(habit) ? 'timer' : 'count');
  const [minutes, setMinutes] = useState(String(habit?.minutes ?? 20));
  const [unit, setUnit] = useState(existing?.unit ?? 'удаа');
  const [reminder, setReminder] = useState(Boolean(existing?.reminder));
  const [time, setTime] = useState(existing?.reminder || '09:00');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (saving) return;
    const amount = Number(target);
    if (!title.trim()) return setError('Дадлынхаа нэрийг оруулаарай.');
    if (!days.length) return setError('Хийх өдрөөсөө дор хаяж нэгийг сонгоорой.');
    if (tracking === 'timer' && (!Number.isInteger(Number(minutes)) || Number(minutes) < 1 || Number(minutes) > 999)) return setError('Хугацааг 1–999 минутаар оруулаарай.');
    if (tracking === 'count' && (!Number.isInteger(amount) || amount < 1 || amount > 999)) return setError('Хэмжээг 1–999 хооронд бүхэл тоогоор оруулаарай.');
    if (tracking === 'count' && !unit.trim()) return setError('Хэмжих нэгжээ оруулаарай.');
    if (reminder && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return setError('Цагаа 09:00 хэлбэрээр оруулаарай.');
    if (reminder && habits.filter(h => !h.archived && h.reminder && h.id !== existing?.id).length >= 8) return setError('Найм хүртэл дадалд сануулга тохируулж болно.');
    setSaving(true);
    try {
      if (reminder && !(await requestReminderPermission())) { setError('Мэдэгдлийн зөвшөөрөл шаардлагатай. Төхөөрөмжийн тохиргооноос зөвшөөрөх эсвэл сануулгаа унтраагаад хадгалаарай.'); return; }
      saveHabit({
        id: existing?.id ?? (habit && !habits.some(h => h.id === habit.id) ? habit.id : `habit-${Date.now()}-${Math.random().toString(36).slice(2,8)}`),
        title: title.trim(), description: habit?.description ?? 'Өдөр тутмын дадал.', category,
        tracking, minutes: tracking === 'timer' ? Number(minutes) : habit?.minutes ?? 5, points: habit?.points ?? 30,
        icon: category === 'Хөдөлгөөн' ? 'walk' : category === 'Төвлөрөл' ? 'mind' : 'sun',
        color: category === 'Хөдөлгөөн' ? '#93C5FD' : category === 'Төвлөрөл' ? palette.purple : '#A8D9E8',
        steps: habit?.steps ?? ['Өөрт тохирсон цагтаа эхлээрэй.', 'Хийсэн хэмжээгээ тэмдэглээрэй.'],
        days, period, target: tracking === 'timer' ? 1 : amount, unit: tracking === 'timer' ? 'удаа' : unit.trim(), archived: false, created: existing?.created ?? dateKey(), reminder: reminder ? time : '',
      });
      onClose();
    } catch { setError('Сануулгыг тохируулж чадсангүй. Дахин оролдоорой.'); }
    finally { setSaving(false); }
  };
  return <Modal transparent animationType="slide" onRequestClose={onClose}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.modalBackdrop}>
      <SafeAreaView edges={['bottom']} style={s.sheet}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 24, gap: 22 }}>
        <View style={s.between}><Text style={s.sectionTitle}>{existing ? 'Дадлаа засах' : 'Шинэ дадал'}</Text><Pressable accessibilityRole="button" accessibilityLabel="Хаах" onPress={onClose} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><Icon name="close" /></Pressable></View>
        <Text style={s.body}>Өнөөдөр бүртгэж эхэлсэн дадлын шинэ хэмжээ маргаашаас үйлчилнэ.</Text>
        <TextInput accessibilityLabel="Дадлын нэр" placeholder="Жишээ нь: Ном унших" placeholderTextColor={palette.muted} value={title} onChangeText={setTitle} maxLength={60} style={styles.input} />
        <Text style={s.rowTitle}>Чиглэл</Text><View style={styles.options}>{(['Хөдөлгөөн','Төвлөрөл','Өөртөө'] as Category[]).map(value => <Choice key={value} label={value} selected={category === value} onPress={() => setCategory(value)} />)}</View>
        <Text style={s.rowTitle}>Хэзээ хийх вэ?</Text><View style={styles.options}>{(['Өглөө','Өдөр','Орой'] as Period[]).map(value => <Choice key={value} label={value} selected={period === value} onPress={() => setPeriod(value)} />)}</View>
        <Text style={s.rowTitle}>Давтамж</Text><View style={styles.options}>{[1,2,3,4,5,6,0].map(d => <Choice key={d} label={weekdays[d]} selected={days.includes(d)} onPress={() => setDays(old => old.includes(d) ? old.filter(v => v !== d) : [...old,d])} />)}</View>
        <Text style={s.rowTitle}>Бүртгэх төрөл</Text><View style={styles.options}><Choice label="Хэмжээгээр" selected={tracking === 'count'} onPress={() => setTracking('count')} /><Choice label="Хугацаагаар" selected={tracking === 'timer'} onPress={() => setTracking('timer')} /></View>
        {tracking === 'timer' ? <><Text style={s.rowTitle}>Хугацаа · минут</Text><TextInput accessibilityLabel="Дадлын хугацаа минутаар" value={minutes} onChangeText={setMinutes} keyboardType="number-pad" maxLength={3} style={styles.input} /></> : <><Text style={s.rowTitle}>Өдрийн зорилго</Text><View style={s.row}><TextInput accessibilityLabel="Зорилгын хэмжээ" value={target} onChangeText={setTarget} keyboardType="number-pad" maxLength={3} style={[styles.input, { flex: 1 }]} /><TextInput accessibilityLabel="Хэмжих нэгж" value={unit} onChangeText={setUnit} maxLength={16} placeholder="аяга, хуудас, удаа" placeholderTextColor={palette.muted} style={[styles.input, { flex: 2 }]} /></View></>}
        <View style={s.between}><View style={{ flex: 1, gap: 5 }}><Text style={s.rowTitle}>Сануулах</Text><Text style={s.caption}>{Platform.OS === 'web' ? 'Утасны апп дээр ашиглана' : 'Сонгосон өдрүүдэд сануулна'}</Text></View><Switch accessibilityLabel="Сануулга идэвхжүүлэх" disabled={Platform.OS === 'web'} value={reminder} onValueChange={setReminder} trackColor={{ true: palette.primary, false: palette.line }} /></View>
        {reminder && <TextInput accessibilityLabel="Сануулах цаг" value={time} onChangeText={setTime} placeholder="09:00" maxLength={5} style={styles.input} />}
        {error ? <Text accessibilityRole="alert" style={{ color: palette.warning, lineHeight: 21 }}>{error}</Text> : null}
        <Button label={saving ? 'Хадгалж байна…' : 'Дадлаа хадгалах'} onPress={save} disabled={saving} />
        {existing && <Button secondary label="Архивлах · түүх хадгалагдана" onPress={() => { archiveHabit(existing.id); onClose(); }} />}
      </ScrollView></SafeAreaView>
    </KeyboardAvoidingView>
  </Modal>;
}
function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { palette } = useUI();
  const styles = useStyles(makeStyles);
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.choice, selected && { backgroundColor: palette.primary, borderColor: palette.primary }]}><Text style={{ color: selected ? palette.onAccent : palette.muted, fontSize: 12, fontWeight: '600' }}>{label}</Text></Pressable>;
}
const makeStyles = (palette: Palette) => StyleSheet.create({ input: { backgroundColor: palette.bg, color: palette.text, borderWidth: 1, borderColor: palette.line, borderRadius: 14, padding: 16, fontSize: 15 }, options: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, choice: { minHeight: 44, minWidth: 35, paddingHorizontal: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: palette.line, borderRadius: 13 } });
