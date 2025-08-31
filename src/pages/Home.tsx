import { useAuth } from "../contexts/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
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
import { Badge, Plus, X, Download, Edit, Check } from "lucide-react";
import EnhancedSalesForm from "../components/forms/EnhancedSalesForm";
import FlightHotelForm from "../components/forms/FlightHotelForm";
import CompleteTransactionForm from "../components/forms/CompleteTransactionForm";
import InvoiceForm from "../components/forms/InvoiceForm";
import AbonoForm from "../components/forms/AbonoForm";
import EvidenceForm from "../components/forms/EvidenceForm";
import { ContractConfirmationModal } from "../components/forms/ContractConfirmationModal";
import { FlightInfo, HotelInfo } from "../types/sales";
import { useTransactions } from "../hooks/useTransactions";
import { useDialogs } from "../hooks/useDialogs";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import {
  StatsCards,
  KanbanView,
  ListView,
  RoleSpecificDashboard,
  ApprovedSalesView,
} from "../components/home";
import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { mapStatusToStyle } from "@/components/dashboard/TransaccionesClientes";
import { endpoints } from '@/lib/endpoints';
import { toast } from "sonner";

const Home = () => {
  const { isAdmin, isManager } = useAuth();

  // Custom hooks
  const {
    filteredTransactions,
    kanbanGroups,
    loading,
    handleAddSale,
    handleCompleteTransaction,
    refreshTransactions,
  } = useTransactions();

  const {
    isAddSaleOpen,
    openAddSale,
    closeAddSale,
    isCompleteInfoOpen,
    selectedTransactionId,
    openCompleteInfo: originalOpenCompleteInfo,
    closeCompleteInfo,
  } = useDialogs();

  const openCompleteInfo = async (transactionId: number) => {
    try {
      // Buscar la transacción en las transacciones filtradas
      const transaction = filteredTransactions.find(t => t.id === transactionId);
      if (transaction) {

        setSelectedTransactionData(transaction);
        originalOpenCompleteInfo(transactionId);
        

      } else {
        console.error("Transaction not found:", transactionId);
      }
    } catch (error) {
      console.error("Error opening complete info:", error);
    }
  };

  const closeCompleteInfoSafely = () => {
    // Limpiar todos los estados relacionados
    setSelectedTransactionData(null);
    closeCompleteInfo();
  };

  // Estados para el formulario de factura
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [selectedInvoiceTransactionId, setSelectedInvoiceTransactionId] = useState<string | null>(null);
  
  // Estados para el formulario de abono
  const [isAbonoFormOpen, setIsAbonoFormOpen] = useState(false);
  const [selectedAbonoTransactionId, setSelectedAbonoTransactionId] = useState<string | null>(null);
  const [loadingAbono, setLoadingAbono] = useState(false);
  
  // Estados para el formulario de evidencia
  const [isEvidenceFormOpen, setIsEvidenceFormOpen] = useState(false);
  const [selectedEvidenceTransactionId, setSelectedEvidenceTransactionId] = useState<string | null>(null);
  const [loadingEvidence, setLoadingEvidence] = useState(false);
  const refreshPendingEvidenceRef = React.useRef<() => Promise<void>>();

  // Estados para la vista de ventas aprobadas
  const [currentView, setCurrentView] = useState<'sales' | 'approved'>('sales');

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
  const [selectedTransactionData, setSelectedTransactionData] = useState<any | null>(null);

  const [isContractMode, setIsContractMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState<any>(null);

  const viewTransaction = async (transactionId: string, isForContract: boolean = false) => {

    
    setIsContractMode(isForContract);
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
    setIsEditing(false);
    setEditedTransaction(null);
    setIsContractMode(false);
  };

  const handleEdit = () => {

    setIsEditing(true);
    setEditedTransaction({ ...selectedTransaction });
  };

  const handleCancelEdit = () => {

    setIsEditing(false);
    setEditedTransaction(null);
  };

  const updateField = (field: string, value: any) => {
    setEditedTransaction(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateFlightField = (field: string, value: string) => {
    setEditedTransaction(prev => ({
      ...prev,
      itinerario: [{
        ...(prev.itinerario?.[0] || {}),
        [field]: value
      }]
    }));
  };

  const updateHotelField = (field: string, value: any) => {
    setEditedTransaction(prev => ({
      ...prev,
      travel_info: [{
        ...(prev.travel_info?.[0] || {}),
        [field]: value
      }]
    }));
  };

  const handleSave = async () => {

    if (!editedTransaction) return;

    try {
      // Crear una copia limpia de los datos para actualizar
      const updatePayload = {
        client_name: editedTransaction.client_name,
        client_email: editedTransaction.client_email,
        client_phone: editedTransaction.client_phone,
        client_dni: editedTransaction.client_dni,
        client_address: editedTransaction.client_address,
        package: editedTransaction.package,
        amount: editedTransaction.amount,
        updated_at: new Date().toISOString()
      };


      const response = await fetch(endpoints.transactions.getById(editedTransaction.id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error en PATCH principal:', response.status, errorData);
        throw new Error(`Error ${response.status}: ${errorData}`);
      }



      // Actualizar itinerario si existe y cambió
      if (editedTransaction.itinerario && editedTransaction.itinerario.length > 0) {
        const itinerario = editedTransaction.itinerario[0];

        
        if (selectedTransaction.itinerario && selectedTransaction.itinerario.length > 0 && selectedTransaction.itinerario[0].id) {
          // Actualizar existente

          try {
            const itinerarioResponse = await fetch(
              `${endpoints.transactions.getById(editedTransaction.id)}/itinerario/${selectedTransaction.itinerario[0].id}`,
              {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(itinerario),
              }
            );
            
            if (itinerarioResponse.ok) {

            } else {
              console.warn('⚠️ Error actualizando itinerario:', itinerarioResponse.status);
            }
          } catch (error) {
            console.warn('⚠️ Error en actualización de itinerario:', error);
          }
        } else {
          // Crear nuevo
          
          try {
            const itinerarioResponse = await fetch(
              `${endpoints.transactions.getById(editedTransaction.id)}/itinerario`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(itinerario),
              }
            );
            
            if (itinerarioResponse.ok) {

            } else {
              console.warn('⚠️ Error creando itinerario:', itinerarioResponse.status);
            }
          } catch (error) {
            console.warn('⚠️ Error en creación de itinerario:', error);
          }
        }
      }

      // Actualizar travel_info si existe y cambió
      if (editedTransaction.travel_info && editedTransaction.travel_info.length > 0) {
        const travelInfo = editedTransaction.travel_info[0];
        console.log('📤 Datos del travel_info a actualizar:', travelInfo);
        
        if (selectedTransaction.travel_info && selectedTransaction.travel_info.length > 0 && selectedTransaction.travel_info[0].id) {
          // Actualizar existente
          console.log('📤 Actualizando travel_info existente con ID:', selectedTransaction.travel_info[0].id);
          try {
            const travelInfoResponse = await fetch(
              `${endpoints.transactions.getById(editedTransaction.id)}/travel_info/${selectedTransaction.travel_info[0].id}`,
              {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(travelInfo),
              }
            );
            
            if (travelInfoResponse.ok) {
              console.log('✅ Travel info actualizado correctamente');
            } else {
              console.warn('⚠️ Error actualizando travel_info:', travelInfoResponse.status);
            }
          } catch (error) {
            console.warn('⚠️ Error en actualización de travel_info:', error);
          }
        } else {
          // Crear nuevo
          console.log('📤 Creando nuevo travel_info');
          try {
            const travelInfoResponse = await fetch(
              `${endpoints.transactions.getById(editedTransaction.id)}/travel_info`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(travelInfo),
              }
            );
            
            if (travelInfoResponse.ok) {
              console.log('✅ Nuevo travel_info creado correctamente');
            } else {
              console.warn('⚠️ Error creando travel_info:', travelInfoResponse.status);
            }
          } catch (error) {
            console.warn('⚠️ Error en creación de travel_info:', error);
          }
        }
      }

      // Recargar datos actualizados
      await viewTransaction(editedTransaction.id.toString(), isContractMode);
      setIsEditing(false);
      setEditedTransaction(null);
      alert('Información actualizada correctamente');
    } catch (error) {
      console.error('❌ Error actualizando transacción:', error);
      alert(`Error al actualizar la información: ${error.message}`);
    }
  };



  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [selectedContractTransactionId, setSelectedContractTransactionId] = useState<string>('');

  const openContractConfirmation = (transactionId: string) => {
    console.log('🔍 openContractConfirmation llamado');
    console.log('📋 transactionId:', transactionId);
    setSelectedContractTransactionId(transactionId);
    setContractModalOpen(true);
    console.log('✅ Modal abierto');
  };

  const closeContractConfirmation = () => {
    console.log('🔍 closeContractConfirmation llamado');
    setContractModalOpen(false);
    setSelectedContractTransactionId('');
    console.log('✅ Modal cerrado');
  };

  const generateContract = async (transactionId: string) => {
    console.log('🔍 generateContract llamado');
    console.log('📋 transactionId:', transactionId);
    console.log('📋 endpoint:', endpoints.transactions.generateInvoice);
    
    try {
      console.log('📤 Enviando request al webhook...');
      const response = await fetch(endpoints.transactions.generateInvoice, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_id: transactionId
        })
      });
      console.log('📥 Response recibido:', response);
      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      // El response contiene un objeto con la propiedad "data" que es un string base64 de un PDF.
      // Necesitamos abrir ese PDF en una nueva pestaña usando un Blob.

      if (!response.ok) {
        console.error('❌ Response no ok:', response.status, response.statusText);
        throw new Error("Error al generar el contrato");
      }
      
      console.log('📥 Parseando JSON...');
      const result = await response.json();
      console.log('📥 Result:', result);
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

      console.log('📥 Convirtiendo base64 a PDF...');
      const pdfBytes = base64ToUint8Array(result.data);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      console.log('📥 Abriendo PDF en nueva pestaña...');
      // Abrir el PDF en una nueva pestaña
      window.open(blobUrl, "_blank");
      console.log('✅ PDF abierto exitosamente');
    } catch (error) {
      console.error("❌ Error al generar el contrato:", error);
      alert("Error al generar el contrato");
      throw error;
    }
  };

  // Funciones para manejar el formulario de factura
  const openInvoiceForm = (transactionId: string) => {
    console.log('🔍 openInvoiceForm llamado');
    console.log('📋 transactionId:', transactionId);
    setSelectedInvoiceTransactionId(transactionId);
    setIsInvoiceFormOpen(true);
    console.log('✅ Modal de factura abierto');
  };

  // Funciones para manejar abonos
  const openAbonoForm = (transactionId: string) => {
    console.log('🔍 openAbonoForm llamado');
    console.log('📋 transactionId:', transactionId);
    setSelectedEvidenceTransactionId(transactionId);
    setIsEvidenceFormOpen(true);
    console.log('✅ Modal de evidencia abierto');
  };

  const closeAbonoForm = () => {
    console.log('🔍 closeAbonoForm llamado');
    setIsAbonoFormOpen(false);
    setSelectedAbonoTransactionId(null);
    console.log('✅ Modal de abono cerrado');
  };

  const closeEvidenceForm = () => {
    console.log('🔍 closeEvidenceForm llamado');
    setIsEvidenceFormOpen(false);
    setSelectedEvidenceTransactionId(null);
    console.log('✅ Modal de evidencia cerrado');
  };

  const handleAddEvidence = async (evidenceData: any) => {
    console.log('🔍 handleAddEvidence llamado');
    console.log('📋 evidenceData:', evidenceData);
    console.log('📋 transactionId:', selectedEvidenceTransactionId);
    
    setLoadingEvidence(true);
    
    try {
      const response = await fetch(endpoints.transactions.addEvidence(selectedEvidenceTransactionId!), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evidenceData)
      });

      if (!response.ok) {
        console.error('❌ Response no ok:', response.status, response.statusText);
        throw new Error("Error al agregar la evidencia");
      }
      const result = await response.json();
      console.log('📥 Result:', result);
      toast.success('Evidencia agregada exitosamente');
      
      closeEvidenceForm();
      
      // Refrescar las transacciones para mostrar los cambios
      await refreshTransactions();
      
      // Refrescar la lista de evidencias pendientes
      if (refreshPendingEvidenceRef.current) {
        await refreshPendingEvidenceRef.current();
      }
      
    } catch (error) {
      console.error("❌ Error al agregar la evidencia:", error);
      toast.error("Error al agregar la evidencia");
    } finally {
      setLoadingEvidence(false);
    }
  };

  const handleAddAbono = async (abonoData: any) => {
    console.log('🔍 handleAddAbono llamado');
    console.log('📋 abonoData:', abonoData);
    console.log('📋 transactionId:', selectedAbonoTransactionId);
    
    setLoadingAbono(true);
    
    try {
      console.log('📤 Enviando datos de abono al endpoint...');
      const response = await fetch(endpoints.transactions.postNewAbono(selectedAbonoTransactionId!), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(abonoData)
      });
      
      console.log('📥 Response recibido:', response);
      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        console.error('❌ Response no ok:', response.status, response.statusText);
        throw new Error("Error al agregar el abono");
      }
      
      console.log('📥 Parseando JSON...');
      const result = await response.json();
      console.log('📥 Result:', result);

      console.log('✅ Abono agregado exitosamente');
      toast.success('Abono agregado exitosamente');
      
      closeAbonoForm();
      
      // Refrescar las transacciones para mostrar los cambios
      await refreshTransactions();
      
    } catch (error) {
      console.error("❌ Error al agregar el abono:", error);
      toast.error("Error al agregar el abono");
    } finally {
      setLoadingAbono(false);
    }
  };

  const closeInvoiceForm = () => {
    console.log('🔍 closeInvoiceForm llamado');
    setIsInvoiceFormOpen(false);
    setSelectedInvoiceTransactionId(null);
    console.log('✅ Modal de factura cerrado');
  };

  const handleGenerateInvoice = async (invoiceData: any) => {
    console.log('🔍 handleGenerateInvoice llamado');
    console.log('📋 invoiceData:', invoiceData);
    console.log('📋 transactionId:', selectedInvoiceTransactionId);
    
    try {
      console.log('📤 Enviando datos de factura al webhook...');
      const response = await fetch('https://elder-link-staging-n8n.fwoasm.easypanel.host/webhook/382a0ee7-7fcb-415f-a5a2-aaf8c94b5c4d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_id: selectedInvoiceTransactionId,
          ...invoiceData
        })
      });
      
      console.log('📥 Response recibido:', response);
      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        console.error('❌ Response no ok:', response.status, response.statusText);
        throw new Error("Error al generar la factura");
      }
      
      console.log('📥 Parseando JSON...');
      const result = await response.json();
      console.log('📥 Result:', result);

      // Convertir base64 a PDF si es necesario
      if (result.data) {
        function base64ToUint8Array(base64) {
          const binaryString = window.atob(base64);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return bytes;
        }

        console.log('📥 Convirtiendo base64 a PDF...');
        const pdfBytes = base64ToUint8Array(result.data);
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);

        console.log('📥 Abriendo PDF en nueva pestaña...');
        window.open(blobUrl, "_blank");
        console.log('✅ Factura generada y abierta exitosamente');
      } else {
        console.log('✅ Factura generada exitosamente');
        alert('Factura generada exitosamente');
      }
      
      closeInvoiceForm();
    } catch (error) {
      console.error("❌ Error al generar la factura:", error);
      alert("Error al generar la factura");
      throw error;
    }
  };

  // Funciones para manejar ventas aprobadas


  // Filtrar transacciones aprobadas
  const approvedTransactions = filteredTransactions.filter(t => t.displayStatus === "Aprobado");
  // Regular dashboard for sellers
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Role-specific dashboard section */}
        <RoleSpecificDashboard />

        {/* Stats cards */}
        <StatsCards transactions={filteredTransactions} />

        {/* View Toggle Buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => setCurrentView('sales')}
            variant={currentView === 'sales' ? 'default' : 'outline'}
            className="px-6 py-2"
          >
            Gestión de Ventas
          </Button>
          <Button
            onClick={() => setCurrentView('approved')}
            variant={currentView === 'approved' ? 'default' : 'outline'}
            className="px-6 py-2"
          >
            Ventas Aprobadas
          </Button>

        </div>

        {/* Sales Management */}
        {currentView === 'sales' && (
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
                  onDrop={() => {}} // Función vacía ya que no se usa
                  allowDrop={() => {}} // Función vacía ya que no se usa
                  startDrag={() => {}} // Función vacía ya que no se usa
                  onCompleteInfo={openCompleteInfo}
                  generateInvoice={openInvoiceForm}
                />
              </TabsContent>

              <TabsContent value="list">
                <ListView transactions={filteredTransactions} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        )}

        {/* Vista de Ventas Aprobadas */}
        {currentView === 'approved' && (
          <ApprovedSalesView
            approvedTransactions={approvedTransactions}
            viewTransaction={viewTransaction}
            loadingTransaction={loadingTransaction}
            addAbono={openAbonoForm}
            onRefreshPendingEvidence={(fn) => {
              refreshPendingEvidenceRef.current = fn;
            }}
          />
        )}


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
      <Dialog open={isCompleteInfoOpen} onOpenChange={closeCompleteInfoSafely}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Completar Información de la Venta</DialogTitle>
            <DialogDescription>
              Completa la información de vuelo y hotel según el tipo de paquete.
            </DialogDescription>
          </DialogHeader>

                    {selectedTransactionData && selectedTransactionId && selectedTransactionData.client_name && (
            <CompleteTransactionForm
              transactionId={selectedTransactionId.toString()}
              currentData={{
                customerName: selectedTransactionData.client_name,
                customerEmail: selectedTransactionData.client_email,
                customerPhone: selectedTransactionData.client_phone,
                customerDni: selectedTransactionData.client_dni,
                customerAddress: selectedTransactionData.client_address,
                package: selectedTransactionData.package,
                quotedFlight: selectedTransactionData.quoted_flight || "",
                agencyCost: selectedTransactionData.agency_cost,
                amount: selectedTransactionData.amount,
                paidAmount: selectedTransactionData.amount,
                documentType: "dni",
                transactionType: selectedTransactionData.transaction_type || "venta",
                startDate: selectedTransactionData.start_date,
                endDate: selectedTransactionData.end_date,
                incluye: selectedTransactionData.incluye || "",
                no_incluye: selectedTransactionData.no_incluye || "",
                travelers: selectedTransactionData.travelers || [],
                invoiceImage: undefined,
                flightInfo: (selectedTransactionData as any).itinerario && (selectedTransactionData as any).itinerario.length > 0 ? 
                  (selectedTransactionData as any).itinerario.map((flight: any) => ({
                    id: flight.id, // Preservar el ID para PATCH
                    aerolinea: flight.aerolinea || "",
                    ruta: flight.ruta || "",
                    fecha: flight.fecha || new Date().toISOString(),
                    hora_salida: flight.hora_salida || "",
                    hora_llegada: flight.hora_llegada || "",
                  })) : [{
                    aerolinea: "",
                    ruta: "",
                    fecha: new Date().toISOString(),
                    hora_salida: "",
                    hora_llegada: "",
                  }],
                hotelInfo: (selectedTransactionData as any).travel_info && (selectedTransactionData as any).travel_info.length > 0 ? 
                  (selectedTransactionData as any).travel_info.map((hotel: any) => {
                    console.log("🔍 Mapeando hotel del backend:", hotel);
                    console.log("🔍 Campos del hotel:", {
                      hotel: hotel.hotel,
                      alimentacion: hotel.alimentacion,
                      acomodacion: hotel.acomodacion,
                      direccion_hotel: hotel.direccion_hotel,
                      pais_destino: hotel.pais_destino,
                      ciudad_destino: hotel.ciudad_destino
                    });
                    
                    return {
                      id: hotel.id, // Preservar el ID para PATCH
                      hotel: hotel.hotel || "",
                      noches: hotel.noches || 1,
                      incluye: hotel.incluye || [],
                      no_incluye: hotel.no_incluye || [],
                      alimentacion: hotel.alimentacion || "",
                      acomodacion: hotel.acomodacion || "",
                      direccion_hotel: hotel.direccion_hotel || "",
                      pais_destino: hotel.pais_destino || "",
                      ciudad_destino: hotel.ciudad_destino || "",
                      cuentas_recaudo: {
                        banco: "",
                        numero: "",
                        nombre: "",
                        nit: "",
                      },
                    };
                  }) : [{
                    hotel: "",
                    noches: 1,
                    incluye: [],
                    no_incluye: [],
                    alimentacion: "",
                    acomodacion: "",
                    direccion_hotel: "",
                    pais_destino: "",
                    ciudad_destino: "",
                    cuentas_recaudo: {
                      banco: "",
                      numero: "",
                      nombre: "",
                      nit: "",
                    },
                  }],
              }}
              onComplete={() => {
                closeCompleteInfoSafely();
              }}
              onCancel={() => {
                closeCompleteInfoSafely();
              }}
            />
          )}

          {/* Contract Confirmation Modal */}
          {(() => {
            console.log('🔍 Renderizando modal - contractModalOpen:', contractModalOpen, 'selectedContractTransactionId:', selectedContractTransactionId);
            console.log('🔍 Condición 1 (contractModalOpen):', contractModalOpen);
            console.log('🔍 Condición 2 (selectedContractTransactionId):', selectedContractTransactionId);
            console.log('🔍 Condición 3 (ambas):', contractModalOpen && selectedContractTransactionId);
            return null;
          })()}
          {contractModalOpen && selectedContractTransactionId && (() => {
            console.log('🔍 ¡Renderizando ContractConfirmationModal!');
            return (
              <ContractConfirmationModal
                isOpen={contractModalOpen}
                onClose={closeContractConfirmation}
                transactionId={selectedContractTransactionId}
                onGenerateContract={generateContract}
              />
            );
          })()}
        </DialogContent>
      </Dialog>

       {/* Modal para mostrar detalles de la transacción */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Detalles de la Transacción</h2>
            <div className="flex gap-2">
              {isContractMode && !isEditing && (
                <Button onClick={handleEdit} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              )}
              {isEditing && (
                <>
                  <Button onClick={handleCancelEdit} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} variant="outline" size="sm">
                    <Check className="h-4 w-4 mr-1" />
                    Guardar
                  </Button>
                </>
              )}
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
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
                      <Label>Nombre</Label>
                      {isEditing ? (
                        <Input
                          value={editedTransaction?.client_name || ''}
                          onChange={(e) => updateField('client_name', e.target.value)}
                        />
                      ) : (
                      <p className="font-medium">
                        {selectedTransaction.client_name}
                      </p>
                      )}
                    </div>
                    <div>
                      <Label>Email</Label>
                      {isEditing ? (
                        <Input
                          value={editedTransaction?.client_email || ''}
                          onChange={(e) => updateField('client_email', e.target.value)}
                        />
                      ) : (
                      <p className="font-medium">
                        {selectedTransaction.client_email}
                      </p>
                      )}
                    </div>
                    <div>
                      <Label>Teléfono</Label>
                      {isEditing ? (
                        <Input
                          value={editedTransaction?.client_phone || ''}
                          onChange={(e) => updateField('client_phone', e.target.value)}
                        />
                      ) : (
                      <p className="font-medium">
                        {selectedTransaction.client_phone}
                      </p>
                      )}
                    </div>
                    <div>
                      <Label>DNI</Label>
                      {isEditing ? (
                        <Input
                          value={editedTransaction?.client_dni || ''}
                          onChange={(e) => updateField('client_dni', e.target.value)}
                        />
                      ) : (
                      <p className="font-medium">
                        {selectedTransaction.client_dni}
                      </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label>Dirección</Label>
                      {isEditing ? (
                        <Textarea
                          value={editedTransaction?.client_address || ''}
                          onChange={(e) => updateField('client_address', e.target.value)}
                        />
                      ) : (
                      <p className="font-medium">
                        {selectedTransaction.client_address}
                      </p>
                      )}
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
                      <Label>Paquete</Label>
                      {isEditing ? (
                        <Input
                          value={editedTransaction?.package || ''}
                          onChange={(e) => updateField('package', e.target.value)}
                        />
                      ) : (
                      <p className="font-medium">
                        {selectedTransaction.package}
                      </p>
                      )}
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
                      <Label>Monto Total</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedTransaction?.amount || ''}
                          onChange={(e) => updateField('amount', parseFloat(e.target.value))}
                        />
                      ) : (
                      <p className="font-medium">
                        {formatCurrency(selectedTransaction.amount)}
                      </p>
                      )}
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
                                  <Label>Aerolínea</Label>
                                  {isEditing ? (
                                    <Input
                                      value={editedTransaction?.itinerario?.[0]?.aerolinea || ''}
                                      onChange={(e) => updateFlightField('aerolinea', e.target.value)}
                                    />
                                  ) : (
                                  <p className="font-medium capitalize">
                                    {itinerary.aerolinea}
                                  </p>
                                  )}
                                </div>
                                <div>
                                  <Label>Ruta</Label>
                                  {isEditing ? (
                                    <Input
                                      value={editedTransaction?.itinerario?.[0]?.ruta || ''}
                                      onChange={(e) => updateFlightField('ruta', e.target.value)}
                                    />
                                  ) : (
                                  <p className="font-medium">
                                    {itinerary.ruta}
                                  </p>
                                  )}
                                </div>
                                <div>
                                  <Label>Hora de Salida</Label>
                                  {isEditing ? (
                                    <Input
                                      value={editedTransaction?.itinerario?.[0]?.hora_salida || ''}
                                      onChange={(e) => updateFlightField('hora_salida', e.target.value)}
                                    />
                                  ) : (
                                  <p className="font-medium">
                                    {itinerary.hora_salida || "No especificado"}
                                  </p>
                                  )}
                                </div>
                                <div>
                                  <Label>Hora de Llegada</Label>
                                  {isEditing ? (
                                    <Input
                                      value={editedTransaction?.itinerario?.[0]?.hora_llegada || ''}
                                      onChange={(e) => updateFlightField('hora_llegada', e.target.value)}
                                    />
                                  ) : (
                                  <p className="font-medium">
                                    {itinerary.hora_llegada || "No especificado"}
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
                                  <Label>Hotel</Label>
                                  {isEditing ? (
                                    <Input
                                      value={editedTransaction?.travel_info?.[0]?.hotel || ''}
                                      onChange={(e) => updateHotelField('hotel', e.target.value)}
                                    />
                                  ) : (
                                  <p className="font-medium">
                                    {travelInfo.hotel}
                                  </p>
                                  )}
                                </div>
                                <div>
                                  <Label>Noches</Label>
                                  {isEditing ? (
                                    <Input
                                      type="number"
                                      value={editedTransaction?.travel_info?.[0]?.noches || ''}
                                      onChange={(e) => updateHotelField('noches', parseInt(e.target.value))}
                                    />
                                  ) : (
                                  <p className="font-medium">
                                    {travelInfo.noches || "No especificado"}
                                  </p>
                                  )}
                                </div>
                                <div>
                                  <Label>Incluye</Label>
                                  {isEditing ? (
                                    <Textarea
                                      value={
                                        editedTransaction?.travel_info?.[0]?.incluye 
                                          ? (Array.isArray(editedTransaction.travel_info[0].incluye) 
                                              ? editedTransaction.travel_info[0].incluye.join(', ')
                                              : editedTransaction.travel_info[0].incluye)
                                          : ''
                                      }
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const incluyeArray = value ? value.split(',').map(item => item.trim()) : [];
                                        updateHotelField('incluye', incluyeArray);
                                      }}
                                      placeholder="Separar elementos con comas"
                                    />
                                  ) : (
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
                                  )}
                                </div>
                                <div>
                                  <Label>No Incluye</Label>
                                  {isEditing ? (
                                    <Textarea
                                      value={
                                        editedTransaction?.travel_info?.[0]?.no_incluye 
                                          ? (Array.isArray(editedTransaction.travel_info[0].no_incluye) 
                                              ? editedTransaction.travel_info[0].no_incluye.join(', ')
                                              : editedTransaction.travel_info[0].no_incluye)
                                          : ''
                                      }
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const noIncluyeArray = value ? value.split(',').map(item => item.trim()) : [];
                                        updateHotelField('no_incluye', noIncluyeArray);
                                      }}
                                      placeholder="Separar elementos con comas"
                                    />
                                  ) : (
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
                                  )}
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
                                <div>
                                  <p className="text-sm text-gray-600">Estado</p>
                                  <Badge
                                    className={`ml-2 ${
                                      evidence.status === 'approved' 
                                        ? 'bg-green-100 text-green-800' 
                                        : evidence.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {evidence.status === 'approved' ? 'Aprobada' : 
                                     evidence.status === 'pending' ? 'Pendiente' : 'Rechazada'}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Estado Factura</p>
                                  <Badge
                                    className={`ml-2 ${
                                      evidence.invoice_status === 'facturado' 
                                        ? 'bg-blue-100 text-blue-800' 
                                        : 'bg-orange-100 text-orange-800'
                                    }`}
                                  >
                                    {evidence.invoice_status}
                                  </Badge>
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

                {/* Botón Generar Contrato */}
                {isContractMode && (
                  <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                    <Button 
                      onClick={() => generateContract(selectedTransaction.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Generar Contrato
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invoice Form Dialog */}
      <InvoiceForm
        isOpen={isInvoiceFormOpen}
        onClose={closeInvoiceForm}
        onSubmit={handleGenerateInvoice}
        transactionId={selectedInvoiceTransactionId || undefined}
      />

      {/* Abono Form Dialog */}
      <Dialog open={isAbonoFormOpen} onOpenChange={closeAbonoForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Abono</DialogTitle>
            <DialogDescription>
              Completa los datos para agregar un abono a la transacción.
            </DialogDescription>
          </DialogHeader>

          {selectedAbonoTransactionId && (
            <AbonoForm
              transactionId={selectedAbonoTransactionId}
              onSubmit={handleAddAbono}
              onCancel={closeAbonoForm}
              loading={loadingAbono}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Evidence Form Dialog */}
      <Dialog open={isEvidenceFormOpen} onOpenChange={closeEvidenceForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Evidencia de Abono</DialogTitle>
            <DialogDescription>
              Sube una imagen del comprobante de pago y completa los datos del abono.
            </DialogDescription>
          </DialogHeader>

          {selectedEvidenceTransactionId && (
            <EvidenceForm
              transactionId={selectedEvidenceTransactionId}
              onSubmit={handleAddEvidence}
              onCancel={closeEvidenceForm}
              loading={loadingEvidence}
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Home;
