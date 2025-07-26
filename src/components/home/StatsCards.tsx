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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="stats-card bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            Mis ganancias totales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            {/* ${calculateTotalCommission(transactions)} */}
            {calculateTotalCommission(transactions)}
          </div>
          <div className="text-xs text-green-600 flex items-center mt-1">
            {/* <span className="mr-1">+6.32%</span> vs last week */}
          </div>
        </CardContent>
      </Card>

      <Card className="stats-card bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <CreditCard className="h-4 w-4 text-blue-600" />
            </div>
            Transacciones Totales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{transactions.length}</div>
          <div className="text-xs text-blue-600 flex items-center mt-1">
            {/* <span className="mr-1">+3.54%</span> vs last month */}
          </div>
        </CardContent>
      </Card>

      <Card className="stats-card bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-full">
              <Check className="h-4 w-4 text-purple-600" />
            </div>
            Ventas Completadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">
            {completedTransactions.length}
          </div>
          <div className="text-xs text-purple-600 flex items-center mt-1">
            {/* <span className="mr-1">+8.12%</span> vs last week */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
