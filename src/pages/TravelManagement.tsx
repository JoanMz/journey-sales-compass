import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Plane, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { endpoints } from "../lib/endpoints";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

interface FlightTransaction {
  id: number;
  client_name: string;
  package: string;
  start_date: string;
  end_date: string;
  amount: number;
  status: string;
  itinerario?: any[];
  seller_name?: string;
}

const TravelManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [flightTransactions, setFlightTransactions] = useState<FlightTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTransaction, setLoadingTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    const fetchFlightTransactions = async () => {
      try {
        setLoading(true);
        // Filtrar transacciones que tengan información de vuelo
        const response = await fetch(endpoints.transactions.all);
        const allTransactions = await response.json();
        
        // Filtrar transacciones con itinerario
        const flights = allTransactions.filter((t: any) => 
          t.itinerario && t.itinerario.length > 0
        );

        // Aplicar filtro por usuario si no es admin
        const filteredFlights = isAdmin 
          ? flights 
          : flights.filter((t: any) => t.seller_id === user?.id);

        console.log("Todas las transacciones con itinerario:", flights);
        console.log("Transacciones filtradas por usuario:", filteredFlights);
        setFlightTransactions(filteredFlights);
      } catch (error) {
        console.error("Error fetching flight transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlightTransactions();
  }, [user, isAdmin]);

  const viewTransaction = async (transactionId: any) => {
    setLoadingTransaction(true);
    try {
      // Buscar la transacción completa
      const transaction = flightTransactions.find(t => t.id === transactionId);
      if (transaction) {
        setSelectedTransaction(transaction);
        setShowTransactionModal(true);
      }
    } catch (error) {
      console.error("Error viewing transaction:", error);
    } finally {
      setLoadingTransaction(false);
    }
  };

  // Función para calcular días hasta la fecha de inicio
  const getDaysUntilStart = (startDate: string) => {
    const today = new Date();
    let start: Date;
    
    // Manejar diferentes formatos de fecha
    if (startDate.includes('/')) {
      // Formato DD/MM/YYYY o MM/DD/YYYY
      const parts = startDate.split('/');
      if (parts.length === 3) {
        // Asumir formato DD/MM/YYYY
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Meses en JS van de 0-11
        const year = parseInt(parts[2]);
        start = new Date(year, month, day);
      } else {
        start = new Date(startDate);
      }
    } else {
      start = new Date(startDate);
    }
    
    console.log('Fecha de inicio:', startDate, 'Parseada como:', start);
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log('Días hasta inicio:', diffDays);
    return diffDays;
  };

  // Función para calcular días hasta una fecha específica
  const getDaysUntilDate = (date: string) => {
    const today = new Date();
    let targetDate: Date;
    
    // Manejar diferentes formatos de fecha
    if (date.includes('/')) {
      const parts = date.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        targetDate = new Date(year, month, day);
      } else {
        targetDate = new Date(date);
      }
    } else {
      targetDate = new Date(date);
    }
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Función para verificar si una fecha está entre dos fechas
  const isDateBetween = (currentDate: Date, startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return currentDate >= start && currentDate <= end;
  };

  // Función para verificar si una fecha es igual al día actual
  const isDateToday = (date: string) => {
    const today = new Date();
    const targetDate = new Date(date);
    return today.toDateString() === targetDate.toDateString();
  };

  // Agrupar transacciones por estado
  const kanbanGroups = {
    "Próximos Viajes": flightTransactions.filter(t => {
      const days = getDaysUntilDate(t.start_date);
      const isIncluded = t.status === "approved" && days > 30;
      console.log(`Transacción ${t.id} (${t.client_name}): status=${t.status}, días=${days}, incluida en Próximos=${isIncluded}`);
      return isIncluded;
    }),
    "Por Comenzar": flightTransactions.filter(t => {
      const days = getDaysUntilDate(t.start_date);
      const isIncluded = t.status === "approved" && days <= 30 && days > 4;
      console.log(`Transacción ${t.id} (${t.client_name}): status=${t.status}, días=${days}, incluida en Por Comenzar=${isIncluded}`);
      return isIncluded;
    }),
    "A Punto de Salir": flightTransactions.filter(t => {
      const days = getDaysUntilDate(t.start_date);
      const isIncluded = t.status === "approved" && days <= 3 && days > 0;
      console.log(`Transacción ${t.id} (${t.client_name}): status=${t.status}, días=${days}, incluida en A Punto=${isIncluded}`);
      return isIncluded;
    }),
    "En Viaje": flightTransactions.filter(t => {
      const today = new Date();
      const isIncluded = t.status === "terminado" && isDateBetween(today, t.start_date, t.end_date);
      console.log(`Transacción ${t.id} (${t.client_name}): status=${t.status}, incluida en En Viaje=${isIncluded}`);
      return isIncluded;
    }),
    "Regresando": flightTransactions.filter(t => {
      const isIncluded = t.status === "terminado" && isDateToday(t.end_date);
      console.log(`Transacción ${t.id} (${t.client_name}): status=${t.status}, incluida en Regresando=${isIncluded}`);
      return isIncluded;
    }),
    "Finalizados": flightTransactions.filter(t => {
      const days = getDaysUntilDate(t.end_date);
      const isIncluded = t.status === "terminado" && days < 0;
      console.log(`Transacción ${t.id} (${t.client_name}): status=${t.status}, días fin=${days}, incluida en Finalizados=${isIncluded}`);
      return isIncluded;
    }),
  };

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
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => viewTransaction(transaction.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 truncate">
                          {transaction.client_name}
                        </h4>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
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
                          <span className={`font-medium ${
                            getDaysUntilDate(transaction.start_date) <= 3 ? 'text-red-600' : 
                            getDaysUntilDate(transaction.start_date) <= 30 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {getDaysUntilDate(transaction.start_date) > 0 
                              ? `${getDaysUntilDate(transaction.start_date)} días` 
                              : getDaysUntilDate(transaction.start_date) === 0 
                                ? 'Hoy' 
                                : `${Math.abs(getDaysUntilDate(transaction.start_date))} días atrás`
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
                <button
                  onClick={() => setShowTransactionModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
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
                    <div><strong>Fecha de Inicio:</strong> {new Date(selectedTransaction.start_date).toLocaleDateString()}</div>
                    <div><strong>Fecha de Fin:</strong> {new Date(selectedTransaction.end_date).toLocaleDateString()}</div>
                    <div><strong>Monto:</strong> ${selectedTransaction.amount?.toLocaleString()}</div>
                    <div><strong>Estado:</strong> {selectedTransaction.status}</div>
                    <div><strong>Número de Viajeros:</strong> {selectedTransaction.number_of_travelers}</div>
                  </div>
                </div>

                {/* Itinerario */}
                {selectedTransaction.itinerario && selectedTransaction.itinerario.length > 0 && (
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Itinerario</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTransaction.itinerario.map((item: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="space-y-2">
                            <div><strong>Aerolínea:</strong> {item.aerolinea}</div>
                            <div><strong>Ruta:</strong> {item.ruta}</div>
                            <div><strong>Fecha:</strong> {item.fecha}</div>
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
                      {selectedTransaction.travelers.map((traveler: any, index: number) => (
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

                {/* Evidencias */}
                {selectedTransaction.evidence && selectedTransaction.evidence.length > 0 && (
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Evidencias de Pago</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTransaction.evidence.map((evidence: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="space-y-2">
                            <div><strong>Monto:</strong> ${evidence.amount}</div>
                            <div><strong>Estado:</strong> {evidence.status}</div>
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