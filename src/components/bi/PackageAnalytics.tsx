
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface TourPackage {
  name: string;
  sales: number;
  revenue: number;
}

interface PackageAnalyticsProps {
  packages: TourPackage[];
}

const PackageAnalytics = ({ packages }: PackageAnalyticsProps) => {
  const COLORS = ['#8884d8', '#4338ca', '#0284c7', '#7c3aed', '#0f766e', '#0ea5e9', '#9b87f5'];
  
  // Calculate total revenue for percentage
  const totalRevenue = packages.reduce((sum, pkg) => sum + pkg.revenue, 0);
  
  const data = packages.map(pkg => ({
    name: pkg.name,
    value: pkg.revenue,
    sales: pkg.sales,
    percentage: ((pkg.revenue / totalRevenue) * 100).toFixed(1)
  }));

  const renderCustomizedLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent 
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Paquetes Turísticos</CardTitle>
        <CardDescription>
          Distribución de ventas por paquete turístico
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                innerRadius={60}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value, entry, index) => `${value} - ${data[index]?.percentage}%`}
              />
              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString()}`}
                labelFormatter={(index) => `Paquete: ${data[index].name}`}
                itemSorter={(item) => -item.value}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageAnalytics;
