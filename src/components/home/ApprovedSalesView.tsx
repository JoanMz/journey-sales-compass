import React, { useState, useEffect } from "react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  X,
} from "lucide-react";
import { SalesTransaction } from "@/types/sales";
import { endpoints } from "@/lib/endpoints";
import { useAuth } from "@/contexts/AuthContext";

interface ApprovedSalesViewProps {
  approvedTransactions: SalesTransaction[];
  viewTransaction: (transactionId: any) => void;
  loadingTransaction: boolean;
  addAbono?: (transactionId: any) => void;
  onRefreshPendingEvidence?: (fn: () => Promise<void>) => void;
}

export const ApprovedSalesView: React.FC<ApprovedSalesViewProps> = ({
  approvedTransactions,
  viewTransaction,
  loadingTransaction,
  addAbono,
  onRefreshPendingEvidence,
}) => {
  const { user, isAdmin } = useAuth();
  const [unpaidTransactions, setUnpaidTransactions] = useState<
    SalesTransaction[]
  >([]);
  const [paidTransactions, setPaidTransactions] = useState<SalesTransaction[]>(
    []
  );
  const [pendingEvidence, setPendingEvidence] = useState<any[]>([]);
  const [approvedEvidence, setApprovedEvidence] = useState<any[]>([]);
  const [invoicedEvidence, setInvoicedEvidence] = useState<any[]>([]);

  const [loadingUnpaid, setLoadingUnpaid] = useState(false);
  const [loadingPaid, setLoadingPaid] = useState(false);
  const [loadingEvidence, setLoadingEvidence] = useState(false);
  const [loadingApprovedEvidence, setLoadingApprovedEvidence] = useState(false);
  const [loadingInvoicedEvidence, setLoadingInvoicedEvidence] = useState(false);

  // Pagination state for each column
  const [currentPages, setCurrentPages] = useState({
    "Pendiente por Pago": 1,
    "Abonos Pendientes Por Aprobación": 1,
    "Abonos Aprobados": 1,
    "Facturas Gestionadas": 1,
    "Ventas Pagas": 1,
  });

  const ITEMS_PER_PAGE = 4;

  // Estados para filtros
  const [nameFilter, setNameFilter] = useState("");
  const [packageFilter, setPackageFilter] = useState("all");



  // Cargar transacciones no pagadas del usuario
  useEffect(() => {
    const fetchUnpaidTransactions = async () => {
      if (!user?.id) {
        return;
      }

      setLoadingUnpaid(true);
      try {
        const url = endpoints.transactions.getUserUnpaid(user.id.toString());
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          // Extraer el array 'transactions' del objeto
          const transactionsArray = data.transactions.reverse() || [];
          // Asegurar que transactionsArray sea un array
          setUnpaidTransactions(
            Array.isArray(transactionsArray) ? transactionsArray : []
          );
        } else {
          console.error(
            "Error fetching unpaid transactions - Status:",
            response.status
          );
          setUnpaidTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching unpaid transactions:", error);
        setUnpaidTransactions([]);
      } finally {
        setLoadingUnpaid(false);
      }
    };

    fetchUnpaidTransactions();
  }, [user?.id]);

  // Cargar transacciones pagadas del usuario
  useEffect(() => {
    const fetchPaidTransactions = async () => {
      if (!user?.id) {
        return;
      }

      setLoadingPaid(true);
      try {
        const url = endpoints.transactions.getUserPaid(user.id.toString());
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          // Extraer el array 'transactions' del objeto
          const transactionsArray = data.transactions || [];
          // Asegurar que transactionsArray sea un array
          setPaidTransactions(
            Array.isArray(transactionsArray) ? transactionsArray : []
          );
        } else {
          console.error(
            "Error fetching paid transactions - Status:",
            response.status
          );
          setPaidTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching paid transactions:", error);
        setPaidTransactions([]);
      } finally {
        setLoadingPaid(false);
      }
    };

    fetchPaidTransactions();
  }, [user?.id]);

  
  const fetchPendingEvidence = async () => {
    if (!user?.id) {
      return;
    }

    setLoadingEvidence(true);
    try {
      // Usar el endpoint getPendingToApproved para evidencias pendientes de aprobación
      const url = endpoints.evidence.getPendingToApproved;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        // Asegurar que data sea un array y filtrar por usuario si no es admin
        const filteredEvidence = Array.isArray(data) ? data : [];

        const userFilteredEvidence = isAdmin
          ? filteredEvidence
          : filteredEvidence.filter((evidence) => {
              const sellerId =
                evidence.transaction_info?.seller?.id?.toString();
              const userId = user?.id?.toString();
              return sellerId === userId;
            });

        setPendingEvidence(userFilteredEvidence.reverse());
      } else {
        console.error(
          "Error fetching pending evidence - Status:",
          response.status
        );
        setPendingEvidence([]);
      }
    } catch (error) {
      console.error("Error fetching pending evidence:", error);
      setPendingEvidence([]);
    } finally {
      setLoadingEvidence(false);
    }
  };

  // Exponer la función de actualización al padre
  React.useEffect(() => {
    if (onRefreshPendingEvidence) {
      onRefreshPendingEvidence(fetchPendingEvidence);
    }
  }, [onRefreshPendingEvidence]);

  // Cargar evidencias pendientes de aprobación
  useEffect(() => {
    fetchPendingEvidence();
  }, [user?.id, isAdmin]);

  // Cargar evidencias aprobadas
  useEffect(() => {
    const fetchApprovedEvidence = async () => {
      if (!user?.id) {
        return;
      }

      setLoadingApprovedEvidence(true);
      try {
        // Usar el endpoint getPendingEvidence para evidencias aprobadas
        const url = endpoints.evidence.getPendingEvidence;
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          // Asegurar que data sea un array y filtrar por usuario si no es admin
          const filteredEvidence = Array.isArray(data) ? data : [];

          const userFilteredEvidence = isAdmin
            ? filteredEvidence
            : filteredEvidence.filter((evidence) => {
                const sellerId =
                  evidence.transaction_info?.seller?.id?.toString();
                const userId = user?.id?.toString();
                return sellerId === userId;
              });

          setApprovedEvidence(userFilteredEvidence);
        } else {
          console.error(
            "Error fetching approved evidence - Status:",
            response.status
          );
          setApprovedEvidence([]);
        }
      } catch (error) {
        console.error("Error fetching approved evidence:", error);
        setApprovedEvidence([]);
      } finally {
        setLoadingApprovedEvidence(false);
      }
    };

    fetchApprovedEvidence();
  }, [user?.id, isAdmin]);

  // Cargar facturas gestionadas
  useEffect(() => {
    const fetchInvoicedEvidence = async () => {
      if (!user?.id) {
        return;
      }

      setLoadingInvoicedEvidence(true);
      try {
        const url = endpoints.evidence.getInvoicedEvidence;

        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          // Asegurar que data sea un array y filtrar por usuario si no es admin
          const filteredEvidence = Array.isArray(data) ? data : [];

          const userFilteredEvidence = isAdmin
            ? filteredEvidence
            : filteredEvidence.filter((evidence) => {
                const sellerId =
                  evidence.transaction_info?.seller?.id?.toString();
                const userId = user?.id?.toString();
                return sellerId === userId;
              });

          setInvoicedEvidence(userFilteredEvidence);
        } else {
          setInvoicedEvidence([]);
        }
      } catch (error) {
        console.error("Error fetching invoiced evidence:", error);
        setInvoicedEvidence([]);
      } finally {
        setLoadingInvoicedEvidence(false);
      }
    };

    fetchInvoicedEvidence();
  }, [user?.id, isAdmin]);

  // Función para generar factura
  const generateInvoice = async (transactionId: number | string) => {
    try {
      const response = await fetch(
        "https://elder-link-staging-n8n.fwoasm.easypanel.host/webhook/382a0ee7-7fcb-415f-a5a2-aaf8c94b5c4d",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transaction_id: transactionId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al generar la factura");
      }

      const result = await response.json();

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

        const pdfBytes = base64ToUint8Array(result.data);
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);

        window.open(blobUrl, "_blank");
      } else {
        alert("Factura generada exitosamente");
      }
    } catch (error) {
      console.error("Error al generar la factura:", error);
      alert("Error al generar la factura");
      throw error;
    }
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setNameFilter("");
    setPackageFilter("all");
  };

  // Función para filtrar transacciones
  const filterTransactions = (transactions: SalesTransaction[]) => {
    return transactions.filter((transaction) => {
      const matchesName =
        nameFilter === "" ||
        transaction.client_name
          ?.toLowerCase()
          .includes(nameFilter.toLowerCase());

      const matchesPackage =
        packageFilter === "all" ||
        packageFilter === "" ||
        transaction.package?.toLowerCase() === packageFilter.toLowerCase();

      return matchesName && matchesPackage;
    });
  };

  // Función para filtrar evidencias (para abonos)
  const filterEvidence = (evidence: any[]) => {
    return evidence.filter((item) => {
      const matchesName =
        nameFilter === "" ||
        item.transaction_info?.client_name
          ?.toLowerCase()
          .includes(nameFilter.toLowerCase());

      const matchesPackage =
        packageFilter === "all" ||
        packageFilter === "" ||
        item.transaction_info?.package?.toLowerCase() ===
          packageFilter.toLowerCase();

      return matchesName && matchesPackage;
    });
  };

  // Asegurar que las transacciones sean siempre arrays
  const safeUnpaidTransactions = Array.isArray(unpaidTransactions)
    ? unpaidTransactions
    : [];
  const safePaidTransactions = Array.isArray(paidTransactions)
    ? paidTransactions
    : [];

  // Paquetes fijos disponibles
  const availablePackages = [
    "internacional",
    "terrestre",
    "migratorio",
    "nacional",
  ];

  // Aplicar filtros a cada grupo
  // Primero filtrar por usuario si no es admin, luego aplicar filtros de búsqueda
  const userFilteredUnpaidTransactions = isAdmin 
    ? safeUnpaidTransactions 
    : safeUnpaidTransactions.filter(transaction => {
        const sellerId = transaction.seller_id?.toString();
        const userId = user?.id?.toString();
        return sellerId === userId;
      });
  
  const userFilteredPaidTransactions = isAdmin 
    ? safePaidTransactions 
    : safePaidTransactions.filter(transaction => {
        const sellerId = transaction.seller_id?.toString();
        const userId = user?.id?.toString();
        return sellerId === userId;
      });

  const filteredUnpaidTransactions = filterTransactions(userFilteredUnpaidTransactions);
  const filteredPendingEvidence = filterEvidence(pendingEvidence);
  const filteredApprovedEvidence = filterEvidence(approvedEvidence);
  const filteredInvoicedEvidence = filterEvidence(invoicedEvidence);
  const filteredPaidTransactions = filterTransactions(userFilteredPaidTransactions);

  const kanbanGroups = {
    "Pendiente por Pago": filteredUnpaidTransactions,
    "Abonos Pendientes Por Aprobación": filteredPendingEvidence,
    "Abonos Aprobados": filteredApprovedEvidence,
    "Facturas Gestionadas": filteredInvoicedEvidence,
    "Ventas Pagas": filteredPaidTransactions,
  };

  // Pagination utility functions
  const getPaginatedData = (data: any[], columnName: string) => {
    const currentPage = currentPages[columnName as keyof typeof currentPages];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (dataLength: number) => {
    return Math.ceil(dataLength / ITEMS_PER_PAGE);
  };

  const handlePageChange = (columnName: string, newPage: number) => {
    setCurrentPages((prev) => ({
      ...prev,
      [columnName]: newPage,
    }));
  };

  // Pagination component
  const PaginationControls = ({
    columnName,
    data,
  }: {
    columnName: string;
    data: any[];
  }) => {
    const totalPages = getTotalPages(data.length);
    const currentPage = currentPages[columnName as keyof typeof currentPages];

    if (data.length <= ITEMS_PER_PAGE) {
      return null;
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePageChange(columnName, 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePageChange(columnName, currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-gray-600 px-2">
          {currentPage} de {totalPages}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePageChange(columnName, currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePageChange(columnName, totalPages)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };



  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <div className="text-sm font-medium text-yellow-700">
                  Pendientes por Pago
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredUnpaidTransactions.length}
                </div>
                <div className="text-xs text-yellow-500">Esperando pago</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="text-sm font-medium text-green-700">
                  Ventas Pagas
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {filteredPaidTransactions.length}
                </div>
                <div className="text-xs text-green-500">
                  Completamente pagadas
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
          <div className="flex flex-row gap-4">
            {/* Filtro por nombre */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Buscar por nombre
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nombre del cliente..."
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className="pl-10 w-[300px]"
                />
              </div>
            </div>

            {/* Filtro por paquete */}
            <div className="space-y-2 w-[300px]">
              <label className="text-sm font-medium text-gray-700">
                Paquete
              </label>
              <Select value={packageFilter} onValueChange={setPackageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paquete..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los paquetes</SelectItem>
                  {availablePackages.map((pkg, index) => (
                    <SelectItem key={`${pkg}-${index}`} value={pkg}>
                      {pkg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botón limpiar filtros */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                &nbsp;
              </label>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full flex items-center gap-2"
                disabled={nameFilter === "" && packageFilter === "all"}
              >
                <X className="h-4 w-4" />
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <Card className="stats-card">
        <CardHeader>
          <CardTitle>Gestión de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <div id="kanban-board" className="w-full overflow-hidden">
            <div className="flex gap-6 pb-4 min-w-max overflow-x-auto max-w-full">
              {/* Pendiente por Pago Column */}
              <div className="kanban-column border-t-4 border-yellow-400 w-80 flex-shrink-0">
                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                  <h3 className="font-semibold">Pendiente por Pago</h3>
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {loadingUnpaid ? "..." : filteredUnpaidTransactions.length}
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[60vh]">
                  {loadingUnpaid ? (
                    <div className="text-center py-4 text-gray-500">
                      Cargando transacciones pendientes...
                    </div>
                  ) : !filteredUnpaidTransactions ||
                    filteredUnpaidTransactions.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No hay transacciones pendientes
                    </div>
                  ) : (
                    getPaginatedData(
                      filteredUnpaidTransactions,
                      "Pendiente por Pago"
                    ).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="kanban-card border-l-yellow-400 bg-yellow-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-2">
                              {transaction.client_name?.charAt(0) || "?"}
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {transaction.client_name || "Sin nombre"}
                              </h4>
                              <span className="text-xs text-gray-500">
                                Vendedor:{" "}
                                {transaction.seller_name || "Sin vendedor"}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm font-semibold">
                            ${transaction.amount || 0}
                          </span>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm">
                            {transaction.package || "Sin paquete"}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {transaction.start_date
                                ? new Date(
                                    transaction.start_date
                                  ).toLocaleDateString()
                                : "Sin fecha"}
                            </span>
                            <Badge
                              variant="secondary"
                              className="bg-yellow-100 text-yellow-800"
                            >
                              Pendiente
                            </Badge>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                              onClick={() => viewTransaction(transaction.id)}
                              disabled={loadingTransaction}
                            >
                              Ver Detalles
                            </Button>
                            {addAbono && (
                              <Button
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={() => addAbono(transaction.id)}
                              >
                                Agregar Abono
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <PaginationControls
                  columnName="Pendiente por Pago"
                  data={filteredUnpaidTransactions}
                />
              </div>

              {/* Abonos Pendientes Por Aprobación Column */}
              <div className="kanban-column border-t-4 border-orange-400 w-80 flex-shrink-0">
                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 mr-2 text-orange-500" />
                  <h3 className="font-semibold">
                    Abonos Pendientes Por Aprobación
                  </h3>
                  <span className="ml-2 bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {loadingEvidence ? "..." : filteredPendingEvidence.length}
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[60vh]">
                  {loadingEvidence ? (
                    <div className="text-center py-4 text-gray-500">
                      Cargando evidencias pendientes...
                    </div>
                  ) : !filteredPendingEvidence ||
                    filteredPendingEvidence.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No hay evidencias pendientes
                    </div>
                  ) : (
                    getPaginatedData(
                      filteredPendingEvidence,
                      "Abonos Pendientes Por Aprobación"
                    ).map((evidence) => (
                      <div
                        key={evidence.id}
                        className="kanban-card border-l-orange-400 bg-orange-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2">
                              {evidence.transaction_info?.client_name?.charAt(
                                0
                              ) || "?"}
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {evidence.transaction_info?.client_name ||
                                  "Sin nombre"}
                              </h4>
                              <span className="text-xs text-gray-500">
                                Vendedor:{" "}
                                {evidence.transaction_info?.seller?.name ||
                                  "Sin vendedor"}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm font-semibold">
                            ${evidence.amount || 0}
                          </span>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm">
                            {evidence.transaction_info?.package ||
                              "Sin paquete"}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {evidence.transaction_info?.start_date
                                ? new Date(
                                    evidence.transaction_info.start_date
                                  ).toLocaleDateString()
                                : "Sin fecha"}
                            </span>
                            <Badge
                              variant="secondary"
                              className="bg-orange-100 text-orange-800"
                            >
                              Pendiente Aprobación
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            className="w-full mt-2 bg-orange-600 hover:bg-orange-700"
                            onClick={() =>
                              viewTransaction(evidence.transaction_id)
                            }
                            disabled={loadingTransaction}
                          >
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <PaginationControls
                  columnName="Abonos Pendientes Por Aprobación"
                  data={filteredPendingEvidence}
                />
              </div>

              {/* Abonos Aprobados Column */}
              <div className="kanban-column border-t-4 border-purple-400 w-80 flex-shrink-0">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-5 w-5 mr-2 text-purple-500" />
                  <h3 className="font-semibold">Abonos Aprobados</h3>
                  <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {loadingApprovedEvidence
                      ? "..."
                      : filteredApprovedEvidence.length}
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[60vh]">
                  {loadingApprovedEvidence ? (
                    <div className="text-center py-4 text-gray-500">
                      Cargando abonos aprobados...
                    </div>
                  ) : !filteredApprovedEvidence ||
                    filteredApprovedEvidence.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No hay abonos aprobados
                    </div>
                  ) : (
                    getPaginatedData(
                      filteredApprovedEvidence,
                      "Abonos Aprobados"
                    ).map((evidence) => (
                      <div
                        key={evidence.id}
                        className="kanban-card border-l-purple-400 bg-purple-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2">
                              {evidence.transaction_info?.client_name?.charAt(
                                0
                              ) || "?"}
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {evidence.transaction_info?.client_name ||
                                  "Sin nombre"}
                              </h4>
                              <span className="text-xs text-gray-500">
                                Vendedor:{" "}
                                {evidence.transaction_info?.seller?.name ||
                                  "Sin vendedor"}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm font-semibold">
                            ${evidence.amount || 0}
                          </span>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm">
                            {evidence.transaction_info?.package ||
                              "Sin paquete"}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {evidence.transaction_info?.start_date
                                ? new Date(
                                    evidence.transaction_info.start_date
                                  ).toLocaleDateString()
                                : "Sin fecha"}
                            </span>
                            <Badge
                              variant="default"
                              className="bg-purple-100 text-purple-800"
                            >
                              Abono Aprobado
                            </Badge>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-purple-600 hover:bg-purple-700"
                              onClick={() =>
                                viewTransaction(evidence.transaction_id)
                              }
                              disabled={loadingTransaction}
                            >
                              Ver Detalles
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                              onClick={() =>
                                generateInvoice(evidence.transaction_id)
                              }
                            >
                              Generar Factura
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <PaginationControls
                  columnName="Abonos Aprobados"
                  data={filteredApprovedEvidence}
                />
              </div>

              {/* Facturas Gestionadas Column */}
              <div className="kanban-column border-t-4 border-blue-400 w-80 flex-shrink-0">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
                  <h3 className="font-semibold">Facturas Gestionadas</h3>
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {loadingInvoicedEvidence
                      ? "..."
                      : filteredInvoicedEvidence.length}
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[60vh]">
                  {loadingInvoicedEvidence ? (
                    <div className="text-center py-4 text-gray-500">
                      Cargando facturas gestionadas...
                    </div>
                  ) : !filteredInvoicedEvidence ||
                    filteredInvoicedEvidence.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No hay facturas gestionadas
                    </div>
                  ) : (
                    getPaginatedData(
                      filteredInvoicedEvidence,
                      "Facturas Gestionadas"
                    ).map((evidence) => (
                      <div
                        key={evidence.id}
                        className="kanban-card border-l-blue-400 bg-blue-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                              {evidence.transaction_info?.client_name?.charAt(
                                0
                              ) || "?"}
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {evidence.transaction_info?.client_name ||
                                  "Sin nombre"}
                              </h4>
                              <span className="text-xs text-gray-500">
                                Vendedor:{" "}
                                {evidence.transaction_info?.seller?.name ||
                                  "Sin vendedor"}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm font-semibold">
                            ${evidence.amount || 0}
                          </span>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm">
                            {evidence.transaction_info?.package ||
                              "Sin paquete"}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {evidence.transaction_info?.start_date
                                ? new Date(
                                    evidence.transaction_info.start_date
                                  ).toLocaleDateString()
                                : "Sin fecha"}
                            </span>
                            <Badge
                              variant="default"
                              className="bg-blue-100 text-blue-800"
                            >
                              Facturada
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                            onClick={() =>
                              viewTransaction(evidence.transaction_id)
                            }
                            disabled={loadingTransaction}
                          >
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <PaginationControls
                  columnName="Facturas Gestionadas"
                  data={filteredInvoicedEvidence}
                />
              </div>

              {/* Ventas Pagas Column */}
              <div className="kanban-column border-t-4 border-green-400 w-80 flex-shrink-0">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <h3 className="font-semibold">Ventas Pagas</h3>
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {loadingPaid ? "..." : filteredPaidTransactions.length}
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[60vh]">
                  {loadingPaid ? (
                    <div className="text-center py-4 text-gray-500">
                      Cargando ventas pagas...
                    </div>
                  ) : !filteredPaidTransactions ||
                    filteredPaidTransactions.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No hay ventas pagas
                    </div>
                  ) : (
                    getPaginatedData(
                      filteredPaidTransactions,
                      "Ventas Pagas"
                    ).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="kanban-card border-l-green-400 bg-green-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">
                              {transaction.client_name?.charAt(0) || "?"}
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {transaction.client_name || "Sin nombre"}
                              </h4>
                              <span className="text-xs text-gray-500">
                                Vendedor:{" "}
                                {transaction.seller_name || "Sin vendedor"}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm font-semibold">
                            ${transaction.amount || 0}
                          </span>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm">
                            {transaction.package || "Sin paquete"}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {transaction.start_date
                                ? new Date(
                                    transaction.start_date
                                  ).toLocaleDateString()
                                : "Sin fecha"}
                            </span>
                            <Badge
                              variant="default"
                              className="bg-green-100 text-green-800"
                            >
                              Pagada
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            className="w-full mt-2 bg-green-600 hover:bg-green-700"
                            onClick={() => viewTransaction(transaction.id)}
                            disabled={loadingTransaction}
                          >
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <PaginationControls
                  columnName="Ventas Pagas"
                  data={filteredPaidTransactions}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
