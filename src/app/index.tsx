import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Product = { id: number; name: string; category: string; price: number; icon: string; color: string };
const products: Product[] = [
  { id: 1, name: 'Өдөр тутмын үүргэвч', category: 'Аксессуар', price: 89000, icon: '🎒', color: '#2C2925' },
  { id: 2, name: 'Утасгүй чихэвч', category: 'Технологи', price: 129000, icon: '🎧', color: '#272C3B' },
  { id: 3, name: 'Зөөлөн цамц', category: 'Хувцас', price: 69000, icon: '👕', color: '#25332B' },
  { id: 4, name: 'Керамик аяга', category: 'Гэр ахуй', price: 29000, icon: '☕', color: '#382B27' },
];
const categories = ['Бүгд', 'Хувцас', 'Технологи', 'Аксессуар', 'Гэр ахуй'];
const money = (value: number) => `${value.toLocaleString('en-US')} ₮`;

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Бүгд');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [saleOnly, setSaleOnly] = useState(false);
  const visible = products.filter(p => (category === 'Бүгд' || p.category === category) && p.name.toLowerCase().includes(query.trim().toLowerCase()) && (!favoritesOnly || favorites.includes(p.id)) && (!saleOnly || p.id <= 2));
  const total = cart.reduce((sum, id) => sum + products.find(p => p.id === id)!.price, 0);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View><Text style={styles.eyebrow}>ӨДӨР БҮРИЙН ШИНЭ СОНГОЛТ</Text><Text style={styles.logo}>Sonder<Text style={styles.dot}>.</Text></Text></View>
          <Pressable accessibilityRole="button" accessibilityLabel={`Сагс, ${cart.length} бараа`} onPress={() => setCartOpen(true)} style={styles.cartButton}><Text style={styles.cartIcon}>🛍</Text><View style={styles.badge}><Text style={styles.badgeText}>{cart.length}</Text></View></Pressable>
        </View>
        <Text style={styles.greeting}>Өөртөө таалагдахыг ол.</Text>
        <Text style={styles.subtitle}>Таны өдөр тутмыг илүү гоё болгох зүйлс.</Text>
        <View style={styles.search}><Text style={styles.searchIcon}>⌕</Text><TextInput accessibilityLabel="Бараа хайх" placeholder="Юу хайж байна вэ?" placeholderTextColor="#A6AE9E" keyboardAppearance="dark" selectionColor="#B5D879" value={query} onChangeText={setQuery} style={styles.input} />{query.length > 0 && <Pressable accessibilityRole="button" accessibilityLabel="Хайлтыг цэвэрлэх" onPress={() => setQuery('')}><Text style={styles.searchIcon}>×</Text></Pressable>}</View>
        <View style={styles.hero}>
          <View style={styles.heroCopy}><Text style={styles.heroLabel}>ШИНЭ УЛИРАЛ • ШИНЭ МЭДРЭМЖ</Text><Text style={styles.heroTitle}>Жижиг зүйлс.{'\n'}Том баяр баясал.</Text><Text style={styles.heroSubtitle}>Онцлох сонголтуудаа нээгээрэй.</Text><Pressable accessibilityRole="button" onPress={() => { setSaleOnly(true); setCategory('Бүгд'); setQuery(''); setFavoritesOnly(false); }} style={styles.heroButton}><Text style={styles.heroButtonText}>Сонголтуудыг үзэх  ↗</Text></Pressable></View>
          <View style={styles.heroArt}><Text style={styles.heroEmoji}>🛍️</Text><View style={styles.heroTag}><Text style={styles.heroTagText}>ОНЦЛОХ</Text></View></View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>{categories.map(item => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: category === item }} onPress={() => { setCategory(item); setSaleOnly(false); }} style={[styles.chip, category === item && styles.chipActive]}><Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text></Pressable>)}</ScrollView>
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{favoritesOnly ? 'Дуртай бараа' : saleOnly ? 'Онцлох сонголт' : 'Танд санал болгох'}</Text><Pressable accessibilityRole="button" onPress={() => setFavoritesOnly(!favoritesOnly)}><Text style={styles.sectionAction}>{favoritesOnly ? 'Бүгдийг үзэх' : 'Дуртай ♡'}</Text></Pressable></View>
        <View style={styles.grid}>{visible.map(product => <View key={product.id} style={styles.product}>
          <View style={[styles.productImage, { backgroundColor: product.color }]}><Text style={styles.productEmoji}>{product.icon}</Text><Pressable accessibilityRole="button" accessibilityLabel={`${product.name}: дуртай бараа`} accessibilityState={{ selected: favorites.includes(product.id) }} onPress={() => setFavorites(old => old.includes(product.id) ? old.filter(id => id !== product.id) : [...old, product.id])} style={styles.favorite}><Text style={[styles.heart, favorites.includes(product.id) && styles.heartActive]}>{favorites.includes(product.id) ? '♥' : '♡'}</Text></Pressable></View>
          <Text style={styles.productCategory}>{product.category}</Text><Text style={styles.productName}>{product.name}</Text><View style={styles.priceRow}><Text style={styles.price}>{money(product.price)}</Text><Pressable accessibilityRole="button" accessibilityLabel={`${product.name} сагсанд нэмэх`} onPress={() => setCart(old => [...old, product.id])} style={styles.add}><Text style={styles.addText}>+</Text></Pressable></View>
        </View>)}</View>
        {visible.length === 0 && <View style={styles.empty}><Text style={styles.sectionTitle}>Бараа олдсонгүй</Text><Text style={styles.subtitle}>Хайлт эсвэл ангиллаа өөрчилж үзээрэй.</Text></View>}
        <View style={styles.delivery}><Text style={styles.deliveryIcon}>📦</Text><View style={styles.deliveryCopy}><Text style={styles.deliveryTitle}>Таны дараагийн дуртай зүйл энд бий.</Text><Text style={styles.deliveryText}>Бараан дээрх + товчоор сагсандаа нэмээрэй.</Text></View></View>
        <Text style={styles.footer}>SONDER • Жишээ дэлгүүр</Text>
      </ScrollView>
      <Modal visible={cartOpen} animationType="slide" onRequestClose={() => setCartOpen(false)}><SafeAreaView style={styles.root}><View style={styles.modalHeader}><Text style={styles.sectionTitle}>Миний сагс ({cart.length})</Text><Pressable accessibilityRole="button" accessibilityLabel="Сагсыг хаах" onPress={() => setCartOpen(false)} style={styles.cartButton}><Text style={styles.searchIcon}>×</Text></Pressable></View><ScrollView contentContainerStyle={styles.cartContent}>{products.filter(p => cart.includes(p.id)).map(p => <View key={p.id} style={styles.cartRow}><Text style={styles.cartIcon}>{p.icon}</Text><View style={styles.deliveryCopy}><Text style={styles.productName}>{p.name}</Text><Text style={styles.subtitle}>{cart.filter(id => id === p.id).length} ширхэг · {money(p.price)}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={`${p.name} нэг ширхгийг хасах`} onPress={() => setCart(old => { const next = [...old]; next.splice(next.indexOf(p.id), 1); return next; })} style={styles.add}><Text style={styles.addText}>−</Text></Pressable></View>)}{cart.length === 0 && <Text style={styles.subtitle}>Сагс хоосон байна. Таалагдсан бараагаа нэмээрэй.</Text>}<View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Нийт</Text><Text style={styles.price}>{money(total)}</Text></View><Text style={styles.deliveryText}>Энэ нь жишээ сагс. Төлбөр болон захиалга хараахан холбогдоогүй.</Text></ScrollView></SafeAreaView></Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#111510' },
  content: { padding: 22, paddingBottom: 110, gap: 18, width: '100%', maxWidth: 700, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { fontSize: 9, letterSpacing: 2, fontWeight: '700', color: '#A0AA96' },
  logo: { fontSize: 34, fontWeight: '800', letterSpacing: -1.5, color: '#F2F5ED' }, dot: { color: '#B5D879' },
  cartButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#20271D', alignItems: 'center', justifyContent: 'center' }, cartIcon: { fontSize: 24 },
  badge: { position: 'absolute', right: 0, top: 0, borderRadius: 10, minWidth: 20, height: 20, backgroundColor: '#B5D879', alignItems: 'center', justifyContent: 'center' }, badgeText: { color: '#17210F', fontSize: 10, fontWeight: '700' },
  greeting: { fontSize: 25, fontWeight: '700', color: '#F2F5ED', marginTop: 8 }, subtitle: { fontSize: 13, color: '#A6AE9E', lineHeight: 20 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#20271D', borderRadius: 16, paddingHorizontal: 16, minHeight: 52 }, searchIcon: { fontSize: 27, color: '#B7C2AB' }, input: { flex: 1, fontSize: 14, color: '#F2F5ED', paddingVertical: 14 },
  hero: { backgroundColor: '#28361F', borderRadius: 24, padding: 22, flexDirection: 'row', overflow: 'hidden', alignItems: 'center' }, heroCopy: { flex: 1, zIndex: 1 }, heroLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1, color: '#BACCA3' }, heroTitle: { fontSize: 27, lineHeight: 34, fontWeight: '800', color: '#F0F6E6', marginTop: 14 }, heroSubtitle: { fontSize: 12, color: '#BACCA3', marginTop: 10, lineHeight: 18 }, heroButton: { alignSelf: 'flex-start', backgroundColor: '#B5D879', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 13, marginTop: 20 }, heroButtonText: { fontSize: 12, fontWeight: '600', color: '#17210F' }, heroArt: { alignItems: 'center', width: 82 }, heroEmoji: { fontSize: 74, transform: [{ rotate: '-12deg' }] }, heroTag: { backgroundColor: '#111510', padding: 8, borderRadius: 8, marginTop: 14, transform: [{ rotate: '8deg' }] }, heroTagText: { fontSize: 9, letterSpacing: 1, fontWeight: '800', color: '#B5D879' },
  categories: { gap: 8, paddingVertical: 4 }, chip: { paddingHorizontal: 17, paddingVertical: 13, borderRadius: 24, borderWidth: 1, borderColor: '#35402E', backgroundColor: '#20271D' }, chipActive: { backgroundColor: '#B5D879', borderColor: '#B5D879' }, chipText: { fontSize: 12, color: '#BBC5AF', fontWeight: '600' }, chipTextActive: { color: '#17210F' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }, sectionTitle: { fontSize: 19, fontWeight: '700', color: '#F2F5ED' }, sectionAction: { fontSize: 12, color: '#BACCA3', paddingVertical: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 24 }, product: { width: '47%' }, productImage: { aspectRatio: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }, productEmoji: { fontSize: 66 }, favorite: { position: 'absolute', top: 10, right: 10, backgroundColor: '#20271DCC', borderRadius: 18, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }, heart: { fontSize: 23, color: '#CFD9C3' }, heartActive: { color: '#FF9690' }, productCategory: { fontSize: 10, color: '#A1AE95', marginTop: 13 }, productName: { fontSize: 14, fontWeight: '600', color: '#E5EBDD', marginTop: 5, lineHeight: 20 }, priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }, price: { fontSize: 16, fontWeight: '800', color: '#B5D879' }, add: { width: 38, height: 38, backgroundColor: '#2E3D24', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, addText: { fontSize: 23, color: '#B5D879' },
  empty: { paddingVertical: 30, gap: 12 }, delivery: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#20271D', padding: 18, borderRadius: 18, marginTop: 8 }, deliveryIcon: { fontSize: 25 }, deliveryCopy: { flex: 1 }, deliveryTitle: { fontSize: 12, fontWeight: '700', color: '#D5E1C6', lineHeight: 18 }, deliveryText: { fontSize: 11, color: '#ADB89F', lineHeight: 18, marginTop: 4 }, footer: { textAlign: 'center', color: '#A1AE95', fontSize: 10, letterSpacing: 2, marginTop: 10 },
  modalHeader: { padding: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, cartContent: { padding: 22, gap: 24 }, cartRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
