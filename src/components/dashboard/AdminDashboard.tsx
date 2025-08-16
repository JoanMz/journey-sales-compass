import React from "react";
import { useData } from "../../contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PendingTransactions from "../admin/PendingTransactions";
import TransaccionesClientes from "./TransaccionesClientes";
import AdminFinancialMetrics from "./AdminFinancialMetrics";
// import { QuincenalCommissions } from './QuincenalCommissions';

const AdminDashboard = () => {
  const { sales } = useData();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <AdminFinancialMetrics />
      {/* <QuincenalCommissions /> */}
      <PendingTransactions />
      
      {/* Evidencias Pendientes Card */}
      <Card className="bg-orange-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-orange-700 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Evidencias Pendientes de Aprobación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 mb-2">
                Revisa y aprueba las evidencias de pago enviadas por los vendedores
              </p>
              <p className="text-sm text-orange-500">
                Accede a la página dedicada para gestionar todas las evidencias pendientes
              </p>
            </div>
            <Button
              onClick={() => navigate("/pending-evidence")}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Ver Evidencias
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <TransaccionesClientes sales={sales} />
    </div>
  );
};

export default AdminDashboard;
