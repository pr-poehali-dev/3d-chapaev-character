import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { attractions } from '@/data/attractions';

const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface InteractiveMapProps {
  onAttractionSelect?: (id: number) => void;
}

const InteractiveMap = ({ onAttractionSelect }: InteractiveMapProps) => {
  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[56.1297, 47.2500]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {attractions.map((attraction) => (
          <Marker
            key={attraction.id}
            position={attraction.coordinates}
            icon={customIcon}
            eventHandlers={{
              click: () => {
                onAttractionSelect?.(attraction.id);
              },
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg mb-1">{attraction.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{attraction.category}</p>
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <p className="text-sm">{attraction.description.substring(0, 100)}...</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
