import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SalesTransaction } from "../../types/sales";
import { calculateTotalCommission } from "../../lib/financialUtils";
import { DollarSign, CreditCard, Check } from "lucide-react";

interface StatsCardsProps {
  transactions: SalesTransaction[];
}

export const StatsCards = ({ transactions }: StatsCardsProps) => {
  const completedTransactions = transactions.filter(
    (t) => t.displayStatus === "Terminado"
  );

  return null;
};
