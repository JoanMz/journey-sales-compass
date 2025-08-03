import { useState, useEffect } from "react";
import { Check, X, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency } from "../../lib/utils";
import { useData } from "@/contexts/DataContext";
import CompleteTransactionForm from "../forms/CompleteTransactionForm";

const PendingTransactions = () => {
  const {
    transactions,
    loading,
    error,
    refreshTransactions,
    updateTransactionStatus,
  } = useData();
  const [showMoreCount, setShowMoreCount] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const handleApprove = async (id: number) => {
    try {
      setIsProcessing(true);
      await updateTransactionStatus(id, "approved");
      toast.success(
        `Transacción #${id} aprobada - El vendedor debe completar la información`
      );
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
    setShowMoreCount((prev) => prev + 3);
  };

  const handleCompleteInfo = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowCompleteForm(true);
  };

  const handleCompleteSuccess = () => {
    setShowCompleteForm(false);
    setSelectedTransaction(null);
    refreshTransactions();
    toast.success("Información completada correctamente");
  };

  const handleCompleteCancel = () => {
    setShowCompleteForm(false);
    setSelectedTransaction(null);
  };

  // Filter pending transactions
  console.log("🔍 Todas las transacciones:", transactions);
  console.log("🔍 Transacciones filtradas por status:", transactions.map(t => ({ id: t.id, status: t.status, client_name: t.client_name })));
  
  const pendingTransactions = transactions.filter(
    (t) => t.status === "pending"
  );
  
  console.log("🔍 Transacciones pendientes:", pendingTransactions);
  const approvedTransactions = transactions.filter(
    (t) => t.status === "approved"
  );
  const completedTransactions = transactions.filter(
    (t) => t.status === "terminado"
  );
  const displayPendingTransactions = pendingTransactions.slice(
    0,
    showMoreCount
  );

  return (
    <div className="space-y-6">
      {/* Pending Transactions */}
      <Card className="bg-white border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Aprobaciones de Ventas Pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : error && pendingTransactions.length === 0 ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : pendingTransactions.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No hay transacciones pendientes
            </div>
          ) : (
            <div className="space-y-4">
              {displayPendingTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border-b border-gray-200 pb-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-medium">{transaction.client_name}</h3>
                      <p className="text-sm text-gray-500">Cliente</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {transaction.transaction_type}
                      </p>
                      <p className="font-bold text-lg">
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Paquete</p>
                    <p className="text-sm">{transaction.package}</p>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Fecha inicio</p>
                    <p className="text-sm">
                      {new Date(transaction.start_date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Fecha fin</p>
                    <p className="text-sm">
                      {new Date(transaction.end_date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Vuelo cotizado</p>
                    <p className="text-sm">{transaction.quoted_flight}</p>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div className="flex-1">
                      {/* URL del Comprobante */}
                      {(transaction as any).evidences && (transaction as any).evidences.length > 0 && (transaction as any).evidences[0].evidence_file && (
                        <div>
                          <p className="text-sm text-gray-500">Comprobante:</p>
                          <a 
                            href={(transaction as any).evidences[0].evidence_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 break-all hover:text-blue-800 underline cursor-pointer"
                          >
                            {(transaction as any).evidences[0].evidence_file}
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
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
                <div
                  key={transaction.id}
                  className="border-b border-yellow-200 pb-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-medium">{transaction.client_name}</h3>
                      <p className="text-sm text-gray-500">Cliente</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {transaction.transaction_type}
                      </p>
                      <p className="font-bold text-lg">
                        {formatCurrency(transaction.amount)}
                      </p>
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
                      Esperando que el vendedor complete la información de vuelo
                      y hotel.
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
            <div className="text-center text-gray-500 py-4">
              No hay ventas completadas
            </div>
          ) : (
            <div className="space-y-4">
              {completedTransactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="border-b border-green-200 pb-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-medium">{transaction.client_name}</h3>
                      <p className="text-sm text-gray-500">
                        {transaction.seller_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {formatCurrency(transaction.amount)}
                      </p>
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
                        <p>
                          {transaction.flight_info.aerolinea} -{" "}
                          {transaction.flight_info.ruta}
                        </p>
                      </div>
                    )}
                    {transaction.hotel_info && (
                      <div>
                        <p className="text-gray-500">Hotel:</p>
                        <p>
                          {transaction.hotel_info.hotel} (
                          {transaction.hotel_info.noches} noches)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Complete Transaction Form Modal */}
      {showCompleteForm && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Completar Información - Transacción #{selectedTransaction.id}</h2>
              <Button
                variant="outline"
                onClick={handleCompleteCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            
            <CompleteTransactionForm
              transactionId={selectedTransaction.id}
              currentData={{
                customerName: selectedTransaction.client_name,
                customerEmail: selectedTransaction.client_email,
                customerPhone: selectedTransaction.client_phone,
                customerDni: selectedTransaction.client_dni,
                customerAddress: selectedTransaction.client_address,
                package: selectedTransaction.package,
                quotedFlight: selectedTransaction.quoted_flight || "",
                agencyCost: selectedTransaction.agency_cost,
                amount: selectedTransaction.amount,
                paidAmount: selectedTransaction.amount, // Asumiendo que el valor pagado es igual al total
                documentType: "dni", // Valor por defecto
                transactionType: selectedTransaction.transaction_type || "venta",
                startDate: selectedTransaction.start_date,
                endDate: selectedTransaction.end_date,
                travelers: selectedTransaction.travelers || [],
                invoiceImage: undefined,
                flightInfo: selectedTransaction.flight_info || {
                  aerolinea: "",
                  ruta: "",
                  fecha: new Date().toISOString(),
                  hora_salida: "",
                  hora_llegada: "",
                },
                hotelInfo: selectedTransaction.hotel_info || {
                  hotel: "",
                  noches: 1,
                  incluye: [],
                  no_incluye: [],
                  cuentas_recaudo: {
                    banco: "",
                    numero: "",
                    nombre: "",
                    nit: "",
                  },
                },
              }}
              onComplete={handleCompleteSuccess}
              onCancel={handleCompleteCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingTransactions;
