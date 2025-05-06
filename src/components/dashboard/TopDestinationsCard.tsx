
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const TopDestinationsCard = () => {
  // Sample destination data (you can replace this with actual data)
  const destinations = [
    { name: "Cancún", percentage: 32, color: "blue" },
    { name: "Europe", percentage: 28, color: "purple" },
    { name: "Caribbean", percentage: 24, color: "green" },
    { name: "New York", percentage: 18, color: "orange" },
    { name: "Tokyo", percentage: 15, color: "red" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          <span>Top destinos</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* List of top destinations */}
          <ul className="space-y-3">
            {destinations.map((destination, index) => (
              <li 
                key={index} 
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full bg-${destination.color}-500`}></span>
                  <span className="font-medium">{destination.name}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-[150px] bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      className={`bg-${destination.color}-500 h-2.5 rounded-full`} 
                      style={{ width: `${destination.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{destination.percentage}%</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-2 mt-6">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default TopDestinationsCard;
