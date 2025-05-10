
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface TrendData {
  month: string;
  domestic: number;
  international: number;
}

interface SeasonalTrendsChartProps {
  data: TrendData[];
}

const SeasonalTrendsChart = ({ data }: SeasonalTrendsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencias Estacionales</CardTitle>
        <CardDescription>
          Distribución de viajes por mes (domésticos vs. internacionales)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorDomestic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorInternational" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip
                formatter={(value: number) => value.toLocaleString()}
              />
              <Legend 
                formatter={(value) => value === 'domestic' ? 'Viajes Domésticos' : 'Viajes Internacionales'} 
              />
              <Area 
                type="monotone" 
                dataKey="domestic" 
                name="Viajes Domésticos"
                stroke="#8884d8" 
                fillOpacity={1}
                fill="url(#colorDomestic)" 
              />
              <Area 
                type="monotone" 
                dataKey="international" 
                name="Viajes Internacionales"
                stroke="#0ea5e9" 
                fillOpacity={1}
                fill="url(#colorInternational)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeasonalTrendsChart;
