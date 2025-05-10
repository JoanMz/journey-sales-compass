
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ConversionStep {
  name: string;
  count: number;
  percentage: number;
}

interface ConversionRateCardProps {
  steps: ConversionStep[];
  title?: string;
  description?: string;
}

const ConversionRateCard = ({
  steps,
  title = "Embudo de Conversión",
  description = "Del interés a la venta: seguimiento del proceso de conversión"
}: ConversionRateCardProps) => {
  // Get starting count for percentage calculations
  const initialCount = steps[0]?.count || 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step, index) => {
            const percentOfTotal = initialCount > 0 ? (step.count / initialCount * 100) : 0;
            
            return (
              <div key={step.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{step.name}</span>
                  <span className="text-gray-500">{step.count.toLocaleString()} usuarios</span>
                </div>
                
                <div className="relative">
                  <Progress value={percentOfTotal} className="h-2" />
                  <span className="absolute right-0 top-2 text-xs text-gray-500">
                    {percentOfTotal.toFixed(1)}%
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      Tasa de conversión: {step.percentage}%
                    </span>
                    <span>
                      {((steps[index + 1].count / step.count) * 100).toFixed(1)}% al siguiente paso
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionRateCard;
