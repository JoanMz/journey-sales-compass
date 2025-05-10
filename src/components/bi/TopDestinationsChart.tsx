
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface Destination {
  name: string;
  visits: number;
  revenue: number;
}

interface TopDestinationsChartProps {
  destinations: Destination[];
  sortBy?: 'visits' | 'revenue';
  limit?: number;
}

const TopDestinationsChart = ({ 
  destinations, 
  sortBy = 'visits', 
  limit = 5 
}: TopDestinationsChartProps) => {
  const sortedDestinations = [...destinations]
    .sort((a, b) => b[sortBy] - a[sortBy])
    .slice(0, limit);
    
  const COLORS = ['#8884d8', '#4338ca', '#0284c7', '#7c3aed', '#0f766e', '#0ea5e9', '#9b87f5'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Destinos Más Populares</CardTitle>
        <CardDescription>
          {sortBy === 'visits' 
            ? 'Destinos con más visitas' 
            : 'Destinos con mayor ingreso'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedDestinations}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip 
                formatter={(value: number) => sortBy === 'revenue' 
                  ? `$${value.toLocaleString()}` 
                  : value.toLocaleString()}
                labelFormatter={(label) => `Destino: ${label}`}
              />
              <Bar 
                dataKey={sortBy} 
                name={sortBy === 'visits' ? 'Visitas' : 'Ingresos'}
                radius={[0, 4, 4, 0]}
                maxBarSize={30}
              >
                {sortedDestinations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopDestinationsChart;
