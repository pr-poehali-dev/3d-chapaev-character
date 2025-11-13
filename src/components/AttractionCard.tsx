import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Attraction } from '@/data/attractions';

interface AttractionCardProps {
  attraction: Attraction;
  onClick?: () => void;
}

const AttractionCard = ({ attraction, onClick }: AttractionCardProps) => {
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Природа': return 'bg-accent hover:bg-accent/90';
      case 'Храмы': return 'bg-primary hover:bg-primary/90';
      case 'Музеи': return 'bg-secondary hover:bg-secondary/90';
      case 'Памятники': return 'bg-purple-500 hover:bg-purple-600';
      case 'Культура': return 'bg-pink-500 hover:bg-pink-600';
      default: return 'bg-primary hover:bg-primary/90';
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50"
      onClick={onClick}
    >
      <div className="relative h-56 overflow-hidden rounded-t-lg">
        <img
          src={attraction.image}
          alt={attraction.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <Badge className={`absolute top-4 right-4 text-white shadow-lg ${getCategoryColor(attraction.category)}`}>
          {attraction.category}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-bold">{attraction.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-3 mt-2">
          {attraction.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default AttractionCard;