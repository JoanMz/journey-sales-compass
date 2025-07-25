import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CreditCard, Users } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import ManagerDashboard from "../dashboard/ManagerDashboard";
import AdminDashboard from "../dashboard/AdminDashboard";

export const RoleSpecificDashboard = () => {
  const { isAdmin, isSeller, isManager } = useAuth();

  if (isAdmin) {
    return <AdminDashboard />;
  } else if (isManager) {
    return <ManagerDashboard />;
  } else if (isSeller) {
    return (
      <Card className="bg-green-50 border-green-200 mb-6">
        <CardHeader className="pb-2 border-b border-green-200">
          <CardTitle className="text-green-700">Panel de Ventas</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-green-700 mb-3">
            Bienvenido a tu panel de ventas. Gestiona tus transacciones y rendimiento.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md border border-green-200 flex items-center">
              <CreditCard className="h-10 w-10 text-green-500 mr-3" />
              <div>
                <div className="font-semibold text-green-700">Tus Comisiones</div>
                <div className="text-sm text-green-600">Ingresos del mes</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md border border-green-200 flex items-center">
              <Users className="h-10 w-10 text-green-500 mr-3" />
              <div>
                <div className="font-semibold text-green-700">Lista de Clientes</div>
                <div className="text-sm text-green-600">Contactos de clientes</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return null;
}; 