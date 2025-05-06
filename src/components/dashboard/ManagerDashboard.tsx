
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  MapPin,
  DollarSign, 
  Award, 
  TrendingUp,
  Users
} from "lucide-react";
import SellerScoreCard from "./SellerScoreCard";
import TopDestinationsCard from "./TopDestinationsCard";
import TopSalesCard from "./TopSalesCard";
import CommissionEstimateCard from "./CommissionEstimateCard";
import SalesStatusCards from "./SalesStatusCards";

const ManagerDashboard = () => {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "year">("week");
  
  const salesNumbers = {
    totalAmount: "$21,600,000",
    totalCount: 12
  };

  return (
    <div className="space-y-6">
      {/* Asesor Dashboard Header */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader className="pb-2 border-b border-purple-200">
          <CardTitle className="text-purple-800 flex items-center gap-2">
            <Users className="h-6 w-6" />
            Asesor Board
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-purple-600">Monto de ventas</p>
              <p className="text-2xl font-bold text-purple-900">{salesNumbers.totalAmount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-purple-600">Nr ventas hechas</p>
              <p className="text-2xl font-bold text-purple-900">{salesNumbers.totalCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Status Cards - Inquiry, Pending, Done */}
      <SalesStatusCards />
      
      {/* 2x2 Grid with specific components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commission Estimate */}
        <CommissionEstimateCard timeframe={timeframe} setTimeframe={setTimeframe} />
        
        {/* Seller Score Card */}
        <SellerScoreCard />
        
        {/* Top Destinations */}
        <TopDestinationsCard />
        
        {/* Top Sales of the Week */}
        <TopSalesCard />
      </div>
    </div>
  );
};

export default ManagerDashboard;
