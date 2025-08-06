import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Plane, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { endpoints } from "../../lib/endpoints";

interface FlightTransaction {
  id: number;
  client_name: string;
  package: string;
  start_date: string;
  end_date: string;
  amount: number;
  status: string;
  flight_info?: any[];
  seller_name?: string;
}

interface FlightKanbanViewProps {
  viewTransaction: (transactionId: any) => void;
  loadingTransaction: boolean;
}

const FlightKanbanView: React.FC<FlightKanbanViewProps> = ({
  viewTransaction,
  loadingTransaction,
}) => {
  const { user, isAdmin } = useAuth();
  const [flightTransactions, setFlightTransactions] = useState<FlightTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlightTransactions = async () => {
      try {
        setLoading(true);
        // Filtrar transacciones que tengan información de vuelo
        const response = await fetch(endpoints.transactions.all);
        const allTransactions = await response.json();
        
        // Filtrar transacciones con flight_info
        const flights = allTransactions.filter((t: any) => 
          t.flight_info && t.flight_info.length > 0
        );

        // Aplicar filtro por usuario si no es admin
        const filteredFlights = isAdmin 
          ? flights 
          : flights.filter((t: any) => t.seller_id === user?.id);

        setFlightTransactions(filteredFlights);
      } catch (error) {
        console.error("Error fetching flight transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlightTransactions();
  }, [user, isAdmin]);

  // Agrupar transacciones por estado
  const kanbanGroups = {
    "Pendientes": flightTransactions.filter(t => t.status === "pending"),
    "En Proceso": flightTransactions.filter(t => t.status === "approved"),
    "Confirmados": flightTransactions.filter(t => t.status === "terminado"),
    "Cancelados": flightTransactions.filter(t => t.status === "rejected"),
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
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-full">
          <Plane className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Vuelos</h2>
          <p className="text-gray-600">Administra las reservas y confirmaciones de vuelos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {Object.entries(kanbanGroups).map(([status, transactions]) => (
          <Card key={status} className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {getStatusIcon(status === "Pendientes" ? "pending" : 
                              status === "En Proceso" ? "approved" : 
                              status === "Confirmados" ? "terminado" : "rejected")}
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
                  <p>No hay vuelos {status.toLowerCase()}</p>
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
                      
                      {transaction.flight_info && transaction.flight_info[0] && (
                        <div className="flex justify-between">
                          <span>Vuelo:</span>
                          <span className="font-medium">
                            {transaction.flight_info[0].aerolinea} - {transaction.flight_info[0].ruta}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span>Fecha:</span>
                        <span className="font-medium">
                          {new Date(transaction.start_date).toLocaleDateString()}
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
  );
};

export default FlightKanbanView; 