
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Temporary token input for demo purposes
// In production, this should be stored securely
const DEFAULT_TOKEN = ""; // Add your token here or leave empty to prompt user

interface TravelMapProps {
  destinations?: Array<{
    name: string;
    lat: number;
    lng: number;
    popularity: number;
  }>;
  origins?: Array<{
    name: string;
    lat: number;
    lng: number;
    count: number;
  }>;
}

const TravelMap = ({ destinations = [], origins = [] }: TravelMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState(DEFAULT_TOKEN);
  const [tokenInput, setTokenInput] = useState("");
  
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;
    
    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      projection: 'globe',
      zoom: 1.5,
      center: [0, 20],
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );
    
    // Add markers and connections when map loads
    map.current.on('load', () => {
      // Set atmosphere and fog
      map.current?.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });
      
      // Add destinations as markers
      destinations.forEach(dest => {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'destination-marker';
        el.style.backgroundColor = '#3b82f6';
        el.style.width = `${Math.max(10, dest.popularity / 10)}px`;
        el.style.height = `${Math.max(10, dest.popularity / 10)}px`;
        el.style.borderRadius = '50%';
        
        // Add popup
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<strong>${dest.name}</strong><br>Popularidad: ${dest.popularity}`);
        
        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat([dest.lng, dest.lat])
          .setPopup(popup)
          .addTo(map.current!);
      });
      
      // Add origins as markers
      origins.forEach(origin => {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'origin-marker';
        el.style.backgroundColor = '#10b981';
        el.style.width = `${Math.max(8, origin.count / 3)}px`;
        el.style.height = `${Math.max(8, origin.count / 3)}px`;
        el.style.borderRadius = '50%';
        
        // Add popup
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<strong>${origin.name}</strong><br>Viajeros: ${origin.count}`);
        
        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat([origin.lng, origin.lat])
          .setPopup(popup)
          .addTo(map.current!);
        
        // For each origin, draw lines to all destinations they travel to
        destinations.forEach(dest => {
          // Only add lines with some probability to avoid cluttering
          if (Math.random() > 0.7) return;
          
          if (map.current?.getSource(`route-${origin.name}-${dest.name}`)) return;
          
          map.current?.addSource(`route-${origin.name}-${dest.name}`, {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': {
                'type': 'LineString',
                'coordinates': [
                  [origin.lng, origin.lat],
                  [dest.lng, dest.lat]
                ]
              }
            }
          });
          
          map.current?.addLayer({
            'id': `route-${origin.name}-${dest.name}`,
            'type': 'line',
            'source': `route-${origin.name}-${dest.name}`,
            'layout': {
              'line-join': 'round',
              'line-cap': 'round'
            },
            'paint': {
              'line-color': '#10b981',
              'line-opacity': 0.4,
              'line-width': 1,
              'line-dasharray': [2, 2]
            }
          });
        });
      });
    });

    // Rotation animation settings
    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;

    // Spin globe function
    function spinGlobe() {
      if (!map.current) return;
      
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    // Event listeners for interaction
    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('moveend', () => {
      spinGlobe();
    });

    // Start the globe spinning
    spinGlobe();

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, destinations, origins]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      setMapboxToken(tokenInput.trim());
    }
  };

  if (!mapboxToken) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Viajes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <p className="mb-4">Por favor ingresa tu token público de Mapbox para visualizar el mapa.</p>
            <form onSubmit={handleTokenSubmit} className="flex gap-2">
              <input 
                type="text" 
                value={tokenInput} 
                onChange={(e) => setTokenInput(e.target.value)} 
                placeholder="pk.eyJ1IjoieW91..." 
                className="flex-1 px-3 py-2 border rounded-md"
                required
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Cargar Mapa
              </button>
            </form>
            <p className="mt-2 text-sm text-gray-500">
              Puedes encontrar tu token público de Mapbox en tu <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-blue-500">cuenta de Mapbox</a>.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa de Flujos Turísticos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] relative rounded-md overflow-hidden">
          <div ref={mapContainer} className="absolute inset-0" />
          <div className="absolute bottom-4 right-4 bg-white p-2 rounded-md shadow-md text-xs">
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>Destinos</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Orígenes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelMap;
