import { useAuth } from "../contexts/AuthContext";
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
import { Plus } from "lucide-react";
import EnhancedSalesForm from "../components/forms/EnhancedSalesForm";
import FlightHotelForm from "../components/forms/FlightHotelForm";
import { FlightInfo, HotelInfo } from "../types/sales";
import { useTransactions } from "../hooks/useTransactions";
import { useDialogs } from "../hooks/useDialogs";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { StatsCards, KanbanView, ListView, RoleSpecificDashboard } from "../components/home";

const Home = () => {
  const { isAdmin, isManager } = useAuth();
  
  // Custom hooks
  const { 
    filteredTransactions, 
    kanbanGroups, 
    loading, 
    handleAddSale, 
    handleCompleteTransaction 
  } = useTransactions();
  
  const {
    isAddSaleOpen,
    openAddSale,
    closeAddSale,
    isCompleteInfoOpen,
    selectedTransactionId,
    openCompleteInfo,
    closeCompleteInfo
  } = useDialogs();
  
  const { handleDrop, allowDrop, startDrag } = useDragAndDrop();

  // Enhanced handlers
  const handleAddSaleWrapper = async (formData: FormData) => {
    try {
      await handleAddSale(formData);
      closeAddSale();
    } catch (error) {
      alert('Error al crear la venta');
    }
  };

  const handleCompleteTransactionWrapper = async (
    flightInfo: FlightInfo,
    hotelInfo: HotelInfo
  ) => {
    if (!selectedTransactionId) return;
    
    try {
      await handleCompleteTransaction(selectedTransactionId, flightInfo, hotelInfo);
      closeCompleteInfo();
    } catch (error) {
      // Error is already handled in the hook
    }
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
        <StatsCards transactions={filteredTransactions} />

        {/* Sales Management */}
        <Card className="stats-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Gestión de Ventas</CardTitle>
              <Button onClick={openAddSale} className="bg-blue-600 hover:bg-blue-700">
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
                <KanbanView
                  kanbanGroups={kanbanGroups}
                  onDrop={handleDrop}
                  allowDrop={allowDrop}
                  startDrag={startDrag}
                  onCompleteInfo={openCompleteInfo}
                />
              </TabsContent>

              <TabsContent value="list">
                <ListView transactions={filteredTransactions} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Add Sale Dialog */}
      <Dialog open={isAddSaleOpen} onOpenChange={closeAddSale}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Venta</DialogTitle>
            <DialogDescription>
              Completa todos los datos para crear una nueva venta con carga de documentos.
            </DialogDescription>
          </DialogHeader>

          <EnhancedSalesForm
            onSubmit={handleAddSaleWrapper}
            onCancel={closeAddSale}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

      {/* Complete Transaction Info Dialog */}
      <Dialog open={isCompleteInfoOpen} onOpenChange={closeCompleteInfo}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Completar Información de la Venta</DialogTitle>
            <DialogDescription>
              Agrega la información de vuelo y hotel para completar la transacción.
            </DialogDescription>
          </DialogHeader>

          <FlightHotelForm
            onSubmit={handleCompleteTransactionWrapper}
            onCancel={closeCompleteInfo}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Home;
