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

 /*  useEffect(() => {
    // Initial fetch
    refreshTransactions();
  }, []);  */// Remove the polling here since it's handled by DataContext

  const handleApprove = async (id: number) => {
    try {
      setIsProcessing(true);
      await updateTransactionStatus(id, "completado");
      toast.success(`Transacción #${id} aprobada`);
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
      await updateTransactionStatus(id, "rechazado");
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
  const displayTransactions = pendingTransactions.slice(0, showMoreCount);

  return (
    <Card className="bg-white border-blue-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Aprobaciones de Ventas pendings</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : error && pendingTransactions.length === 0 ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : pendingTransactions.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No hay transacciones pendings</div>
        ) : (
          <div className="space-y-4">
            {displayTransactions.map((transaction) => (
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
  );
};

export default PendingTransactions;
