import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CreditCard, Users, DollarSign } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTransactions } from "../../hooks/useTransactions";
import { calculateTotalCommission } from "../../lib/financialUtils";
import { QuincenalCommissions } from "../dashboard/QuincenalCommissions";
import ManagerDashboard from "../dashboard/ManagerDashboard";
import AdminDashboard from "../dashboard/AdminDashboard";

export const RoleSpecificDashboard = () => {
  const { isAdmin, isSeller, isManager } = useAuth();
  const { filteredTransactions } = useTransactions();

  if (isAdmin) {
    return <AdminDashboard />;
  } else if (isManager) {
    return <ManagerDashboard />;
  } else if (isSeller) {
    // Calcular comisiones del vendedor
    const sellerCommissions = calculateTotalCommission(filteredTransactions);
    const completedTransactions = filteredTransactions.filter(
      (t) => t.displayStatus === "Aprobado" || t.displayStatus === "Terminado"
    );
    const totalSales = filteredTransactions.length;

    return (
      <div className="space-y-6">
        {/* <Card className="bg-green-50 border-green-200 mb-6">
          <CardHeader className="pb-2 border-b border-green-200">
            <CardTitle className="text-green-700">Panel de Ventas</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-green-700 mb-3">
              Bienvenido a tu panel de ventas. Gestiona tus transacciones y rendimiento.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-md border border-green-200 flex items-center">
                <DollarSign className="h-10 w-10 text-green-500 mr-3" />
                <div>
                  <div className="font-semibold text-green-700">Tus Comisiones Totales</div>
                  <div className="text-2xl font-bold text-green-600">{sellerCommissions}</div>
                  <div className="text-sm text-green-500">2.25% acumulado de todas las ventas aprobadas</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-md border border-green-200 flex items-center">
                <CreditCard className="h-10 w-10 text-green-500 mr-3" />
                <div>
                  <div className="font-semibold text-green-700">Total de Transacciones</div>
                  <div className="text-2xl font-bold text-green-600">{totalSales}</div>
                  <div className="text-sm text-green-500">Todas tus transacciones (todas las etapas)</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-md border border-green-200 flex items-center">
                <Users className="h-10 w-10 text-green-500 mr-3" />
                <div>
                  <div className="font-semibold text-green-700">Ventas Aprobadas</div>
                  <div className="text-2xl font-bold text-green-600">{completedTransactions.length}</div>
                  <div className="text-sm text-green-500">Transacciones aprobadas con comisiones</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
        
        {/* Comisiones Quincenales para el vendedor */}
        <QuincenalCommissions />
      </div>
    );
  }
  return null;
}; 