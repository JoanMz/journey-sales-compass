import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency } from "../../lib/utils";
import { useData } from "@/contexts/DataContext";

const PendingTransactions = () => {
  const { transactions, loading, error, refreshTransactions, updateTransactionStatus } = useData();
  const [showMoreCount, setShowMoreCount] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async (id: number) => {
    try {
      setIsProcessing(true);
      await updateTransactionStatus(id, "approved");
      toast.success(`Transacción #${id} aprobada - El vendedor debe completar la información`);
    } catch (err) {
      console.error("Error approving transaction:", err);
      toast.error("Error al aprobar la transacción");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setIsProcessing(true);
      await updateTransactionStatus(id, "rejected");
      toast.info(`Transacción #${id} rechazada`);
    } catch (err) {
      console.error("Error rejecting transaction:", err);
      toast.error("Error al rechazar la transacción");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShowMore = () => {
    setShowMoreCount(prev => prev + 3);
  };

  // Filter pending transactions
  const pendingTransactions = transactions.filter(t => t.status === "pending");
  const approvedTransactions = transactions.filter(t => t.status === "approved");
  const completedTransactions = transactions.filter(t => t.status === "terminado");
  const displayPendingTransactions = pendingTransactions.slice(0, showMoreCount);

  return (
    <div className="space-y-6">
      {/* Pending Transactions */}
      <Card className="bg-white border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Aprobaciones de Ventas Pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : error && pendingTransactions.length === 0 ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : pendingTransactions.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No hay transacciones pendientes</div>
          ) : (
            <div className="space-y-4">
              {displayPendingTransactions.map((transaction) => (
                <div key={transaction.id} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-medium">{transaction.client_name}</h3>
                      <p className="text-sm text-gray-500">Cliente</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{transaction.transaction_type}</p>
                      <p className="font-bold text-lg">{formatCurrency(transaction.amount)}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Paquete</p>
                    <p className="text-sm">{transaction.package}</p>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Fecha inicio</p>
                    <p className="text-sm">{new Date(transaction.start_date).toLocaleDateString()}</p>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Fecha fin</p>
                    <p className="text-sm">{new Date(transaction.end_date).toLocaleDateString()}</p>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Vuelo cotizado</p>
                    <p className="text-sm">{transaction.quoted_flight}</p>
                  </div>

                  <div className="flex justify-end gap-2 mt-3">
                    <Button
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleApprove(transaction.id)}
                      disabled={isProcessing}
                    >
                      <Check className="mr-1 h-4 w-4" /> Aprobar
                    </Button>
                    <Button
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => handleReject(transaction.id)}
                      disabled={isProcessing}
                    >
                      <X className="mr-1 h-4 w-4" /> Rechazar
                    </Button>
                  </div>
                </div>
              ))}

              {pendingTransactions.length > showMoreCount && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                    onClick={handleShowMore}
                    disabled={isProcessing}
                  >
                    Ver más
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approved Transactions Waiting for Completion */}
      <Card className="bg-white border-yellow-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-yellow-700">
            Ventas Aprobadas - Esperando Información del Vendedor
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvedTransactions.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No hay ventas esperando información del vendedor
            </div>
          ) : (
            <div className="space-y-4">
              {approvedTransactions.map((transaction) => (
                <div key={transaction.id} className="border-b border-yellow-200 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-medium">{transaction.client_name}</h3>
                      <p className="text-sm text-gray-500">Cliente</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{transaction.transaction_type}</p>
                      <p className="font-bold text-lg">{formatCurrency(transaction.amount)}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Vendedor</p>
                    <p className="text-sm">{transaction.seller_name}</p>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Paquete</p>
                    <p className="text-sm">{transaction.package}</p>
                  </div>

                  <div className="bg-yellow-50 p-2 rounded mt-2">
                    <p className="text-sm text-yellow-700">
                      Esperando que el vendedor complete la información de vuelo y hotel.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Transactions */}
      <Card className="bg-white border-green-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-green-700">
            Ventas Completadas ({completedTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedTransactions.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No hay ventas completadas</div>
          ) : (
            <div className="space-y-4">
              {completedTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="border-b border-green-200 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-medium">{transaction.client_name}</h3>
                      <p className="text-sm text-gray-500">{transaction.seller_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(transaction.amount)}</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Completado
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Paquete:</p>
                      <p>{transaction.package}</p>
                    </div>
                    {transaction.flight_info && (
                      <div>
                        <p className="text-gray-500">Vuelo:</p>
                        <p>{transaction.flight_info.aerolinea} - {transaction.flight_info.ruta}</p>
                      </div>
                    )}
                    {transaction.hotel_info && (
                      <div>
                        <p className="text-gray-500">Hotel:</p>
                        <p>{transaction.hotel_info.hotel} ({transaction.hotel_info.noches} noches)</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingTransactions;
