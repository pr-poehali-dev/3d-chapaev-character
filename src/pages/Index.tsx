import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Attraction {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  coordinates: [number, number];
  category: string;
  image: string;
}

const attractions: Attraction[] = [
  {
    id: 1,
    name: 'Монумент Матери-Покровительницы',
    description: 'Символ Чебоксар и всей Чувашии высотой 46 метров',
    fullDescription: 'Монумент Матери-Покровительницы — величественная скульптура, возвышающаяся на 46 метров над Чебоксарским заливом. Открыт в 2003 году и стал символом материнской любви и защиты. С площадки у подножия монумента открывается потрясающий вид на залив и город. Это место особенно красиво на закате, когда золотые лучи освещают белоснежную статую.',
    coordinates: [56.1319, 47.2486],
    category: 'Памятники',
    image: 'https://cdn.poehali.dev/projects/7118d063-3b01-4fc1-8881-f4143808a0cb/files/2fb459ef-bbb9-465a-84d9-89ad2a1131cb.jpg'
  },
  {
    id: 2,
    name: 'Чебоксарский залив',
    description: 'Живописная набережная в центре города',
    fullDescription: 'Чебоксарский залив — сердце города и любимое место отдыха жителей и туристов. Протяженная набережная длиной более 5 км украшена цветниками, фонтанами и скульптурами. Здесь можно прогуляться вдоль воды, покататься на катамаранах, посетить многочисленные кафе и рестораны. Вечером набережная особенно красива благодаря художественной подсветке.',
    coordinates: [56.1285, 47.2510],
    category: 'Природа',
    image: 'https://cdn.poehali.dev/projects/7118d063-3b01-4fc1-8881-f4143808a0cb/files/6c11b9b7-74c2-4174-b860-c062e1beb4bd.jpg'
  },
  {
    id: 3,
    name: 'Музей чувашской вышивки',
    description: 'Уникальная коллекция традиционного чувашского искусства',
    fullDescription: 'Музей чувашской вышивки представляет богатую коллекцию традиционных нарядов, узоров и техник вышивки чувашского народа. Здесь можно увидеть старинные костюмы, украшенные сложными орнаментами, узнать значение символов и цветов в чувашской культуре. Музей проводит мастер-классы, где посетители могут попробовать себя в искусстве вышивки.',
    coordinates: [56.1350, 47.2450],
    category: 'Музеи',
    image: 'https://cdn.poehali.dev/projects/7118d063-3b01-4fc1-8881-f4143808a0cb/files/61d67579-e56c-4a26-a9b0-f74b46c82191.jpg'
  },
  {
    id: 4,
    name: 'Введенский собор',
    description: 'Древнейший храм города XVII века',
    fullDescription: 'Введенский кафедральный собор — старейшее каменное здание Чебоксар, построенное в 1657 году. Собор является выдающимся памятником русского зодчества XVII века. Внутри храма сохранились фрески и иконостас XIX века. Рядом расположена колокольня высотой 52 метра, с которой открывается панорама исторического центра города.',
    coordinates: [56.1410, 47.2520],
    category: 'Храмы',
    image: 'https://cdn.poehali.dev/projects/7118d063-3b01-4fc1-8881-f4143808a0cb/files/61d67579-e56c-4a26-a9b0-f74b46c82191.jpg'
  },
  {
    id: 5,
    name: 'Национальный музей Чувашии',
    description: 'Крупнейший музей республики с богатой экспозицией',
    fullDescription: 'Чувашский национальный музей — главный музей республики, основанный в 1921 году. Коллекция насчитывает более 200 тысяч экспонатов: археологические находки, предметы быта, произведения искусства, документы по истории края. Особый интерес представляют экспозиции, посвященные традиционной культуре чувашского народа, его обычаям и праздникам.',
    coordinates: [56.1380, 47.2490],
    category: 'Музеи',
    image: 'https://cdn.poehali.dev/projects/7118d063-3b01-4fc1-8881-f4143808a0cb/files/61d67579-e56c-4a26-a9b0-f74b46c82191.jpg'
  }
];

const categories = ['Все', 'Памятники', 'Природа', 'Музеи', 'Храмы'];

const Index = () => {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [activeCategory, setActiveCategory] = useState('Все');

  const filteredAttractions = activeCategory === 'Все' 
    ? attractions 
    : attractions.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="MapPin" size={32} className="text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Интерактивная карта Чувашии</h1>
                <p className="text-sm text-muted-foreground">Откройте красоту родного края</p>
              </div>
            </div>
            <Button className="gap-2">
              <Icon name="Heart" size={18} />
              Избранное
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="map" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="map" className="gap-2">
              <Icon name="Map" size={18} />
              Карта
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <Icon name="List" size={18} />
              Достопримечательности
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-6">
            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className="gap-2"
                >
                  <Icon 
                    name={
                      category === 'Все' ? 'MapPin' :
                      category === 'Памятники' ? 'Landmark' :
                      category === 'Природа' ? 'Trees' :
                      category === 'Музеи' ? 'Building2' :
                      'Church'
                    } 
                    size={16} 
                  />
                  {category}
                </Button>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-xl overflow-hidden shadow-xl h-[600px] border-4 border-white">
                <MapContainer 
                  center={[56.1319, 47.2486]} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredAttractions.map((attraction) => (
                    <Marker 
                      key={attraction.id} 
                      position={attraction.coordinates}
                      eventHandlers={{
                        click: () => setSelectedAttraction(attraction)
                      }}
                    >
                      <Popup>
                        <div className="text-center">
                          <h3 className="font-bold">{attraction.name}</h3>
                          <p className="text-sm">{attraction.description}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              <div>
                {selectedAttraction ? (
                  <Card className="shadow-xl border-2">
                    <CardHeader className="p-0">
                      <img 
                        src={selectedAttraction.image} 
                        alt={selectedAttraction.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name="MapPin" size={20} className="text-primary" />
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                            {selectedAttraction.category}
                          </span>
                        </div>
                        <CardTitle className="text-xl mb-2">{selectedAttraction.name}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {selectedAttraction.fullDescription}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1 gap-2">
                          <Icon name="Navigation" size={16} />
                          Маршрут
                        </Button>
                        <Button variant="outline" size="icon">
                          <Icon name="Heart" size={16} />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Icon name="Share2" size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-xl border-2">
                    <CardContent className="p-8 text-center space-y-4">
                      <Icon name="MousePointerClick" size={48} className="mx-auto text-muted-foreground" />
                      <div>
                        <CardTitle className="mb-2">Выберите достопримечательность</CardTitle>
                        <CardDescription>
                          Кликните на любой маркер на карте, чтобы увидеть подробную информацию
                        </CardDescription>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAttractions.map((attraction) => (
                <Card 
                  key={attraction.id} 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary"
                  onClick={() => setSelectedAttraction(attraction)}
                >
                  <CardHeader className="p-0">
                    <img 
                      src={attraction.image} 
                      alt={attraction.name}
                      className="w-full h-48 object-cover"
                    />
                  </CardHeader>
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={16} className="text-primary" />
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {attraction.category}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{attraction.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {attraction.description}
                    </CardDescription>
                    <Button className="w-full gap-2 mt-4">
                      <Icon name="Info" size={16} />
                      Подробнее
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm mt-16 py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Icon name="Heart" size={16} className="text-red-500" />
            Создано с любовью к Чувашии
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
