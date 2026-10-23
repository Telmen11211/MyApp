import { StyleSheet, Text, View } from 'react-native';
import { useActivity } from './activity-context';
import { Palette } from './appearance';
import { Icon, useStyles, useUI } from './ui';
export function DailyProgress() {
  const { palette } = useUI();
  const styles = useStyles(makeStyles);
  const { daily, completed, store, day } = useActivity();
  const done = daily.filter(h => completed.includes(h.id)).length;
  const started = daily.filter(h => {
    if (completed.includes(h.id)) return false;
    const entry = store.logs[day]?.entries[h.id];
    return Boolean(entry && (entry.amount > 0 || (entry.timer && (entry.timer.elapsedMs > 0 || entry.timer.runningSince !== undefined))));
  }).length;
  const remaining = daily.length - done - started;
  const percent = daily.length ? Math.round(done / daily.length * 100) : 0;
  const filled = daily.length ? Math.floor(done / daily.length * 48) : 0;
  return <View style={styles.card}>
    <View style={styles.header}><View style={styles.titleRow}><Icon name="progress" light size={18} color={palette.onAccent} /><Text style={styles.title}>ӨДРИЙН ГҮЙЦЭТГЭЛ</Text></View><View style={styles.badge}><Text style={styles.badgeText}>{done}/{daily.length} дадал</Text></View></View>
    <View style={styles.body}>
      <View accessibilityRole="progressbar" accessibilityLabel="Өнөөдрийн дадлын гүйцэтгэл" accessibilityValue={{ min: 0, max: 100, now: percent, text: `${daily.length} дадлаас ${done} биелсэн, ${percent} хувь` }} style={styles.ring}>
        {Array.from({length:48},(_,i) => {
          const angle = i * 7.5 - 90, radians = angle * Math.PI / 180;
          return <View key={i} style={[styles.tick, { left: 70 + Math.cos(radians) * 62 - 1.5, top: 70 + Math.sin(radians) * 62 - 5, transform: [{rotate:`${angle+90}deg`}], backgroundColor:palette.onAccent, opacity:i < filled ? 1 : 0.65, height:i < filled ? 10 : 5 }]} />;
        })}
        <View style={styles.center}><Text style={styles.percent}>{percent}<Text style={styles.percentSign}>%</Text></Text><Text style={styles.centerLabel}>биелсэн</Text></View>
      </View>
      <View style={styles.stats}>
        {[{value:done,label:'Дууссан',icon:'check' as const},{value:started,label:'Эхэлсэн',icon:'clock' as const},{value:remaining,label:'Эхлээгүй',icon:'sun' as const}].map(item => <View key={item.label} style={styles.statRow}><View style={styles.statIcon}><Icon name={item.icon} light size={17} color={palette.onAccent} /></View><Text style={styles.statLabel}>{item.label}</Text><Text style={styles.statValue}>{item.value}</Text></View>)}
      </View>
    </View>
    {daily.length === 0 && <Text style={styles.empty}>Өнөөдөр төлөвлөсөн дадал алга</Text>}
  </View>;
}
const makeStyles = (palette: Palette) => StyleSheet.create({
  card:{padding:22,borderRadius:28,backgroundColor:palette.primary,gap:23},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,flexWrap:'wrap'},titleRow:{flexDirection:'row',alignItems:'center',gap:7},title:{color:palette.onAccent,fontSize:10,fontWeight:'700',letterSpacing:1.2},badge:{paddingHorizontal:10,paddingVertical:6,borderRadius:10,borderWidth:1,borderColor:palette.onAccent},badgeText:{color:palette.onAccent,fontSize:11,fontWeight:'600'},body:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:18,flexWrap:'wrap'},ring:{width:140,height:140,position:'relative'},tick:{position:'absolute',width:3,height:10,borderRadius:2},center:{position:'absolute',top:0,right:0,bottom:0,left:0,alignItems:'center',justifyContent:'center',gap:2},percent:{color:palette.onAccent,fontSize:42,fontWeight:'700',letterSpacing:-2,fontVariant:['tabular-nums']},percentSign:{fontSize:21,letterSpacing:0},centerLabel:{color:palette.onAccent,fontSize:11},stats:{flex:1,minWidth:115,gap:14},statRow:{flexDirection:'row',alignItems:'center',gap:8},statIcon:{width:26,height:26,alignItems:'center',justifyContent:'center'},statLabel:{flex:1,color:palette.onAccent,fontSize:12},statValue:{color:palette.onAccent,fontSize:22,fontWeight:'600',fontVariant:['tabular-nums']},empty:{color:palette.onAccent,fontSize:12},
});
