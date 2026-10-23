import { createContext, PropsWithChildren, useContext, useRef, useState } from 'react';
import { Animated, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Palette, useAppearance } from './appearance';
import { useActivity } from './activity-context';
import { Button, Icon, useStyles, useUI } from './ui';
const SettingsContext = createContext<(() => void) | null>(null);
export function useSettingsDrawer() {
  const open = useContext(SettingsContext);
  if (!open) throw new Error('SettingsDrawerProvider is required');
  return open;
}
export function SettingsDrawerProvider({ children }: PropsWithChildren) {
  const { palette, s } = useUI();
  const styles = useStyles(makeStyles);
  const { name, setName } = useActivity();
  const [draft, setDraft] = useState(name);
  const [nameSaved, setNameSaved] = useState(false);
  const { mode, setMode, error } = useAppearance();
  const [visible, setVisible] = useState(false);
  const [progress] = useState(() => new Animated.Value(1));
  const closing = useRef(false);
  const open = () => { if (visible) return; closing.current = false; setDraft(name); setNameSaved(false); progress.setValue(1); setVisible(true); };
  const close = () => {
    if (closing.current) return;
    closing.current = true;
    Animated.timing(progress, { toValue: 1, duration: 180, useNativeDriver: Platform.OS !== 'web' }).start(({ finished }) => { if (finished) { setVisible(false); closing.current = false; } });
  };
  return <SettingsContext.Provider value={open}>{children}
    <Modal visible={visible} transparent animationType="none" onRequestClose={close} onShow={() => Animated.timing(progress, { toValue: 0, duration: 230, useNativeDriver: Platform.OS !== 'web' }).start()}>
      <View style={styles.overlay}>
        <Pressable accessibilityRole="button" accessibilityLabel="Тохиргооны гадна дарж хаах" onPress={close} style={StyleSheet.absoluteFill} />
        <Animated.View accessibilityViewIsModal style={[styles.drawer, { transform: [{ translateX: progress.interpolate({ inputRange: [0,1], outputRange: [0,400] }) }] }]}>
          <SafeAreaView style={{flex:1}} edges={['top','bottom','right']}>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
              <View style={s.between}><Text accessibilityRole="header" style={s.sectionTitle}>Тохиргоо</Text><Pressable accessibilityRole="button" accessibilityLabel="Тохиргоо хаах" onPress={close} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={21} /></Pressable></View>
              <View style={s.card}><View style={s.row}><Icon name="sun" color={palette.accent} /><Text style={[s.rowTitle,{flex:1}]}>Дэлгэцийн горим</Text></View>
                <View style={styles.options}>{(['dark','light'] as const).map(value => <Pressable key={value} accessibilityRole="button" accessibilityLabel={value === 'dark' ? 'Dark горим' : 'Light горим'} accessibilityState={{selected:mode === value}} onPress={() => setMode(value)} style={[styles.option,mode === value && styles.selected]}><Icon name={value === 'dark' ? 'moon' : 'sun'} size={21} color={mode === value ? palette.onAccent : palette.muted} /><Text style={{color:mode === value ? palette.onAccent : palette.text,fontWeight:'600'}}>{value === 'dark' ? 'Dark' : 'Light'}</Text></Pressable>)}</View>
                {error && <Text style={{color:palette.warning}}>Горимыг хадгалж чадсангүй. Дахин сонгоно уу.</Text>}
              </View>
              <View style={s.card}><Text style={s.rowTitle}>Нэр өөрчлөх</Text><TextInput accessibilityLabel="Таны нэр" value={draft} onChangeText={value => { setDraft(value); setNameSaved(false); }} maxLength={24} placeholder="Нэр" placeholderTextColor={palette.muted} selectionColor={palette.accent} style={styles.input} /><Button label="Нэр хадгалах" disabled={!draft.trim() || draft.trim() === name} onPress={() => { setName(draft.trim()); setNameSaved(true); }} />{nameSaved && <Text accessibilityRole="alert" style={s.link}>Нэр хадгалагдлаа.</Text>}</View>

              <Text style={s.caption}>Дадал, түүх болон тохиргоо энэ төхөөрөмж дээр хадгалагдана.</Text>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  </SettingsContext.Provider>;
}
const makeStyles = (palette: Palette) => StyleSheet.create({
  input:{backgroundColor:palette.card,color:palette.text,borderWidth:1,borderColor:palette.line,borderRadius:14,padding:14,fontSize:15},
  overlay:{flex:1,backgroundColor:'#00000077',alignItems:'flex-end'},drawer:{width:'88%',maxWidth:380,height:'100%',backgroundColor:palette.bg,borderLeftWidth:1,borderLeftColor:palette.line},content:{padding:20,gap:24,paddingBottom:30},options:{flexDirection:'row',gap:8},option:{flex:1,minHeight:55,alignItems:'center',justifyContent:'center',gap:8,borderWidth:1,borderColor:palette.line,borderRadius:14,paddingVertical:12},selected:{backgroundColor:palette.primary,borderColor:palette.primary},
});
