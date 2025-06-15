import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import AppLayout from "../components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Plus, Check, Clock, X, Users, CreditCard } from "lucide-react";
import ManagerDashboard from "../components/dashboard/ManagerDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import EnhancedSalesForm from "../components/forms/EnhancedSalesForm";
import FlightHotelForm from "../components/forms/FlightHotelForm";
import { SalesFormData, SalesTransaction, FlightInfo, HotelInfo } from "../types/sales";
import { mapStatusToSpanish } from "../lib/utils";
import { createTransaction, updateTransactionWithFlightHotel } from "@/lib/api";
import { toast } from "sonner";

const Home = () => {
  const { isAdmin, isSeller, isManager, user } = useAuth();
  const { transactions, loading, refreshTransactions, addTransaction } = useData();
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
  const [isCompleteInfoOpen, setIsCompleteInfoOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);

  // Convert transactions to sales format with proper status mapping
  const salesTransactions: SalesTransaction[] = transactions.map(transaction => ({
    ...transaction,
    customerAvatar: "",
    displayStatus: mapStatusToSpanish(transaction.status)
  }));

  // Filter transactions for the current user if not admin
  const filteredTransactions = isAdmin
    ? salesTransactions
    : salesTransactions.filter(transaction => transaction.seller_id.toString() === user?.id?.toString());

  // Group transactions by status for Kanban view - Updated to include "Terminado"
  const kanbanGroups = {
    "Pendiente": filteredTransactions.filter(transaction => transaction.displayStatus === "Pendiente"),
    "Aprobado": filteredTransactions.filter(transaction => transaction.displayStatus === "Aprobado"),
    "Terminado": filteredTransactions.filter(transaction => transaction.displayStatus === "Terminado"),
    "Rechazado": filteredTransactions.filter(transaction => transaction.displayStatus === "Rechazado"),
  };

  const handleAddSale = async (formData: FormData) => {
    try {
      console.log('Creating new sale with file:', formData);
      // TODO: Implement API call to create transaction
      const result = await addTransaction(formData);
      console.log('Sale created successfully:', result);
      setIsAddSaleOpen(false);
      await refreshTransactions();
    } catch (error) {
      console.error('Error creating sale:', error);
      alert('Error al crear la venta');
    }
  };

  // Handler for completing transaction info
  const handleCompleteTransaction = async (
    flightInfo: FlightInfo,
    hotelInfo: HotelInfo
  ) => {
    try {
      if (!selectedTransactionId) {
        toast.error("No hay transacción seleccionada para completar.");
        return;
      }
      await updateTransactionWithFlightHotel(selectedTransactionId, flightInfo, hotelInfo);
      toast.success("Venta completada exitosamente");
      setIsCompleteInfoOpen(false);
      setSelectedTransactionId(null);
      await refreshTransactions();
    } catch (error) {
      toast.error("Error al completar la venta");
      console.error(error);
    }
  };

  // Handler to open modal when completing info
  const openCompleteInfo = (transactionId: number) => {
    setSelectedTransactionId(transactionId);
    setIsCompleteInfoOpen(true);
  };

  // Handle dropping a transaction card to a new status column
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: "Pendiente" | "Aprobado" | "Rechazado"| "Terminado") => {
    e.preventDefault();
    const transactionId = e.dataTransfer.getData("text/plain");
    console.log(`Moving transaction ${transactionId} to ${targetStatus}`);
    // TODO: Implement API call to update transaction status
  };

  // Allow dropping
  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Start drag
  const startDrag = (e: React.DragEvent<HTMLDivElement>, transactionId: string) => {
    e.dataTransfer.setData("text/plain", transactionId);
  };

  // Role-specific dashboard components
  const RoleSpecificDashboard = () => {
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

  // If user is a manager, show only the specialized manager dashboard
  if (isManager) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <RoleSpecificDashboard />
        </div>
      </AppLayout>
    );
  }

  // If user is an admin, show only the admin dashboard
  if (isAdmin) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <RoleSpecificDashboard />
        </div>
      </AppLayout>
    );
  }

  // Regular dashboard for sellers
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Role-specific dashboard section */}
        <RoleSpecificDashboard />

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${filteredTransactions
                  .filter(t => t.displayStatus === "Aprobado" || t.displayStatus === "Terminado")
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </div>
              <div className="text-xs text-green-600 flex items-center mt-1">
                <span className="mr-1">+6.32%</span> vs last week
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredTransactions.length}</div>
              <div className="text-xs text-green-600 flex items-center mt-1">
                <span className="mr-1">+3.54%</span> vs last month
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Completed Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredTransactions.filter(t => t.displayStatus === "Terminado").length}
              </div>
              <div className="text-xs text-green-600 flex items-center mt-1">
                <span className="mr-1">+8.12%</span> vs last week
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Management */}
        <Card className="stats-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Gestión de Ventas</CardTitle>
              <Button onClick={() => setIsAddSaleOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-1" /> Agregar Venta
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="kanban">
              <TabsList className="mb-4">
                <TabsTrigger value="kanban">Vista Kanban</TabsTrigger>
                <TabsTrigger value="list">Vista Lista</TabsTrigger>
              </TabsList>

              <TabsContent value="kanban">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Pending Column */}
                  <div
                    className="kanban-column border-t-4 border-blue-400"
                    onDrop={(e) => handleDrop(e, "Pendiente")}
                    onDragOver={allowDrop}
                  >
                    <div className="flex items-center mb-4">
                      <Clock className="h-5 w-5 mr-2 text-blue-500" />
                      <h3 className="font-semibold">Pendientes</h3>
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {kanbanGroups["Pendiente"].length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {kanbanGroups["Pendiente"].map((transaction) => (
                        <div
                          key={transaction.id}
                          draggable
                          onDragStart={(e) => startDrag(e, transaction.id.toString())}
                          className="kanban-card border-l-blue-400"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                                {transaction.client_name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-medium">{transaction.client_name}</h4>
                                <span className="text-xs text-gray-500">Vendedor: {transaction.seller_name}</span>
                              </div>
                            </div>
                            <span className="text-sm font-semibold">${transaction.amount}</span>
                          </div>

                          <div className="mt-3">
                            <p className="text-sm">{transaction.package}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">
                                {new Date(transaction.start_date).toLocaleDateString()}
                              </span>
                              <span className="status-badge status-process">Pendiente</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Approved Column */}
                  <div
                    className="kanban-column border-t-4 border-yellow-400"
                    onDrop={(e) => handleDrop(e, "Aprobado")}
                    onDragOver={allowDrop}
                  >
                    <div className="flex items-center mb-4">
                      <Check className="h-5 w-5 mr-2 text-yellow-500" />
                      <h3 className="font-semibold">Aprobadas</h3>
                      <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {kanbanGroups["Aprobado"].length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {kanbanGroups["Aprobado"].map((transaction) => (
                        <div
                          key={transaction.id}
                          draggable
                          onDragStart={(e) => startDrag(e, transaction.id.toString())}
                          className="kanban-card border-l-yellow-400"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-2">
                                {transaction.client_name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-medium">{transaction.client_name}</h4>
                                <span className="text-xs text-gray-500">Vendedor: {transaction.seller_name}</span>
                              </div>
                            </div>
                            <span className="text-sm font-semibold">${transaction.amount}</span>
                          </div>

                          <div className="mt-3">
                            <p className="text-sm">{transaction.package}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">
                                {new Date(transaction.start_date).toLocaleDateString()}
                              </span>
                              <span className="status-badge bg-yellow-100 text-yellow-800">Aprobado</span>
                            </div>
                            {isSeller && transaction.seller_id === user?.id && (
                              <Button
                                size="sm"
                                className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                                onClick={() => openCompleteInfo(transaction.id)}
                              >
                                Completar Información
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terminado Column */}
                  <div
                    className="kanban-column border-t-4 border-green-400"
                    onDrop={(e) => handleDrop(e, "Terminado")}
                    onDragOver={allowDrop}
                  >
                    <div className="flex items-center mb-4">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <h3 className="font-semibold">Completadas</h3>
                      <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {kanbanGroups["Terminado"].length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {kanbanGroups["Terminado"].map((transaction) => (
                        <div
                          key={transaction.id}
                          draggable
                          onDragStart={(e) => startDrag(e, transaction.id.toString())}
                          className="kanban-card border-l-green-400"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">
                                {transaction.client_name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-medium">{transaction.client_name}</h4>
                                <span className="text-xs text-gray-500">Vendedor: {transaction.seller_name}</span>
                              </div>
                            </div>
                            <span className="text-sm font-semibold">${transaction.amount}</span>
                          </div>

                          <div className="mt-3">
                            <p className="text-sm">{transaction.package}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">
                                {new Date(transaction.start_date).toLocaleDateString()}
                              </span>
                              <span className="status-badge status-success">Terminado</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rejected Column */}
                  <div
                    className="kanban-column border-t-4 border-red-400"
                    onDrop={(e) => handleDrop(e, "Rechazado")}
                    onDragOver={allowDrop}
                  >
                    <div className="flex items-center mb-4">
                      <X className="h-5 w-5 mr-2 text-red-500" />
                      <h3 className="font-semibold">Rechazadas</h3>
                      <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {kanbanGroups["Rechazado"].length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {kanbanGroups["Rechazado"].map((transaction) => (
                        <div
                          key={transaction.id}
                          draggable
                          onDragStart={(e) => startDrag(e, transaction.id.toString())}
                          className="kanban-card border-l-red-400"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2">
                                {transaction.client_name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-medium">{transaction.client_name}</h4>
                                <span className="text-xs text-gray-500">Vendedor: {transaction.seller_name}</span>
                              </div>
                            </div>
                            <span className="text-sm font-semibold">${transaction.amount}</span>
                          </div>

                          <div className="mt-3">
                            <p className="text-sm">{transaction.package}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">
                                {new Date(transaction.start_date).toLocaleDateString()}
                              </span>
                              <span className="status-badge status-canceled">Rechazado</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="list">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paquete</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {transaction.client_name.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{transaction.client_name}</div>
                                <div className="text-sm text-gray-500">Vendedor: {transaction.seller_name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{transaction.package}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(transaction.start_date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`status-badge ${transaction.displayStatus === "Aprobado"
                                ? "status-success"
                                : transaction.displayStatus === "Pendiente"
                                  ? "status-process"
                                  : "status-canceled"
                              }`}>
                              {transaction.displayStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            ${transaction.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Add Sale Dialog */}
      <Dialog open={isAddSaleOpen} onOpenChange={setIsAddSaleOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Venta</DialogTitle>
            <DialogDescription>
              Completa todos los datos para crear una nueva venta con carga de documentos.
            </DialogDescription>
          </DialogHeader>

          <EnhancedSalesForm
            onSubmit={handleAddSale}
            onCancel={() => setIsAddSaleOpen(false)}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

      {/* Complete Transaction Info Dialog */}
      <Dialog open={isCompleteInfoOpen} onOpenChange={setIsCompleteInfoOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Completar Información de la Venta</DialogTitle>
            <DialogDescription>
              Agrega la información de vuelo y hotel para completar la transacción.
            </DialogDescription>
          </DialogHeader>

          <FlightHotelForm
            onSubmit={handleCompleteTransaction}
            onCancel={() => setIsCompleteInfoOpen(false)}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Home;
