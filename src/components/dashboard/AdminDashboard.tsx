import React from "react";
import { useData } from "../../contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import PendingTransactions from "../admin/PendingTransactions";
import TransaccionesClientes from "./TransaccionesClientes";
import AdminFinancialMetrics from "./AdminFinancialMetrics";
import { QuincenalCommissions } from './QuincenalCommissions';

const AdminDashboard = () => {
  const { sales } = useData();

  return (
    <div className="space-y-6">
      <AdminFinancialMetrics />
      <QuincenalCommissions />
      <PendingTransactions />
      <TransaccionesClientes sales={sales} />
    </div>
  );
};

export default AdminDashboard;
