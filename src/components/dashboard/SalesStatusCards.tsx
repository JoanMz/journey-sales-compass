
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Clock, Check } from "lucide-react";

const SalesStatusCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Inquiry Card */}
      <Card className="border-l-4 border-l-blue-400">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-blue-500" />
            <span>Inquiry</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">Cancún Package</div>
                <div className="text-sm text-gray-500">2h ago</div>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Juan Perez - $1,200
              </div>
            </div>
            <div className="p-4 bg-white rounded border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">Europe Tour</div>
                <div className="text-sm text-gray-500">5h ago</div>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Maria Garcia - $3,500
              </div>
            </div>
            <div className="text-center">
              <button className="text-sm text-purple-600 hover:text-purple-800">
                View all inquiries...
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Pending Card */}
      <Card className="border-l-4 border-l-yellow-400">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-500" />
            <span>Pending</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">Riviera Maya Vacation</div>
                <div className="text-sm text-gray-500">1d ago</div>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Carlos Rodriguez - $2,300
              </div>
            </div>
            <div className="p-4 bg-white rounded border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">Los Cabos Weekend</div>
                <div className="text-sm text-gray-500">2d ago</div>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Ana Lopez - $1,800
              </div>
            </div>
            <div className="text-center">
              <button className="text-sm text-purple-600 hover:text-purple-800">
                View all pending...
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Done Card */}
      <Card className="border-l-4 border-l-green-400">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Done</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">New York City Trip</div>
                <div className="text-sm text-gray-500">3d ago</div>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Sofia Martinez - $4,200
              </div>
            </div>
            <div className="p-4 bg-white rounded border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">Paris Getaway</div>
                <div className="text-sm text-gray-500">5d ago</div>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Eduardo Sanchez - $5,100
              </div>
            </div>
            <div className="text-center">
              <button className="text-sm text-purple-600 hover:text-purple-800">
                View all completed...
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesStatusCards;
