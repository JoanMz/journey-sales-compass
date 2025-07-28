import { useAuth } from "../contexts/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge, Plus, X } from "lucide-react";
import EnhancedSalesForm from "../components/forms/EnhancedSalesForm";
import FlightHotelForm from "../components/forms/FlightHotelForm";
import { FlightInfo, HotelInfo } from "../types/sales";
import { useTransactions } from "../hooks/useTransactions";
import { useDialogs } from "../hooks/useDialogs";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import {
  StatsCards,
  KanbanView,
  ListView,
  RoleSpecificDashboard,
} from "../components/home";
import endpoints from "@/lib/endpoints";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { mapStatusToStyle } from "@/components/dashboard/TransaccionesClientes";

const Home = () => {
  const { isAdmin, isManager } = useAuth();

  // Custom hooks
  const {
    filteredTransactions,
    kanbanGroups,
    loading,
    handleAddSale,
    handleCompleteTransaction,
  } = useTransactions();

  const {
    isAddSaleOpen,
    openAddSale,
    closeAddSale,
    isCompleteInfoOpen,
    selectedTransactionId,
    openCompleteInfo,
    closeCompleteInfo,
  } = useDialogs();

  const { handleDrop, allowDrop, startDrag } = useDragAndDrop();

  // Enhanced handlers
  const handleAddSaleWrapper = async (formData: FormData) => {
    try {
      await handleAddSale(formData);
      closeAddSale();
    } catch (error) {
      alert("Error al crear la venta");
    }
  };

  const handleCompleteTransactionWrapper = async (
    flightInfo: FlightInfo,
    hotelInfo: HotelInfo
  ) => {
    if (!selectedTransactionId) return;

    try {
      await handleCompleteTransaction(
        selectedTransactionId,
        flightInfo,
        hotelInfo
      );
      closeCompleteInfo();
    } catch (error) {
      // Error is already handled in the hook
    }
  };

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

  const [loadingTransaction, setLoadingTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const viewTransaction = async (transactionId: string) => {
    setLoadingTransaction(true);
    try {
      const response = await fetch(
        endpoints.transactions.getById(transactionId)
      );
      if (!response.ok) {
        throw new Error("Error al cargar los datos de la transacción");
      }
      const data = await response.json();
      setSelectedTransaction(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      alert("Error al cargar los datos de la transacción");
    } finally {
      setLoadingTransaction(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };



  const generateInvoice = async (transactionId: string) => {
    try {
      const response = await fetch(endpoints.transactions.generateInvoice, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_id: transactionId
        })
      });
      console.log(response, "response");

      // El response contiene un objeto con la propiedad "data" que es un string base64 de un PDF.
      // Necesitamos abrir ese PDF en una nueva pestaña usando un Blob.

      if (!response.ok) {
        throw new Error("Error al generar la factura");
      }
      const result = await response.json();
      // result.data es el string base64 del PDF

      // Convertir base64 a un array de bytes
      function base64ToUint8Array(base64) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      }

      const pdfBytes = base64ToUint8Array(result.data);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      // Abrir el PDF en una nueva pestaña
      window.open(blobUrl, "_blank");
      // if (!response.ok) {
      //   throw new Error("Error al generar la factura");
      // }
    } catch (error) {
      console.error("Error al generar la factura:", error);
      alert("Error al generar la factura");
    }
  };
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
              <Button
                onClick={openAddSale}
                className="bg-blue-600 hover:bg-blue-700"
              >
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
                  viewTransaction={viewTransaction}
                  loadingTransaction={loadingTransaction}
                  kanbanGroups={kanbanGroups}
                  onDrop={handleDrop}
                  allowDrop={allowDrop}
                  startDrag={startDrag}
                  onCompleteInfo={openCompleteInfo}
                  generateInvoice={generateInvoice}
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
              Completa todos los datos para crear una nueva venta con carga de
              documentos.
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
              Agrega la información de vuelo y hotel para completar la
              transacción.
            </DialogDescription>
          </DialogHeader>

          <FlightHotelForm
            onSubmit={handleCompleteTransactionWrapper}
            onCancel={closeCompleteInfo}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

       {/* Modal para mostrar detalles de la transacción */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Detalles de la Transacción</h2>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {selectedTransaction && (
              <div className="space-y-6">
                {/* Información del Cliente */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">
                    Información del Cliente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nombre</p>
                      <p className="font-medium">
                        {selectedTransaction.client_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">
                        {selectedTransaction.client_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <p className="font-medium">
                        {selectedTransaction.client_phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">DNI</p>
                      <p className="font-medium">
                        {selectedTransaction.client_dni}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Dirección</p>
                      <p className="font-medium">
                        {selectedTransaction.client_address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información del Paquete */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">
                    Información del Paquete
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Paquete</p>
                      <p className="font-medium">
                        {selectedTransaction.package}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Tipo de Transacción
                      </p>
                      <p className="font-medium capitalize">
                        {selectedTransaction.transaction_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estado</p>
                      <Badge
                        className={mapStatusToStyle(selectedTransaction.status.toLowerCase())}
                      >
                        {selectedTransaction.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vendedor</p>
                      <p className="font-medium">
                        {selectedTransaction.seller_name}
                      </p>
                    </div>
                    {selectedTransaction.quoted_flight && (
                      <div>
                        <p className="text-sm text-gray-600">Vuelo Cotizado</p>
                        <p className="font-medium">
                          {selectedTransaction.quoted_flight}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Costo de Agencia</p>
                      <p className="font-medium">
                        {formatCurrency(selectedTransaction.agency_cost)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monto Total</p>
                      <p className="font-medium">
                        {formatCurrency(selectedTransaction.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fecha de Inicio</p>
                      <p className="font-medium">
                        {new Date(
                          selectedTransaction.start_date
                        ).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fecha de Fin</p>
                      <p className="font-medium">
                        {new Date(
                          selectedTransaction.end_date
                        ).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Viajeros */}
                {selectedTransaction.travelers &&
                  selectedTransaction.travelers.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">
                        Viajeros ({selectedTransaction.travelers.length})
                      </h3>
                      <div className="space-y-3">
                        {selectedTransaction.travelers.map(
                          (traveler: any, index: number) => (
                            <div
                              key={traveler.id}
                              className="border-b border-gray-200 pb-3 last:border-b-0"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Nombre
                                  </p>
                                  <p className="font-medium">{traveler.name}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">DNI</p>
                                  <p className="font-medium">{traveler.dni}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Teléfono
                                  </p>
                                  <p className="font-medium">
                                    {traveler.phone || "No especificado"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Fecha de Nacimiento
                                  </p>
                                  <p className="font-medium">
                                    {new Date(
                                      traveler.date_birth
                                    ).toLocaleDateString("es-ES")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                {/* Documentos */}
                {selectedTransaction.documentos &&
                  selectedTransaction.documentos.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">
                        Documentos ({selectedTransaction.documentos.length})
                      </h3>
                      <div className="space-y-3">
                        {selectedTransaction.documentos.map(
                          (documento: any, index: number) => (
                            <div
                              key={documento.id}
                              className="border-b border-gray-200 pb-3 last:border-b-0"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Tipo de Documento
                                  </p>
                                  <p className="font-medium capitalize">
                                    {documento.tipo_documento}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    ID Viajero
                                  </p>
                                  <p className="font-medium">
                                    {documento.viajero_id}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Documento
                                  </p>
                                  {documento.document_url ? (
                                    <a
                                      href={documento.document_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                      Ver documento
                                    </a>
                                  ) : (
                                    <p className="text-gray-500">
                                      No disponible
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Itinerario */}
                {selectedTransaction.itinerario &&
                  selectedTransaction.itinerario.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">Itinerario</h3>
                      <div className="space-y-3">
                        {selectedTransaction.itinerario.map(
                          (itinerary: any, index: number) => (
                            <div
                              key={itinerary.id}
                              className="border-b border-gray-200 pb-3 last:border-b-0"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Aerolínea
                                  </p>
                                  <p className="font-medium capitalize">
                                    {itinerary.aerolinea}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Ruta</p>
                                  <p className="font-medium">
                                    {itinerary.ruta}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Hora de Salida
                                  </p>
                                  <p className="font-medium">
                                    {itinerary.hora_salida || "No especificado"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Hora de Llegada
                                  </p>
                                  <p className="font-medium">
                                    {itinerary.hora_llegada || "No especificado"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Información de Viaje */}
                {selectedTransaction.travel_info &&
                  selectedTransaction.travel_info.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">
                        Información de Viaje
                      </h3>
                      <div className="space-y-3">
                        {selectedTransaction.travel_info.map(
                          (travelInfo: any, index: number) => (
                            <div
                              key={travelInfo.id}
                              className="border-b border-gray-200 pb-3 last:border-b-0"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-600">Hotel</p>
                                  <p className="font-medium">
                                    {travelInfo.hotel}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Noches
                                  </p>
                                  <p className="font-medium">
                                    {travelInfo.noches || "No especificado"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Incluye
                                  </p>
                                  <div className="font-medium">
                                    {travelInfo.incluye && Array.isArray(travelInfo.incluye) ? (
                                      <ul className="list-disc list-inside">
                                        {travelInfo.incluye.map((item: string, idx: number) => (
                                          <li key={idx} className="text-sm">{item}</li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p>{travelInfo.incluye || "No especificado"}</p>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    No Incluye
                                  </p>
                                  <div className="font-medium">
                                    {travelInfo.no_incluye && Array.isArray(travelInfo.no_incluye) ? (
                                      <ul className="list-disc list-inside">
                                        {travelInfo.no_incluye.map((item: string, idx: number) => (
                                          <li key={idx} className="text-sm">{item}</li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p>{travelInfo.no_incluye || "No especificado"}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Evidencia */}
                {selectedTransaction.evidence &&
                  selectedTransaction.evidence.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">Evidencia</h3>
                      <div className="space-y-3">
                        {selectedTransaction.evidence.map(
                          (evidence: any, index: number) => (
                            <div
                              key={evidence.id}
                              className="border-b border-gray-200 pb-3 last:border-b-0"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-600">Monto</p>
                                  <p className="font-medium">
                                    {formatCurrency(evidence.amount)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Fecha de Subida
                                  </p>
                                  <p className="font-medium">
                                    {new Date(
                                      evidence.upload_date
                                    ).toLocaleDateString("es-ES")}
                                  </p>
                                </div>
                                {evidence.evidence_file ? (
                                  <div className="md:col-span-2">
                                    <p className="text-sm text-gray-600">
                                      Archivo
                                    </p>
                                    <img
                                      src={evidence.evidence_file}
                                      alt="Evidencia"
                                      className="max-w-xs h-auto rounded border"
                                    />
                                  </div>
                                ) : (
                                  <div className="md:col-span-2">
                                    <p className="text-sm text-gray-600">
                                      No hay archivo adjunto
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Fechas */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Fechas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Fecha de Creación</p>
                      <p className="font-medium">
                        {new Date(
                          selectedTransaction.created_at
                        ).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Última Actualización
                      </p>
                      <p className="font-medium">
                        {selectedTransaction.updated_at
                          ? new Date(
                              selectedTransaction.updated_at
                            ).toLocaleDateString("es-ES")
                          : "No actualizado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Home;
