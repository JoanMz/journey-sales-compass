
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
  MessageSquare,
  Headset, 
  Users,
  TrendingUp
} from "lucide-react";
import SellerScoreCard from "./SellerScoreCard";
import TopDestinationsCard from "./TopDestinationsCard";
import TopSalesCard from "./TopSalesCard";
import CommissionEstimateCard from "./CommissionEstimateCard";
import SalesStatusCards from "./SalesStatusCards";

const ManagerDashboard = () => {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "year">("week");
  
  const supportNumbers = {
    totalResolved: "124",
    totalActive: 36
  };

  return (
    <div className="space-y-6">
      {/* Support Team Dashboard Header */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-2 border-b border-blue-200">
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Headset className="h-6 w-6" />
            Panel de Equipo de Soporte
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-blue-600">Tickets resueltos</p>
              <p className="text-2xl font-bold text-blue-900">{supportNumbers.totalResolved}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-blue-600">Tickets activos</p>
              <p className="text-2xl font-bold text-blue-900">{supportNumbers.totalActive}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Status Cards - New, In Progress, Resolved */}
      <SalesStatusCards />
      
      {/* 2x2 Grid with specific components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Estimate */}
        <CommissionEstimateCard timeframe={timeframe} setTimeframe={setTimeframe} />
        
        {/* Support Agent Score Card */}
        <SellerScoreCard />
        
        {/* Top Issue Categories */}
        <TopDestinationsCard />
        
        {/* Recent Resolved Issues */}
        <TopSalesCard />
      </div>
    </div>
  );
};

export default ManagerDashboard;
