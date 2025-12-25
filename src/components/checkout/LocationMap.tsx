import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { storeLocation } from '@/data/products';
import { MapPin } from 'lucide-react';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LocationMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLat?: number;
  selectedLng?: number;
}

const LocationMap: React.FC<LocationMapProps> = ({
  onLocationSelect,
  selectedLat,
  selectedLng,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView(
      [storeLocation.latitude, storeLocation.longitude],
      13
    );

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map.current);

    // Add store marker
    const storeIcon = L.divIcon({
      className: 'custom-store-marker',
      html: `<div style="background-color: hsl(25, 60%, 25%); color: white; padding: 8px; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });

    L.marker([storeLocation.latitude, storeLocation.longitude], { icon: storeIcon })
      .addTo(map.current)
      .bindPopup('<b>Toko Kue Manis</b><br>' + storeLocation.address);

    // Click handler
    map.current.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      placeMarker(lat, lng);
      onLocationSelect(lat, lng);
    });

    // If initial location is provided
    if (selectedLat && selectedLng) {
      placeMarker(selectedLat, selectedLng);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const placeMarker = (lat: number, lng: number) => {
    if (!map.current) return;

    if (marker.current) {
      marker.current.setLatLng([lat, lng]);
    } else {
      const deliveryIcon = L.divIcon({
        className: 'custom-delivery-marker',
        html: `<div style="background-color: hsl(350, 50%, 75%); color: hsl(25, 40%, 15%); padding: 8px; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      marker.current = L.marker([lat, lng], { icon: deliveryIcon, draggable: true })
        .addTo(map.current)
        .bindPopup('Lokasi Pengiriman');

      marker.current.on('dragend', () => {
        const position = marker.current?.getLatLng();
        if (position) {
          onLocationSelect(position.lat, position.lng);
        }
      });
    }

    map.current.setView([lat, lng], 15);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung browser Anda');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        placeMarker(latitude, longitude);
        onLocationSelect(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Tidak dapat mengakses lokasi. Silakan pilih manual di peta.');
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleGetCurrentLocation}
        disabled={isLocating}
        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
      >
        <MapPin className="w-4 h-4" />
        {isLocating ? 'Mencari lokasi...' : 'Gunakan Lokasi Saya'}
      </button>
      <div
        ref={mapContainer}
        className="w-full h-64 md:h-80 rounded-xl border border-border overflow-hidden"
      />
      <p className="text-sm text-muted-foreground">
        Klik pada peta atau geser marker untuk menentukan lokasi pengiriman
      </p>
    </div>
  );
};

export default LocationMap;
