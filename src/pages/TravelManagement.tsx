import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plane, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft, X, RefreshCw, Search, Filter } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { endpoints } from "../lib/endpoints";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

interface FlightTransaction {
  id: number;
  client_name: string;
  package: string;
  start_date: string;
  daysLeave: number;
  amount: number;
  payment_status: number;
}

interface TravelGroupsResponse {
  proximos: FlightTransaction[];
  por_comenzar: FlightTransaction[];
  a_punto: FlightTransaction[];
  en_viaje: FlightTransaction[];
  regresando: FlightTransaction[];
  finalizados: FlightTransaction[];
}

interface DetailedTransaction {
  id: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_dni: string;
  client_address: string;
  package: string;
  quoted_flight: string;
  agency_cost: number;
  amount: number;
  transaction_type: string;
  status: string;
  payment_status: string;
  total_paid: number;
  pending_amount: number;
  seller_id: number;
  seller_name: string;
  receipt: string;
  created_at: string;
  updated_at: string;
  start_date: string;
  end_date: string;
  travelers: Array<{
    name: string;
    id: number;
    phone: string;
    transaction_id: number;
    dni: string;
    date_birth: string;
  }>;
  itinerario: Array<{
    id: number;
    transaction_id: number;
    aerolinea: string;
    ruta: string;
    hora_salida: string;
    hora_llegada: string;
  }>;
  travel_info: any[];
  documentos: Array<{
    viajero_id: number;
    id: number;
    transaction_id: number;
    document_url: string;
    tipo_documento: string;
  }>;
  evidence: Array<{
    id: number;
    transaction_id: number;
    evidence_file: string;
    upload_date: string;
    amount: number;
    status: string;
    invoice_status: string;
  }>;
}

const TravelManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [travelGroups, setTravelGroups] = useState<TravelGroupsResponse>({
    proximos: [],
    por_comenzar: [],
    a_punto: [],
    en_viaje: [],
    regresando: [],
    finalizados: []
  });
  const [loading, setLoading] = useState(true);
  const [loadingTransaction, setLoadingTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<DetailedTransaction | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionCache, setTransactionCache] = useState<Map<number, DetailedTransaction>>(new Map());
  const [refreshingTransaction, setRefreshingTransaction] = useState(false);
  
  // Estados para filtros
  const [nameFilter, setNameFilter] = useState("");
  const [packageFilter, setPackageFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  useEffect(() => {
    const fetchTravelGroups = async () => {
      try {
        setLoading(true);
        
        if (!user?.id) {
          console.error("No user ID available");
          return;
        }

        // Obtener fecha actual en formato YYYY-MM-DD
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Usar el endpoint específico para el seller
        const response = await fetch(
          endpoints.travelManagement.getManageFliesBySeller(user.id, currentDate)
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const groupedData: TravelGroupsResponse = await response.json();
        console.log("Datos agrupados recibidos:", groupedData);
        setTravelGroups(groupedData);
      } catch (error) {
        console.error("Error fetching travel groups:", error);
        // En caso de error, mantener la estructura vacía
        setTravelGroups({
          proximos: [],
          por_comenzar: [],
          a_punto: [],
          en_viaje: [],
          regresando: [],
          finalizados: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTravelGroups();
  }, [user?.id]);

  const fetchTransactionDetails = async (transactionId: number, forceRefresh: boolean = false): Promise<DetailedTransaction | null> => {
    try {
      // Check cache first unless forcing refresh
      if (!forceRefresh && transactionCache.has(transactionId)) {
        console.log("Using cached transaction data for ID:", transactionId);
        return transactionCache.get(transactionId)!;
      }

      console.log("Fetching transaction details from API for ID:", transactionId);
      const response = await fetch(endpoints.transactions.getById(transactionId));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const detailedTransaction: DetailedTransaction = await response.json();
      
      // Update cache
      setTransactionCache(prev => new Map(prev.set(transactionId, detailedTransaction)));
      
      return detailedTransaction;
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      return null;
    }
  };

  const viewTransaction = async (transactionId: number) => {
    setLoadingTransaction(true);
    try {
      const detailedTransaction = await fetchTransactionDetails(transactionId);
      
      if (detailedTransaction) {
        setSelectedTransaction(detailedTransaction);
        setShowTransactionModal(true);
      }
    } catch (error) {
      console.error("Error viewing transaction:", error);
    } finally {
      setLoadingTransaction(false);
    }
  };

  const refreshTransaction = async () => {
    if (!selectedTransaction) return;
    
    setRefreshingTransaction(true);
    try {
      const refreshedTransaction = await fetchTransactionDetails(selectedTransaction.id, true);
      
      if (refreshedTransaction) {
        setSelectedTransaction(refreshedTransaction);
      }
    } catch (error) {
      console.error("Error refreshing transaction:", error);
    } finally {
      setRefreshingTransaction(false);
    }
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setNameFilter("");
    setPackageFilter("all");
    setPaymentStatusFilter("all");
  };

  // Función para filtrar transacciones
  const filterTransactions = (transactions: FlightTransaction[]) => {
    return transactions.filter(transaction => {
      const matchesName = nameFilter === "" || 
        transaction.client_name.toLowerCase().includes(nameFilter.toLowerCase());
      
      const matchesPackage = packageFilter === "all" || packageFilter === "" || 
        transaction.package === packageFilter;
      
      const matchesPaymentStatus = paymentStatusFilter === "all" || paymentStatusFilter === "" || 
        transaction.payment_status.toString() === paymentStatusFilter;
      
      return matchesName && matchesPackage && matchesPaymentStatus;
    });
  };

  // Obtener paquetes únicos para el select
  const uniquePackages = useMemo(() => {
    const allTransactions = [
      ...travelGroups.proximos,
      ...travelGroups.por_comenzar,
      ...travelGroups.a_punto,
      ...travelGroups.en_viaje,
      ...travelGroups.regresando,
      ...travelGroups.finalizados
    ];
    
    const packages = Array.from(new Set(allTransactions.map(t => t.package)));
    return packages.filter(pkg => pkg && pkg.trim() !== "");
  }, [travelGroups]);

  // Mapear los grupos de la API a etiquetas en español con filtros aplicados
  const kanbanGroups = useMemo(() => ({
    "Próximos Viajes": filterTransactions(travelGroups.proximos),
    "Por Comenzar": filterTransactions(travelGroups.por_comenzar),
    "A Punto de Salir": filterTransactions(travelGroups.a_punto),
    "En Viaje": filterTransactions(travelGroups.en_viaje),
    "Regresando": filterTransactions(travelGroups.regresando),
    "Finalizados": filterTransactions(travelGroups.finalizados),
  }), [travelGroups, nameFilter, packageFilter, paymentStatusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "approved":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "terminado":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "terminado":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Inicio
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Plane className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Viajes</h1>
                <p className="text-gray-600">Administra las reservas y confirmaciones de viajes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Filtros</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Filtro por nombre */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Buscar por nombre</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Nombre del cliente..."
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filtro por paquete */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Paquete</label>
                <Select value={packageFilter} onValueChange={setPackageFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar paquete..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los paquetes</SelectItem>
                    {uniquePackages.map((pkg) => (
                      <SelectItem key={pkg} value={pkg}>
                        {pkg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por estado de pago */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Estado de Pago</label>
                <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado de pago..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="1">Pagado Completo</SelectItem>
                    <SelectItem value="0">No Pagado Completo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botón limpiar filtros */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">&nbsp;</label>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full flex items-center gap-2"
                  disabled={nameFilter === "" && packageFilter === "all" && paymentStatusFilter === "all"}
                >
                  <X className="h-4 w-4" />
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Próximos</p>
                  <p className="text-2xl font-bold text-yellow-700">{kanbanGroups["Próximos Viajes"].length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Por Comenzar</p>
                  <p className="text-2xl font-bold text-blue-700">{kanbanGroups["Por Comenzar"].length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">A Punto</p>
                  <p className="text-2xl font-bold text-orange-700">{kanbanGroups["A Punto de Salir"].length}</p>
                </div>
                <Plane className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">En Viaje</p>
                  <p className="text-2xl font-bold text-green-700">{kanbanGroups["En Viaje"].length}</p>
                </div>
                <Plane className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-indigo-50 border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-600">Regresando</p>
                  <p className="text-2xl font-bold text-indigo-700">{kanbanGroups["Regresando"].length}</p>
                </div>
                <Plane className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Finalizados</p>
                  <p className="text-2xl font-bold text-gray-700">{kanbanGroups["Finalizados"].length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {Object.entries(kanbanGroups).map(([status, transactions]) => (
            <Card key={status} className="bg-white border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getStatusIcon(status === "Próximos Viajes" ? "approved" : 
                                status === "Por Comenzar" ? "approved" : 
                                status === "A Punto de Salir" ? "approved" :
                                status === "En Viaje" ? "terminado" :
                                status === "Regresando" ? "terminado" :
                                status === "Finalizados" ? "terminado" : "approved")}
                  {status}
                  <Badge variant="secondary" className="ml-auto">
                    {transactions.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Plane className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No hay viajes {status.toLowerCase()}</p>
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`p-4 rounded-lg border hover:shadow-md transition-shadow ${
                        transaction.payment_status === 1
                          ? 'bg-green-50 border-green-300'
                          : 'bg-red-50 border-red-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 truncate">
                          {transaction.client_name}
                        </h4>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Paquete:</span>
                          <span className="font-medium">{transaction.package}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>Fecha:</span>
                          <span className="font-medium">
                            {new Date(transaction.start_date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>Días:</span>
                          <span className={`font-bold ${
                            transaction.daysLeave <= 3 ? 'text-red-600' : 
                            transaction.daysLeave <= 30 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {transaction.daysLeave > 0 
                              ? `${transaction.daysLeave} días` 
                              : transaction.daysLeave === 0 
                                ? (status === "Finalizados" ? '0 días' : 'Hoy')
                                : `${Math.abs(transaction.daysLeave)} días atrás`
                            }
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>Monto:</span>
                          <span className="font-bold text-green-600">
                            ${transaction.amount?.toLocaleString() || 0}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewTransaction(transaction.id);
                          }}
                          disabled={loadingTransaction}
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal de Detalles de Transacción */}
      {showTransactionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Detalles de Transacción #{selectedTransaction.id}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshTransaction}
                    disabled={refreshingTransaction}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshingTransaction ? 'animate-spin' : ''}`} />
                    Actualizar
                  </Button>
                  <button
                    onClick={() => setShowTransactionModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información del Cliente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Información del Cliente</h3>
                  <div className="space-y-2">
                    <div><strong>Nombre:</strong> {selectedTransaction.client_name}</div>
                    <div><strong>Email:</strong> {selectedTransaction.client_email}</div>
                    <div><strong>Teléfono:</strong> {selectedTransaction.client_phone}</div>
                    <div><strong>DNI:</strong> {selectedTransaction.client_dni}</div>
                    <div><strong>Dirección:</strong> {selectedTransaction.client_address}</div>
                  </div>
                </div>

                {/* Información del Viaje */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Información del Viaje</h3>
                  <div className="space-y-2">
                    <div><strong>Paquete:</strong> {selectedTransaction.package}</div>
                    <div><strong>Vuelo Cotizado:</strong> {selectedTransaction.quoted_flight}</div>
                    <div><strong>Fecha de Inicio:</strong> {new Date(selectedTransaction.start_date).toLocaleDateString()}</div>
                    <div><strong>Fecha de Fin:</strong> {new Date(selectedTransaction.end_date).toLocaleDateString()}</div>
                    <div><strong>Monto:</strong> ${selectedTransaction.amount?.toLocaleString()}</div>
                    <div><strong>Costo Agencia:</strong> ${selectedTransaction.agency_cost?.toLocaleString()}</div>
                    <div><strong>Estado:</strong> 
                      <Badge className={`ml-2 ${getStatusColor(selectedTransaction.status)}`}>
                        {selectedTransaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Información de Pago */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Información de Pago</h3>
                  <div className="space-y-2">
                    <div><strong>Estado de Pago:</strong> 
                      <Badge className={`ml-2 ${selectedTransaction.payment_status === 'pago_completo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {selectedTransaction.payment_status}
                      </Badge>
                    </div>
                    <div><strong>Total Pagado:</strong> <span className="text-green-600">${selectedTransaction.total_paid?.toLocaleString()}</span></div>
                    <div><strong>Monto Pendiente:</strong> <span className="text-red-600">${selectedTransaction.pending_amount?.toLocaleString()}</span></div>
                  </div>
                </div>

                {/* Información del Vendedor */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Información del Vendedor</h3>
                  <div className="space-y-2">
                    <div><strong>Vendedor:</strong> {selectedTransaction.seller_name}</div>
                    <div><strong>Tipo de Transacción:</strong> {selectedTransaction.transaction_type}</div>
                    <div><strong>Recibo:</strong> {selectedTransaction.receipt}</div>
                    <div><strong>Fecha de Creación:</strong> {new Date(selectedTransaction.created_at).toLocaleDateString()}</div>
                    <div><strong>Última Actualización:</strong> {new Date(selectedTransaction.updated_at).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Itinerario */}
                {selectedTransaction.itinerario && selectedTransaction.itinerario.length > 0 && (
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Itinerario</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTransaction.itinerario.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="space-y-2">
                            <div><strong>Aerolínea:</strong> {item.aerolinea}</div>
                            <div><strong>Ruta:</strong> {item.ruta}</div>
                            <div><strong>Hora Salida:</strong> {item.hora_salida}</div>
                            <div><strong>Hora Llegada:</strong> {item.hora_llegada}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Viajeros */}
                {selectedTransaction.travelers && selectedTransaction.travelers.length > 0 && (
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Viajeros</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTransaction.travelers.map((traveler, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="space-y-2">
                            <div><strong>Nombre:</strong> {traveler.name}</div>
                            <div><strong>DNI:</strong> {traveler.dni}</div>
                            <div><strong>Teléfono:</strong> {traveler.phone}</div>
                            <div><strong>Fecha de Nacimiento:</strong> {new Date(traveler.date_birth).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documentos */}
                {selectedTransaction.documentos && selectedTransaction.documentos.length > 0 && (
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Documentos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTransaction.documentos.map((documento, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="space-y-2">
                            <div><strong>Tipo:</strong> {documento.tipo_documento}</div>
                            <div><strong>Viajero ID:</strong> {documento.viajero_id}</div>
                            <div>
                              <strong>Documento:</strong>
                              <a 
                                href={documento.document_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline ml-2"
                              >
                                Ver documento
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evidencias */}
                {selectedTransaction.evidence && selectedTransaction.evidence.length > 0 && (
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Evidencias de Pago</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTransaction.evidence.map((evidence, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="space-y-2">
                            <div><strong>Monto:</strong> ${evidence.amount?.toLocaleString()}</div>
                            <div><strong>Estado:</strong> 
                              <Badge className={`ml-2 ${getStatusColor(evidence.status)}`}>
                                {evidence.status}
                              </Badge>
                            </div>
                            <div><strong>Estado Factura:</strong> {evidence.invoice_status}</div>
                            <div><strong>Fecha:</strong> {new Date(evidence.upload_date).toLocaleDateString()}</div>
                            {evidence.evidence_file && (
                              <div>
                                <strong>Comprobante:</strong>
                                <a 
                                  href={evidence.evidence_file} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline ml-2"
                                >
                                  Ver comprobante
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default TravelManagement; 