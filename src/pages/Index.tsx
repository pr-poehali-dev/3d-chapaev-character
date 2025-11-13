import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type Category = 'all' | 'museums' | 'parks' | 'monuments';

interface Attraction {
  id: number;
  name: string;
  category: Category;
  description: string;
  image: string;
  coordinates: [number, number];
}

const attractions: Attraction[] = [
  {
    id: 1,
    name: 'Монумент Матери-Покровительнице',
    category: 'monuments',
    description: 'Символ города Чебоксары высотой 46 метров. Монумент установлен на высоком берегу Волги и виден из многих точек города. Величественная скульптура олицетворяет образ матери, оберегающей своих детей.',
    image: 'https://cdn.poehali.dev/projects/7118d063-3b01-4fc1-8881-f4143808a0cb/files/037d96b8-1aaa-43c6-a492-b5291885eb7f.jpg',
    coordinates: [56.1264, 47.2500]
  },
  {
    id: 2,
    name: 'Чувашский национальный музей',
    category: 'museums',
    description: 'Крупнейший музей Чувашии, основанный в 1921 году. В коллекции музея представлены уникальные экспонаты по истории, культуре и природе региона. Более 160 тысяч единиц хранения.',
    image: 'https://cdn.poehali.dev/projects/7118d063-3b01-4fc1-8881-f4143808a0cb/files/68423f1f-141e-4e03-88d8-d55362d9fd75.jpg',
    coordinates: [56.1305, 47.2449]
  },
  {
    id: 3,
    name: 'Парк Победы',
    category: 'parks',
    description: 'Живописный парк в центре Чебоксар площадью 30 гектаров. Любимое место отдыха горожан с множеством аллей, смотровых площадок и памятников. Отсюда открывается красивый вид на Волгу и Чебоксарский залив.',
    image: 'https://cdn.poehali.dev/projects/7118d063-3b01-4fc1-8881-f4143808a0cb/files/b3ddc196-ab85-489f-9f84-7eae2af4d8d9.jpg',
    coordinates: [56.1327, 47.2416]
  },
  {
    id: 4,
    name: 'Введенский собор',
    category: 'monuments',
    description: 'Старейшее сохранившееся здание Чебоксар, построенное в 1657 году. Памятник архитектуры федерального значения. Уникальный образец русского храмового зодчества XVII века.',
    image: 'https://cdn.poehali.dev/projects/7118d063-3b01-4fc1-8881-f4143808a0cb/files/037d96b8-1aaa-43c6-a492-b5291885eb7f.jpg',
    coordinates: [56.1285, 47.2528]
  },
  {
    id: 5,
    name: 'Музей истории трактора',
    category: 'museums',
    description: 'Единственный в России музей, посвященный истории тракторостроения. Представлена уникальная коллекция тракторов различных эпох и стран производства. Более 30 единиц техники.',
    image: 'https://cdn.poehali.dev/projects/7118d063-3b01-4fc1-8881-f4143808a0cb/files/68423f1f-141e-4e03-88d8-d55362d9fd75.jpg',
    coordinates: [56.1198, 47.2387]
  },
  {
    id: 6,
    name: 'Лакреевский лес',
    category: 'parks',
    description: 'Крупнейший лесной массив в черте города. Экологически чистая зона отдыха с лыжными трассами, велодорожками и пешеходными маршрутами. Площадь более 700 гектаров.',
    image: 'https://cdn.poehali.dev/projects/7118d063-3b01-4fc1-8881-f4143808a0cb/files/b3ddc196-ab85-489f-9f84-7eae2af4d8d9.jpg',
    coordinates: [56.1425, 47.2185]
  }
];

const categoryNames: Record<Category, string> = {
  all: 'Все',
  museums: 'Музеи',
  parks: 'Парки',
  monuments: 'Памятники'
};

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);

  const filteredAttractions = selectedCategory === 'all'
    ? attractions
    : attractions.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-cyan-50">
      <header className="bg-white shadow-sm border-b-4 border-primary">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
            <Icon name="MapPin" size={36} className="text-primary" />
            Интерактивная карта Чувашии
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Откройте для себя красоту и историю Чувашской Республики</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Icon name="Filter" size={24} className="text-accent" />
            Категории
          </h2>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(categoryNames) as Category[]).map(category => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="text-base"
              >
                {categoryNames[category]}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-lg border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle className="flex items-center gap-2">
                <Icon name="Map" size={24} className="text-primary" />
                Карта достопримечательностей
              </CardTitle>
              <CardDescription>Нажмите на маркер для подробной информации</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px] w-full rounded-b-lg overflow-hidden">
                <MapContainer
                  center={[56.1264, 47.2500]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredAttractions.map(attraction => (
                    <Marker
                      key={attraction.id}
                      position={attraction.coordinates}
                      eventHandlers={{
                        click: () => setSelectedAttraction(attraction)
                      }}
                    >
                      <Popup>
                        <div className="text-center">
                          <h3 className="font-semibold text-base">{attraction.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{categoryNames[attraction.category]}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          {selectedAttraction && (
            <Card className="shadow-lg border-2 border-secondary/20 animate-in fade-in slide-in-from-right-5 duration-500">
              <CardHeader className="bg-gradient-to-r from-secondary/10 to-accent/10">
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Info" size={24} className="text-secondary" />
                  {selectedAttraction.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Icon name="Tag" size={16} className="text-accent" />
                  {categoryNames[selectedAttraction.category]}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <img
                  src={selectedAttraction.image}
                  alt={selectedAttraction.name}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                <p className="text-base leading-relaxed">{selectedAttraction.description}</p>
                <Button className="w-full" size="lg">
                  <Icon name="Navigation" size={20} className="mr-2" />
                  Построить маршрут
                </Button>
              </CardContent>
            </Card>
          )}

          {!selectedAttraction && (
            <Card className="shadow-lg border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Sparkles" size={24} className="text-accent" />
                  Добро пожаловать!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg">Выберите маркер на карте, чтобы узнать подробную информацию о достопримечательности.</p>
                <div className="space-y-3 mt-6">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <Icon name="Museum" size={24} className="text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold">Музеи</h4>
                      <p className="text-sm text-muted-foreground">Познакомьтесь с историей и культурой региона</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <Icon name="Trees" size={24} className="text-accent mt-1" />
                    <div>
                      <h4 className="font-semibold">Парки</h4>
                      <p className="text-sm text-muted-foreground">Насладитесь природой и свежим воздухом</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <Icon name="Landmark" size={24} className="text-secondary mt-1" />
                    <div>
                      <h4 className="font-semibold">Памятники</h4>
                      <p className="text-sm text-muted-foreground">Откройте архитектурное наследие Чувашии</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Icon name="Heart" size={28} className="text-primary" />
            Все достопримечательности
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAttractions.map(attraction => (
              <Card
                key={attraction.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30"
                onClick={() => setSelectedAttraction(attraction)}
              >
                <CardHeader className="p-0">
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="mb-2 flex items-center gap-2">
                    <Icon name="MapPin" size={18} className="text-primary" />
                    {attraction.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mb-3">
                    <Icon name="Tag" size={14} className="text-accent" />
                    {categoryNames[attraction.category]}
                  </CardDescription>
                  <p className="text-sm line-clamp-3">{attraction.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg">Откройте для себя Чувашию 🌟</p>
          <p className="text-sm opacity-90 mt-2">Интерактивный туристический портал</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;