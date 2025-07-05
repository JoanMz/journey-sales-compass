import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SalesTransaction } from "../../types/sales";
import { calculateTotalCommission } from "../../lib/financialUtils";

interface StatsCardsProps {
  transactions: SalesTransaction[];
}

export const StatsCards = ({ transactions }: StatsCardsProps) => {
  const completedTransactions = transactions.filter(t => t.displayStatus === "Terminado");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="stats-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Mis ganancias totales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${calculateTotalCommission(transactions)}
          </div>
          <div className="text-xs text-green-600 flex items-center mt-1">
            {/* <span className="mr-1">+6.32%</span> vs last week */}
          </div>
        </CardContent>
      </Card>

      <Card className="stats-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Transacciones Totales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{transactions.length}</div>
          <div className="text-xs text-green-600 flex items-center mt-1">
            {/* <span className="mr-1">+3.54%</span> vs last month */}
          </div>
        </CardContent>
      </Card>

      <Card className="stats-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Ventas Completadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {completedTransactions.length}
          </div>
          <div className="text-xs text-green-600 flex items-center mt-1">
            {/* <span className="mr-1">+8.12%</span> vs last week */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 