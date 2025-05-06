
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { DollarSign } from "lucide-react";

interface CommissionEstimateCardProps {
  timeframe: "day" | "week" | "year";
  setTimeframe: (timeframe: "day" | "week" | "year") => void;
}

const CommissionEstimateCard = ({ timeframe, setTimeframe }: CommissionEstimateCardProps) => {
  const weeklyData = [
    { day: "Sun", value: 4500 },
    { day: "Mon", value: 5200 },
    { day: "Tue", value: 4800 },
    { day: "Wed", value: 4000 },
    { day: "Thu", value: 4900 },
    { day: "Fri", value: 4300 },
    { day: "Sat", value: 4700 },
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-purple-600" />
          <span>Estimado de comisión</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-xs text-purple-600 mb-1">Weekly Earnings</div>
            <div className="text-lg font-bold">$203,378</div>
            <div className="text-xs text-green-600">+6.8%</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-xs text-blue-600 mb-1">Client Visits</div>
            <div className="text-lg font-bold">54,544</div>
            <div className="text-xs text-green-600">+3.53%</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-xs text-green-600 mb-1">Total Profit</div>
            <div className="text-lg font-bold">$333,653</div>
            <div className="text-xs text-green-600">+8.92%</div>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-2">
          <div>Income</div>
          <div className="text-2xl font-bold text-gray-900">$10,823.43</div>
          <div className="text-xs text-green-600">+2.32% Total income in week</div>
        </div>

        <div className="flex space-x-2 mb-4">
          <Button 
            variant={timeframe === "day" ? "default" : "outline"} 
            size="sm" 
            className={timeframe === "day" ? "text-xs bg-brand-purple" : "text-xs"}
            onClick={() => setTimeframe("day")}
          >
            Day
          </Button>
          <Button 
            variant={timeframe === "week" ? "default" : "outline"} 
            size="sm" 
            className={timeframe === "week" ? "text-xs bg-brand-purple" : "text-xs"}
            onClick={() => setTimeframe("week")}
          >
            Week
          </Button>
          <Button 
            variant={timeframe === "year" ? "default" : "outline"} 
            size="sm" 
            className={timeframe === "year" ? "text-xs bg-brand-purple" : "text-xs"}
            onClick={() => setTimeframe("year")}
          >
            Year
          </Button>
        </div>
        
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar 
                dataKey="value" 
                fill="#9b87f5"
                radius={[5, 5, 0, 0]} 
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionEstimateCard;
