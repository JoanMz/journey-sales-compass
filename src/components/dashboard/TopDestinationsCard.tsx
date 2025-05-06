
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";

const TopDestinationsCard = () => {
  // Expanded fictional destination data
  const destinations = [
    { name: "Cancún, Mexico", percentage: 32, bookings: 245, color: "blue", revenue: "$98,750" },
    { name: "Paris, France", percentage: 28, bookings: 213, color: "purple", revenue: "$86,430" },
    { name: "Santorini, Greece", percentage: 21, bookings: 162, color: "green", revenue: "$65,280" },
    { name: "Bali, Indonesia", percentage: 18, bookings: 138, color: "orange", revenue: "$49,680" },
    { name: "Tokyo, Japan", percentage: 15, bookings: 114, color: "red", revenue: "$41,040" },
  ];

  return (
    <Card className="bg-white border border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          <span>Top destinos</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Destino</TableHead>
                <TableHead className="text-right">Bookings</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {destinations.map((destination, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <span 
                        className={`h-3 w-3 rounded-full mr-2 flex-shrink-0 bg-${destination.color}-500`}
                        aria-hidden="true"
                      ></span>
                      {destination.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{destination.bookings}</TableCell>
                  <TableCell className="text-right">{destination.revenue}</TableCell>
                  <TableCell className="text-right font-medium text-blue-600">
                    {destination.percentage}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Summary section */}
          <div className="pt-2 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Bookings</span>
              <span className="font-semibold">872</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Total Revenue</span>
              <span className="font-semibold text-green-600">$341,180</span>
            </div>
          </div>
          
          {/* View all button */}
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 pt-1">
            Ver todos los destinos
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopDestinationsCard;
