import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import type { Attraction } from '@/data/attractions';

interface AttractionDialogProps {
  attraction: Attraction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AttractionDialog = ({ attraction, open, onOpenChange }: AttractionDialogProps) => {
  if (!attraction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative h-64 -mx-6 -mt-6 mb-4 overflow-hidden">
          <img
            src={attraction.image}
            alt={attraction.name}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
            {attraction.category}
          </Badge>
        </div>
        
        <DialogHeader>
          <DialogTitle className="text-2xl">{attraction.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-base">
            <Icon name="MapPin" size={16} className="text-primary" />
            <span>Координаты: {attraction.coordinates[0].toFixed(4)}, {attraction.coordinates[1].toFixed(4)}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-base leading-relaxed">{attraction.description}</p>
          
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Icon name="Info" size={18} />
              Полезная информация
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Icon name="Clock" size={16} className="mt-0.5 flex-shrink-0" />
                <span>Рекомендуемое время для посещения: 1-2 часа</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Camera" size={16} className="mt-0.5 flex-shrink-0" />
                <span>Отличное место для фотографий</span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttractionDialog;
