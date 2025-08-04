import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Trash2, MoreHorizontal, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Filter } from "lucide-react";
import {
  Sale,
  TransaccionesClientesProps,
  TransactionStatus,
  useData,
} from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { endpoints } from "@/lib/endpoints";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { es } from "date-fns/locale";

export const mapStatusToStyle = (status: TransactionStatus): string => {
  switch (status) {
    case "aprobado":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "pendiente":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "rechazado":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "terminado":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    default:
      return "";
  }
};

const TransaccionesClientes: React.FC<TransaccionesClientesProps> = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [loadingTransaction, setLoadingTransaction] = useState(false);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Estados de filtros
  const [filters, setFilters] = useState({
    id: "",
    customerName: "",
    package: "",
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
    amount: "",
    status: "all",
  });
  
  const { sales, loading, error } = useData();

  // Función para aplicar filtros
  const applyFilters = (data: Sale[]) => {
    return data.filter((sale) => {
      const matchesId = filters.id === "" || sale.id.toLowerCase().includes(filters.id.toLowerCase());
      const matchesCustomerName = filters.customerName === "" || sale.customerName.toLowerCase().includes(filters.customerName.toLowerCase());
      const matchesPackage = filters.package === "" || sale.package.toLowerCase().includes(filters.package.toLowerCase());
      const matchesDate = !filters.dateFrom && !filters.dateTo || (
        filters.dateFrom && filters.dateTo && 
        isWithinInterval(
          new Date(sale.date), 
          { 
            start: startOfDay(filters.dateFrom), 
            end: endOfDay(filters.dateTo) 
          }
        )
      );
      const matchesAmount = filters.amount === "" || sale.amount.toString().includes(filters.amount);
      const matchesStatus = filters.status === "all" || sale.status.toLowerCase() === filters.status.toLowerCase();
      
      return matchesId && matchesCustomerName && matchesPackage && matchesDate && matchesAmount && matchesStatus;
    });
  };

  // Datos filtrados
  const filteredSales = applyFilters(sales);

  // Cálculos de paginación
  const totalItems = filteredSales.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displaySales = filteredSales.slice(startIndex, endIndex);

  // Resetear a la primera página cuando cambian los datos, elementos por página o filtros
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage, itemsPerPage, filters]);

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

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Resetear a la primera página
  };

  // Funciones para manejar filtros
  const handleFilterChange = (field: keyof typeof filters, value: string | Date | null) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Resetear a la primera página cuando cambian los filtros
  };

  const clearAllFilters = () => {
    setFilters({
      id: "",
      customerName: "",
      package: "",
      dateFrom: null,
      dateTo: null,
      amount: "",
      status: "all",
    });
    setCurrentPage(1);
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedRows((prev) =>
      prev.length === displaySales.length && displaySales.length > 0
        ? []
        : displaySales.map((sale) => sale.id)
    );
  };

  const handleViewTransaction = async (transactionId: string) => {
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
  };

  // Componente de paginación
  const Pagination = () => {
    if (totalItems <= 1) return null;

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
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} transacciones
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Mostrar:</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="30">30</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">por página</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Botón Primera página */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          
          {/* Botón Página anterior */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
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
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {/* Botón Última página */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error && sales.length === 0) {
    return (
      <div className="text-center py-6 text-red-600">
        <p>
          {error}. Por favor, inténtalo de nuevo más tarde o revisa tu conexión.
        </p>
      </div>
    );
  }

  return (
    <Card className="bg-white border-green-200">
      <CardHeader className="flex flex-col">
        <CardTitle>Transacciones Clientes</CardTitle>

        <CardDescription>
          Aquí puedes ver todas las transacciones de los clientes y filtros por cada sección.
        </CardDescription>

        <div className="flex flex-col gap-4">
          {/* Filtros - Primera fila */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro ID */}
            <div className="space-y-2">
              <Label htmlFor="filter-id" className="text-sm font-medium">ID</Label>
              <Input
                id="filter-id"
                placeholder="Buscar por ID..."
                value={filters.id}
                onChange={(e) => handleFilterChange("id", e.target.value)}
                className="h-9"
              />
            </div>

            {/* Filtro Cliente */}
            <div className="space-y-2">
              <Label htmlFor="filter-customer" className="text-sm font-medium">Cliente</Label>
              <Input
                id="filter-customer"
                placeholder="Buscar cliente..."
                value={filters.customerName}
                onChange={(e) => handleFilterChange("customerName", e.target.value)}
                className="h-9"
              />
            </div>

            {/* Filtro Paquete */}
            <div className="space-y-2">
              <Label htmlFor="filter-package" className="text-sm font-medium">Paquete</Label>
              <Input
                id="filter-package"
                placeholder="Buscar paquete..."
                value={filters.package}
                onChange={(e) => handleFilterChange("package", e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          {/* Filtros - Segunda fila */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Filtro Fecha Desde */}
            <div className="space-y-2">
              <Label htmlFor="filter-date-from" className="text-sm font-medium">Fecha Desde</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? (
                      format(filters.dateFrom, "dd/MM/yyyy", { locale: es })
                    ) : (
                      <span className="text-muted-foreground">Desde</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => handleFilterChange("dateFrom", date)}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Filtro Fecha Hasta */}
            <div className="space-y-2">
              <Label htmlFor="filter-date-to" className="text-sm font-medium">Fecha Hasta</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? (
                      format(filters.dateTo, "dd/MM/yyyy", { locale: es })
                    ) : (
                      <span className="text-muted-foreground">Hasta</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => handleFilterChange("dateTo", date)}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Filtro Monto */}
            <div className="space-y-2">
              <Label htmlFor="filter-amount" className="text-sm font-medium">Monto</Label>
              <Input
                id="filter-amount"
                placeholder="Buscar monto..."
                value={filters.amount}
                onChange={(e) => handleFilterChange("amount", e.target.value)}
                className="h-9"
              />
            </div>

            {/* Filtro Estado */}
            <div className="space-y-2">
              <Label htmlFor="filter-status" className="text-sm font-medium">Estado</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                  <SelectItem value="incompleta">Incompleta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botón para limpiar filtros */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredSales.length} de {sales.length} transacciones
              </span>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={clearAllFilters}
              className="h-8"
            >
              Limpiar filtros
            </Button>
          </div>
        </div>
      </CardHeader>


     


      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedRows.length === displaySales.length && displaySales.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Paquete</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displaySales.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No hay transacciones disponibles.
                </TableCell>
              </TableRow>
            ) : (
              displaySales.map((sale) => {
                const status = sale.status;
                return (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(sale.id)}
                        onCheckedChange={() => toggleSelectRow(sale.id)}
                      />
                    </TableCell>

                    <TableCell>{sale.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {sale.customerAvatar ? (
                            <AvatarImage
                              src={sale.customerAvatar}
                              alt={sale.customerName}
                            />
                          ) : null}
                          <AvatarFallback>
                            {sale.customerName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{sale.customerName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{sale.package}</TableCell>
                    <TableCell>
                      {new Date(sale.date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{formatCurrency(sale.amount)}</TableCell>
                    <TableCell>
                      <Badge className={mapStatusToStyle(status.toLowerCase() as TransactionStatus)}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewTransaction(sale.id)}
                          disabled={loadingTransaction}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button> */}
                        {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Paginación */}
      <Pagination />

      {/* Modal para mostrar detalles de la transacción */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Detalles de la Transacción</h2>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
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
                      <p className="text-sm text-gray-600">Nombre</p>
                      <p className="font-medium">
                        {selectedTransaction.client_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">
                        {selectedTransaction.client_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <p className="font-medium">
                        {selectedTransaction.client_phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">DNI</p>
                      <p className="font-medium">
                        {selectedTransaction.client_dni}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Dirección</p>
                      <p className="font-medium">
                        {selectedTransaction.client_address}
                      </p>
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
                      <p className="text-sm text-gray-600">Paquete</p>
                      <p className="font-medium">
                        {selectedTransaction.package}
                      </p>
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
                        className={mapStatusToStyle(selectedTransaction.status)}
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
                      <p className="text-sm text-gray-600">Monto Total</p>
                      <p className="font-medium">
                        {formatCurrency(selectedTransaction.amount)}
                      </p>
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
                                  <p className="text-sm text-gray-600">
                                    Aerolínea
                                  </p>
                                  <p className="font-medium capitalize">
                                    {itinerary.aerolinea}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Ruta</p>
                                  <p className="font-medium">
                                    {itinerary.ruta}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Hora de Salida
                                  </p>
                                  <p className="font-medium">
                                    {itinerary.hora_salida || "No especificado"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Hora de Llegada
                                  </p>
                                  <p className="font-medium">
                                    {itinerary.hora_llegada || "No especificado"}
                                  </p>
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
                                  <p className="text-sm text-gray-600">Hotel</p>
                                  <p className="font-medium">
                                    {travelInfo.hotel}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Noches
                                  </p>
                                  <p className="font-medium">
                                    {travelInfo.noches || "No especificado"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Incluye
                                  </p>
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
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    No Incluye
                                  </p>
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
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default TransaccionesClientes;
