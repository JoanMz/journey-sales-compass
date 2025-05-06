
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const TopDestinationsCard = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          <span>Top destinos</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[200px] w-full">
          {/* World map background - simplified version */}
          <div className="absolute inset-0 bg-gray-100 rounded-lg opacity-30">
            <svg viewBox="0 0 800 400" className="w-full h-full">
              <path
                d="M217,185.7c-4.3,1.9-8.6,3.9-12.9,5.8c-2.1-4.3-4.2-8.7-6.3-13c-2.3-4.8-4.7-9.6-7-14.4
                c-1.3-2.6-2.5-5.2-3.8-7.8c-1.4-2.8-2.9-5.7-4.3-8.5c-1-2-2-4-3.1-6c-0.1-0.2-0.2-0.4-0.3-0.5c-0.1-0.1-0.2-0.2-0.3-0.3
                c-0.1-0.1-0.3-0.2-0.4-0.2c-0.1,0-0.2,0-0.3,0c-0.2,0-0.3,0.1-0.4,0.2c-0.3,0.2-0.4,0.6-0.3,0.9c0.1,0.3,0.3,0.5,0.5,0.7
                c1.8,1.5,3.6,3.1,5.3,4.6c1.8,1.6,3.6,3.1,5.4,4.7c1.8,1.6,3.6,3.2,5.4,4.7c0.2,0.2,0.4,0.4,0.7,0.6c0.1,0,0.2,0.1,0.3,0.1"
                fill="none" stroke="#999" strokeWidth="1"
              />
              {/* More path elements would go here for a full world map */}
            </svg>
          </div>
          
          {/* Popular destination markers */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-blue-500 rounded-full w-4 h-4 pulse-animation"></div>
          </div>
          <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-blue-500 rounded-full w-3 h-3 pulse-animation"></div>
          </div>
          <div className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-blue-500 rounded-full w-5 h-5 pulse-animation"></div>
          </div>
          
          {/* Credit card graphic to represent travel spending */}
          <div className="absolute bottom-5 right-5">
            <div className="w-16 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md shadow-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
            </div>
          </div>
          
          {/* Destination labels */}
          <div className="absolute top-10 left-10 text-xs font-medium text-gray-700">Europe</div>
          <div className="absolute top-20 left-1/4 text-xs font-medium text-gray-700">North America</div>
          <div className="absolute bottom-10 left-1/3 text-xs font-medium text-gray-700">South America</div>
          <div className="absolute top-1/2 right-10 text-xs font-medium text-gray-700">Asia</div>
        </div>
        
        {/* Stats below the map */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-blue-50 p-2 rounded text-center">
            <div className="text-sm font-medium text-blue-700">Cancún</div>
            <div className="text-xs text-blue-600">32%</div>
          </div>
          <div className="bg-purple-50 p-2 rounded text-center">
            <div className="text-sm font-medium text-purple-700">Europe</div>
            <div className="text-xs text-purple-600">28%</div>
          </div>
          <div className="bg-green-50 p-2 rounded text-center">
            <div className="text-sm font-medium text-green-700">Caribbean</div>
            <div className="text-xs text-green-600">24%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopDestinationsCard;
