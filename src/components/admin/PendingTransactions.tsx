import { useState, useEffect } from "react";
import { Check, X, Edit, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
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
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
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

  // Funciones de paginación
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
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

  // Cálculos de paginación
  const totalItems = pendingTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayPendingTransactions = pendingTransactions.slice(startIndex, endIndex);

  // Resetear a la primera página cuando cambian los datos
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Componente de paginación
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        // Mostrar todas las páginas si hay 5 o menos
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Mostrar páginas con ellipsis
        if (currentPage <= 3) {
          // Al inicio
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          // Al final
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          // En el medio
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} transacciones
        </div>
        
        <div className="flex items-center gap-2">
          {/* Botón Primera página */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToFirstPage}
            disabled={currentPage === 1 || isProcessing}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          
          {/* Botón Página anterior */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1 || isProcessing}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {/* Números de página */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="px-2 py-1 text-gray-400">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page as number)}
                    disabled={isProcessing}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {/* Botón Página siguiente */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || isProcessing}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {/* Botón Última página */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToLastPage}
            disabled={currentPage === totalPages || isProcessing}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Pending Transactions */}
      <Card className="bg-white border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Aprobaciones de Ventas Pendientes ({totalItems})
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
                      {(transaction as any).evidence && (transaction as any).evidence.length > 0 && (transaction as any).evidence[0].evidence_file && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-500 mb-1">Comprobante de Pago:</p>
                          <div className="flex items-center gap-4">
                            <a 
                              href={(transaction as any).evidence[0].evidence_file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 underline cursor-pointer bg-blue-50 px-2 py-1 rounded"
                            >
                              Ver Comprobante
                            </a>
                            <span className="inline-block bg-green-100 text-green-800 text-lg font-bold px-4 py-1 rounded shadow border border-green-300">
                              {formatCurrency((transaction as any).evidence[0].amount)}
                            </span>
                            <span className="text-xs text-gray-400 font-semibold">Pago del cliente</span>
                          </div>
                        </div>
                      )}
                      {(!(transaction as any).evidence || (transaction as any).evidence.length === 0 || !(transaction as any).evidence[0].evidence_file) && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-500 mb-1">Comprobante de Pago:</p>
                          <span className="text-sm text-red-500">No hay comprobante disponible</span>
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

              {/* Paginación */}
              <Pagination />
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
