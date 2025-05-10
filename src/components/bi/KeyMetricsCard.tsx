
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Map, Calendar } from 'lucide-react';

interface Metric {
  id: string;
  name: string;
  value: string | number;
  change: number;
  changeTimeframe: string;
  icon?: React.ComponentType<any>;
}

interface KeyMetricsCardProps {
  metrics: Metric[];
}

const KeyMetricsCard = ({ metrics }: KeyMetricsCardProps) => {
  // Map for icon component lookup
  const iconMap: Record<string, React.ComponentType<any>> = {
    users: Users,
    map: Map,
    calendar: Calendar,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric) => {
        const IconComponent = metric.icon || iconMap[metric.id] || Users;
        const isPositive = metric.change >= 0;
        
        return (
          <Card key={metric.id} className={metric.id === 'featured' ? 'md:col-span-3' : ''}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {metric.name}
              </CardTitle>
              <IconComponent className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center mt-1">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
                  {isPositive ? '+' : ''}{metric.change}% 
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  ({metric.changeTimeframe})
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default KeyMetricsCard;
