
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const TopDestinationsCard = () => {
  // Expanded fictional destination data
  const destinations = [
    { name: "Cancún, Mexico", percentage: 32, bookings: 245, color: "blue", revenue: "$98,750" },
    { name: "Paris, France", percentage: 28, bookings: 213, color: "purple", revenue: "$86,430" },
    { name: "Santorini, Greece", percentage: 21, bookings: 162, color: "green", revenue: "$65,280" },
    { name: "Bali, Indonesia", percentage: 18, bookings: 138, color: "orange", revenue: "$49,680" },
    { name: "Tokyo, Japan", percentage: 15, bookings: 114, color: "red", revenue: "$41,040" },
    { name: "New York, USA", percentage: 12, bookings: 92, color: "yellow", revenue: "$37,720" },
    { name: "Barcelona, Spain", percentage: 10, bookings: 76, color: "teal", revenue: "$28,880" },
    { name: "Cape Town, South Africa", percentage: 8, bookings: 61, color: "indigo", revenue: "$24,400" },
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
          <div className="overflow-auto max-h-80 pr-1">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b">
                  <th className="pb-2 text-left font-medium">Destino</th>
                  <th className="pb-2 text-right font-medium">Bookings</th>
                  <th className="pb-2 text-right font-medium">Revenue</th>
                  <th className="pb-2 text-right font-medium">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {destinations.map((destination, index) => (
                  <tr key={index} className="text-sm">
                    <td className="py-2.5">
                      <div className="flex items-center">
                        <span 
                          className={`h-3 w-3 rounded-full bg-${destination.color}-500 mr-2 flex-shrink-0`}
                          aria-hidden="true"
                        ></span>
                        <span className="font-medium text-gray-800">{destination.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right text-gray-600">{destination.bookings}</td>
                    <td className="py-2.5 text-right text-gray-600">{destination.revenue}</td>
                    <td className="py-2.5 text-right">
                      <span className={`text-${destination.color}-600 font-medium`}>
                        {destination.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Summary section - removed colorful boxes */}
          <div className="pt-2 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Bookings</span>
              <span className="font-semibold">1,101</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Total Revenue</span>
              <span className="font-semibold text-green-600">$432,180</span>
            </div>
          </div>
          
          {/* View all button */}
          <button className="w-full text-center text-sm text-purple-600 hover:text-purple-800 pt-1">
            Ver todos los destinos
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopDestinationsCard;
