
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type TimePeriod = "fortnight" | "month" | "all";

interface TimePeriodFilterProps {
  currentPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

const TimePeriodFilter: React.FC<TimePeriodFilterProps> = ({
  currentPeriod,
  onPeriodChange,
}) => {
  return (
    <Tabs value={currentPeriod} onValueChange={(value) => onPeriodChange(value as TimePeriod)}>
      <TabsList className="grid grid-cols-3 w-full max-w-xs">
        <TabsTrigger value="fortnight">Última Quincena</TabsTrigger>
        <TabsTrigger value="month">Último Mes</TabsTrigger>
        <TabsTrigger value="all">Histórico</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TimePeriodFilter;
