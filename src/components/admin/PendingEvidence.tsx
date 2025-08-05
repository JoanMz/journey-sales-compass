import { useState, useEffect } from "react";
import { Check, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency } from "../../lib/utils";
import { endpoints } from "../../lib/endpoints";

interface Evidence {
  id: number;
  transaction_id: number;
  evidence_file: string;
  upload_date: string;
  amount: number;
  status: string;
  transaction_info: {
    seller: {
      id: number;
      name: string;
      email: string;
    };
    client_name: string;
    package: string;
    start_date: string;
    end_date: string;
  };
}

const PendingEvidence = () => {
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const itemsPerPage = 3;

  // Fetch pending evidence
  const fetchPendingEvidence = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(endpoints.evidence.getPending("approved"));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setEvidences(data);
    } catch (err) {
      console.error("Error fetching pending evidence:", err);
      setError("Error al cargar las evidencias pendientes");
    } finally {
      setLoading(false);
    }
  };

  // Update evidence status
  const updateEvidenceStatus = async (evidenceId: number, status: string) => {
    try {
      setIsProcessing(true);
      const response = await fetch(
        endpoints.evidence.updateStatus(evidenceId, status),
        {
          method: "PATCH",
          headers: {
            "accept": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the list after successful update
      await fetchPendingEvidence();
      
      const statusText = status === "approved" ? "aprobada" : "rechazada";
      toast.success(`Evidencia #${evidenceId} ${statusText} correctamente`);
    } catch (err) {
      console.error("Error updating evidence status:", err);
      toast.error("Error al actualizar el estado de la evidencia");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async (id: number) => {
    await updateEvidenceStatus(id, "approved");
  };

  const handleReject = async (id: number) => {
    await updateEvidenceStatus(id, "rejected");
  };

  // Pagination functions
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

  // Fetch data on component mount
  useEffect(() => {
    fetchPendingEvidence();
  }, []);

  // Pagination calculations
  const totalItems = evidences.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayEvidences = evidences.slice(startIndex, endIndex);

  // Reset to first page when data changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        // Show all pages if 5 or less
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show pages with ellipsis
        if (currentPage <= 3) {
          // At the beginning
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          // At the end
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          // In the middle
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
          Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} evidencias
        </div>
        
        <div className="flex items-center gap-2">
          {/* First page button */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToFirstPage}
            disabled={currentPage === 1 || isProcessing}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          
          {/* Previous page button */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1 || isProcessing}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {/* Page numbers */}
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
          
          {/* Next page button */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || isProcessing}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {/* Last page button */}
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
    <Card className="bg-white border-orange-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-orange-700">
          Evidencias Pendientes de Aprobación ({totalItems})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin h-6 w-6 border-2 border-orange-500 rounded-full border-t-transparent"></div>
          </div>
        ) : error && evidences.length === 0 ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : evidences.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No hay evidencias pendientes de aprobación
          </div>
        ) : (
          <div className="space-y-4">
            {displayEvidences.map((evidence) => (
              <div
                key={evidence.id}
                className="border-b border-gray-200 pb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-medium">{evidence.transaction_info.client_name}</h3>
                    <p className="text-sm text-gray-500">Cliente</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {evidence.transaction_info.package}
                    </p>
                    <p className="font-bold text-lg">
                      {formatCurrency(evidence.amount)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">Vendedor</p>
                  <p className="text-sm">{evidence.transaction_info.seller.name}</p>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">Paquete</p>
                  <p className="text-sm">{evidence.transaction_info.package}</p>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">Fecha inicio</p>
                  <p className="text-sm">
                    {new Date(evidence.transaction_info.start_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">Fecha fin</p>
                  <p className="text-sm">
                    {new Date(evidence.transaction_info.end_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">Fecha de carga</p>
                  <p className="text-sm">
                    {new Date(evidence.upload_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex-1">
                    {/* Evidence file URL */}
                    <div>
                      <p className="text-sm text-gray-500">Comprobante:</p>
                      <a 
                        href={evidence.evidence_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 break-all hover:text-blue-800 underline cursor-pointer"
                      >
                        {evidence.evidence_file}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleApprove(evidence.id)}
                      disabled={isProcessing}
                    >
                      <Check className="mr-1 h-4 w-4" /> Aprobar
                    </Button>
                    <Button
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => handleReject(evidence.id)}
                      disabled={isProcessing}
                    >
                      <X className="mr-1 h-4 w-4" /> Rechazar
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <Pagination />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingEvidence; 