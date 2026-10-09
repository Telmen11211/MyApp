import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

export type Category = 'Хөдөлгөөн' | 'Төвлөрөл' | 'Өөртөө';
export type Challenge = {
  id: string; title: string; description: string; category: Category;
  minutes: number; points: number; icon: 'walk' | 'mind' | 'water' | 'book' | 'stretch' | 'sun';
  color: string; steps: string[];
};
export const challenges: Challenge[] = [
  { id: 'walk', title: 'Гадаа 20 минут алх', description: 'Дэлгэцээс түр холдоод, өөрийн хэмнэлээр алх. Жижиг алхам бүр чамайг урагшлуулна.', category: 'Хөдөлгөөн', minutes: 20, points: 100, icon: 'walk', color: '#D6F67A', steps: ['Тухтай гутлаа өмсөөд гадаа гараарай.', '20 минут өөрт тохирсон хурдаар алхаарай.', 'Эргэн тойрноосоо өмнө нь анзаараагүй 3 зүйл олоорой.'] },
  { id: 'breathe', title: 'Амьсгалдаа анхаар', description: 'Таван минутыг зөвхөн өөртөө зориул. Яарахгүй, тайван амьсгалаарай.', category: 'Төвлөрөл', minutes: 5, points: 40, icon: 'mind', color: '#C6B8F5', steps: ['Тайван, тухтай газар суугаарай.', 'Амьсгалаа хүчлэхгүйгээр ажиглаарай.', 'Бодол сарнивал амьсгалдаа зөөлөн буцаарай.'] },
  { id: 'water', title: 'Нэг аяга ус уугаарай', description: 'Өдрийн завсарлагаа нэг аяга ус, хэдэн хором амралтаар эхлүүл.', category: 'Өөртөө', minutes: 2, points: 20, icon: 'water', color: '#A8D9E8', steps: ['Аягандаа ус хийгээрэй.', 'Яаралгүй уугаад, хэсэг амраарай.'] },
  { id: 'stretch', title: 'Биеэ зөөлөн сунга', description: 'Удаан суусан бол босоод, биедээ богинохон завсарлага өг.', category: 'Хөдөлгөөн', minutes: 10, points: 60, icon: 'stretch', color: '#F2BD96', steps: ['Мөр, гараа зөөлөн хөдөлгөөрэй.', 'Өөрт тухтай хүрээнд биеэ сунгаарай.', 'Өвдөлт мэдрэгдвэл зогсоорой.'] },
  { id: 'read', title: 'Номын 10 хуудас унш', description: 'Мэдэгдлүүдээ түр орхиод шинэ санаанд зай гарга.', category: 'Төвлөрөл', minutes: 15, points: 80, icon: 'book', color: '#C6B8F5', steps: ['Унших дуртай номоо сонгоорой.', '10 хуудас анхаарлаа төвлөрүүлэн уншаарай.', 'Таалагдсан нэг санаагаа тэмдэглээрэй.'] },
  { id: 'gratitude', title: 'Талархах 3 зүйлээ бич', description: 'Өнөөдрийн жижигхэн сайхан мөчүүдээ анзаараарай.', category: 'Өөртөө', minutes: 5, points: 40, icon: 'sun', color: '#F4D785', steps: ['Цаас эсвэл тэмдэглэлээ нээгээрэй.', 'Талархаж байгаа 3 зүйлээ бичээрэй.', 'Нэгийг нь яагаад сонгосноо бодоорой.'] },
];
const dateKey = () => new Date().toLocaleDateString('en-CA');
type ActivityState = {
  completed: string[]; started: string[]; complete: (id: string) => void;
  start: (id: string) => void; points: number; name: string; setName: (name: string) => void;
};
const ActivityContext = createContext<ActivityState | null>(null);

export function ActivityProvider({ children }: PropsWithChildren) {
  const [activity, setActivity] = useState(() => ({ day: dateKey(), completed: [] as string[], started: [] as string[] }));
  const { completed, started } = activity;
  const [name, setName] = useState('Тэмүүлэн');
  useEffect(() => {
    const timer = setInterval(() => {
      const day = dateKey();
      setActivity(old => old.day === day ? old : { day, completed: [], started: [] });
    }, 30_000);
    return () => clearInterval(timer);
  }, []);
  const points = challenges.filter(item => completed.includes(item.id)).reduce((sum, item) => sum + item.points, 0);
  return <ActivityContext.Provider value={{
    completed, started, points, name, setName,
    start: id => setActivity(old => old.started.includes(id) ? old : { ...old, started: [...old.started, id] }),
    complete: id => setActivity(old => old.completed.includes(id) ? old : { ...old, completed: [...old.completed, id] }),
  }}>{children}</ActivityContext.Provider>;
}
export function useActivity() {
  const state = useContext(ActivityContext);
  if (!state) throw new Error('ActivityProvider is required');
  return state;
}
