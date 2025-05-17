
import React from "react";
import { useData } from "../../contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import PendingTransactions from "../admin/PendingTransactions";
import TransaccionesClientes from "./TransaccionesClientes";
import AdminFinancialMetrics from "./AdminFinancialMetrics";
import CommissionDetails from "./CommissionDetails";

const AdminDashboard = () => {
  const { sales } = useData();
  
  return (
    <div className="space-y-6">
      {/* Financial Metrics - Top Priority */}
      <AdminFinancialMetrics />
      
      {/* Commission Details - Collapsible */}
      {/* <CommissionDetails /> */}
      
      {/* Pending Transactions - High Priority */}
      <PendingTransactions />
      
      {/* Customer Transactions Table */}
      <Card className="bg-white border-blue-200 mb-6">
        <CardHeader className="pb-2 border-b border-blue-200">
          <CardTitle className="text-blue-700">Transacciones de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 p-0">
          <TransaccionesClientes sales={sales} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
