import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Attraction } from '@/data/attractions';

interface AttractionCardProps {
  attraction: Attraction;
  onClick?: () => void;
}

const AttractionCard = ({ attraction, onClick }: AttractionCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img
          src={attraction.image}
          alt={attraction.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
          {attraction.category}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{attraction.name}</CardTitle>
        <CardDescription className="text-sm">
          {attraction.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default AttractionCard;
