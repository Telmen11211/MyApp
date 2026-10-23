import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useActivity } from '@/features/activity/activity-context';
import { Palette } from '@/features/activity/appearance';
import { useSettingsDrawer } from '@/features/activity/settings-drawer';
import { Button, Icon, PageTitle, Screen, useStyles, useUI } from '@/features/activity/ui';
export default function ProfileScreen() {
  const { palette, s } = useUI();
  const styles = useStyles(makeStyles);
  const openSettings = useSettingsDrawer();
  const { name, store, createDemoAccount, setDemoSignedIn } = useActivity();
  const [accountName, setAccountName] = useState(name);
  const [email, setEmail] = useState('');
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const signedIn = Boolean(store.demoAccount && store.demoSignedIn);
  const create = () => {
    if (!accountName.trim()) return setFormError('Нэрээ оруулна уу.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setFormError('Имэйл хаягаа зөв оруулна уу.');
    createDemoAccount(accountName,email); setCreating(false); setFormError(''); setMessage('Демо аккаунт үүсгэлээ.');
  };
  return <Screen>
    <View style={s.between}><PageTitle title="Аккаунт" /><Pressable accessibilityRole="button" accessibilityLabel="Тохиргоо нээх" onPress={openSettings} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><Icon name="more" light size={24} /></Pressable></View>
    <View style={styles.identity}><View style={styles.avatar}><Text style={styles.initial}>{name.slice(0,1).toUpperCase()}</Text></View><View style={{ flex:1, gap:6 }}><Text style={s.sectionTitle}>{name}</Text><Text style={s.caption}>{signedIn ? store.demoAccount?.email : 'Зочин'}</Text>{signedIn && <Text style={s.link}>Демо аккаунт</Text>}</View></View>

    <View style={s.card}>
      <Text style={s.sectionTitle}>Аккаунт</Text><Text style={s.caption}>Туршилтын бүртгэл. Зөвхөн энэ төхөөрөмж дээр хадгалагдана.</Text>
      {signedIn ? <><View style={styles.status}><Icon name="check" color={palette.accent} /><Text style={s.rowTitle}>Демо аккаунтаар нэвтэрсэн</Text></View><Button secondary label="Гарах" onPress={() => { setDemoSignedIn(false); setMessage('Демо аккаунтаас гарлаа. Дадлын түүх төхөөрөмж дээр үлдсэн.'); }} /></> : creating ? <>
        <TextInput accessibilityLabel="Бүртгэлийн нэр" value={accountName} onChangeText={setAccountName} placeholder="Нэр" placeholderTextColor={palette.muted} maxLength={24} style={styles.input} />
        <TextInput accessibilityLabel="Бүртгэлийн имэйл" value={email} onChangeText={setEmail} placeholder="Имэйл" placeholderTextColor={palette.muted} autoCapitalize="none" keyboardType="email-address" autoCorrect={false} maxLength={254} style={styles.input} />
        {formError ? <Text accessibilityRole="alert" style={{color:palette.warning}}>{formError}</Text> : null}
        <Button label="Демо аккаунт үүсгэх" onPress={create} /><Button secondary label="Болих" onPress={() => {setCreating(false);setFormError('');}} />
      </> : store.demoAccount ? <><Text style={s.body}>{store.demoAccount.email}</Text><Button label="Демо аккаунтаа нээх" onPress={() => { setDemoSignedIn(true);setMessage('Демо аккаунт нээгдлээ.'); }} /><Button secondary label="Өөр демо аккаунт үүсгэх" onPress={() => {setAccountName(name);setEmail('');setCreating(true);setMessage('');}} /></> : <Button label="Аккаунт үүсгэх" onPress={() => { setAccountName(name); setCreating(true);setMessage(''); }} />}
    </View>
    {message ? <Text accessibilityRole="alert" style={s.link}>{message}</Text> : null}
    <Text style={s.caption}>Дадал, түүх болон тохиргоо энэ төхөөрөмж дээр хадгалагдана.</Text>
  </Screen>;
}
const makeStyles = (palette: Palette) => StyleSheet.create({
  identity:{flexDirection:'row',alignItems:'center',gap:18,paddingVertical:8},avatar:{width:72,height:72,borderRadius:36,backgroundColor:palette.selected,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:palette.selectedBorder},initial:{fontSize:30,fontWeight:'700',color:palette.accent},input:{color:palette.text,backgroundColor:palette.bg,borderWidth:1,borderColor:palette.line,borderRadius:14,padding:16,fontSize:15},options:{flexDirection:'row',gap:12},option:{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10,minHeight:58,borderRadius:16,borderWidth:1,borderColor:palette.line},selected:{backgroundColor:palette.primary,borderColor:palette.primary},status:{flexDirection:'row',alignItems:'center',gap:10},
});
