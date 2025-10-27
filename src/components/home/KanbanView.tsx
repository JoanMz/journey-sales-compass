import { DragEvent, useState } from "react";
import { Button } from "../ui/button";
import { Clock, Check, X, FileText, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { SalesTransaction } from "../../types/sales";
import { useAuth } from "../../contexts/AuthContext";
import { Badge } from "../ui/badge";

interface KanbanViewProps {
  kanbanGroups: {
    "Pendiente": SalesTransaction[];
    "Aprobado": SalesTransaction[];
    "Rechazado": SalesTransaction[];
    "Incompleta": SalesTransaction[];
  };
  onDrop: (e: DragEvent<HTMLDivElement>, targetStatus: "Pendiente" | "Aprobado" | "Rechazado" | "Incompleta") => void;
  allowDrop: (e: DragEvent<HTMLDivElement>) => void;
  loadingTransaction: boolean;
  startDrag: (e: DragEvent<HTMLDivElement>, transactionId: string) => void;
  onCompleteInfo: (transactionId: number) => void;
  viewTransaction: (transactionId: any, isForContract?: boolean) => void;
  generateInvoice: (transactionId: any) => void;
}

export const KanbanView = ({
  kanbanGroups,
  onDrop,
  loadingTransaction,
  allowDrop,
  startDrag,
  onCompleteInfo,
  viewTransaction,
  generateInvoice
}: KanbanViewProps) => {
  const { isSeller, user } = useAuth();

  // Pagination state for each column
  const [currentPages, setCurrentPages] = useState({
    "Incompleta": 1,
    "Pendiente": 1,
    "Aprobado": 1,
    "Rechazado": 1,
  });

  const ITEMS_PER_PAGE = 5; // Cambiar a 5 para la vista de ventas aprobadas    

  // Pagination utility functions
  const getPaginatedData = (data: SalesTransaction[], columnName: string) => {
    const currentPage = currentPages[columnName as keyof typeof currentPages];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (dataLength: number) => {
    return Math.ceil(dataLength / ITEMS_PER_PAGE);
  };

  const handlePageChange = (columnName: string, newPage: number) => {
    setCurrentPages(prev => ({
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
    data: SalesTransaction[];
  }) => {
    const totalPages = getTotalPages(data.length);
    const currentPage = currentPages[columnName as keyof typeof currentPages];

    if (data.length <= ITEMS_PER_PAGE) {
      return null;
    }

    return (
      <div className="flex items-center justify-center gap-1 sm:gap-2 mt-4 pt-4 border-t">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePageChange(columnName, 1)}
          disabled={currentPage === 1}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
        >
          <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePageChange(columnName, currentPage - 1)}
          disabled={currentPage === 1}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <span className="text-xs sm:text-sm text-gray-600 px-1 sm:px-2">
          {currentPage} de {totalPages}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePageChange(columnName, currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
        >
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePageChange(columnName, totalPages)}
          disabled={currentPage === totalPages}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
        >
          <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Incompletas Column */}
      <div
        className="kanban-column border-t-4 border-orange-400 min-h-[400px] flex flex-col"
        onDrop={(e) => onDrop(e, "Incompleta")}
        onDragOver={allowDrop}
      >
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 mr-2 text-orange-500" />
          <h3 className="font-semibold">Incompletas</h3>
          <span className="ml-2 bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {kanbanGroups["Incompleta"].length}
          </span>
        </div>

        <div className="space-y-3 flex-1">
          {getPaginatedData(kanbanGroups["Incompleta"], "Incompleta").map((transaction) => (
            <div
              key={transaction.id}
              draggable
              onDragStart={(e) => startDrag(e, transaction.id.toString())}
              className="kanban-card border-l-orange-400"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2">
                    {transaction.client_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium">{transaction.client_name}</h4>
                    <span className="text-xs text-gray-500">Vendedor: {transaction.seller_name}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold">${transaction.amount}</span>
              </div>

              <div className="mt-3">
                <p className="text-sm">{transaction.package}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(transaction.start_date).toLocaleDateString()}
                  </span>
                  <span className="status-badge bg-orange-100 text-orange-800">Incompleta</span>
                </div>
                {isSeller && transaction.seller_id === user?.id && (
                  <Button
                    size="sm"
                    className="w-full mt-2 bg-orange-600 hover:bg-orange-700"
                    onClick={() => onCompleteInfo(transaction.id)}
                  >
                    Completar Información
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <PaginationControls
          columnName="Incompleta"
          data={kanbanGroups["Incompleta"]}
        />
      </div>

      {/* Pending Column */}
      <div
        className="kanban-column border-t-4 border-blue-400 min-h-[400px] flex flex-col"
        onDrop={(e) => onDrop(e, "Pendiente")}
        onDragOver={allowDrop}
      >
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 mr-2 text-blue-500" />
          <h3 className="font-semibold">Pendientes</h3>
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {kanbanGroups["Pendiente"].length}
          </span>
        </div>

        <div className="space-y-3 flex-1">
          {getPaginatedData(kanbanGroups["Pendiente"], "Pendiente").map((transaction) => (
            <div
              key={transaction.id}
              draggable
              onDragStart={(e) => startDrag(e, transaction.id.toString())}
              className="kanban-card border-l-blue-400"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                    {transaction.client_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium">{transaction.client_name}</h4>
                    <span className="text-xs text-gray-500">Vendedor: {transaction.seller_name}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold">${transaction.amount}</span>
              </div>

              <div className="mt-3">
                <p className="text-sm">{transaction.package}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(transaction.start_date).toLocaleDateString()}
                  </span>
                  <span className="status-badge status-process">Pendiente</span>
                </div>

              </div>
            </div>
          ))}
        </div>
        <PaginationControls
          columnName="Pendiente"
          data={kanbanGroups["Pendiente"]}
        />
      </div>

      {/* Approved Column */}
      <div
        className="kanban-column border-t-4 border-yellow-400 min-h-[400px] flex flex-col"
        onDrop={(e) => onDrop(e, "Aprobado")}
        onDragOver={allowDrop}
      >
        <div className="flex items-center mb-4">
          <Check className="h-5 w-5 mr-2 text-yellow-500" />
          <h3 className="font-semibold">Aprobadas</h3>
          <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {kanbanGroups["Aprobado"].length}
          </span>
        </div>

        <div className="space-y-3 flex-1">
          {getPaginatedData(kanbanGroups["Aprobado"], "Aprobado").map((transaction) => (
            <div
              key={transaction.id}
              draggable
              onDragStart={(e) => startDrag(e, transaction.id.toString())}
              className="kanban-card border-l-yellow-400"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-2">
                    {transaction.client_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium">{transaction.client_name}</h4>
                    <span className="text-xs text-gray-500">Vendedor: {transaction.seller_name}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold">${transaction.amount}</span>
              </div>

              <div className="mt-3">
                <p className="text-sm">{transaction.package}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(transaction.start_date).toLocaleDateString()}
                  </span>
                  <span className="status-badge bg-yellow-100 text-yellow-800">Aprobado</span>
                </div>
                
                {/* Mostrar estado de facturación si hay evidencias */}
                {transaction.evidence && transaction.evidence.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <FileText className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600">Evidencia:</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        transaction.evidence[0].invoice_status === 'facturado' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-orange-50 text-orange-700 border-orange-200'
                      }`}
                    >
                      {transaction.evidence[0].invoice_status}
                    </Badge>
                  </div>
                )}
                {isSeller && transaction.seller_id === user?.id && (
                  <Button
                    size="sm"
                    className="w-full mt-2 bg-green-600 hover:bg-green-700"
                    onClick={() => viewTransaction(transaction.id)}
                    disabled={loadingTransaction}
                  >
                    Ver Información
                  </Button>
                )}
                {isSeller && transaction.seller_id === user?.id && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gray-600 hover:bg-gray-700"
                      onClick={() => viewTransaction(transaction.id, true)}
                    >
                      Generar Contrato
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => generateInvoice(transaction.id)}
                    >
                      Generar Factura
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <PaginationControls
          columnName="Aprobado"
          data={kanbanGroups["Aprobado"]}
        />
      </div>



      {/* Rejected Column */}
      <div
        className="kanban-column border-t-4 border-red-400 min-h-[400px] flex flex-col"
        onDrop={(e) => onDrop(e, "Rechazado")}
        onDragOver={allowDrop}
      >
        <div className="flex items-center mb-4">
          <X className="h-5 w-5 mr-2 text-red-500" />
          <h3 className="font-semibold">Rechazadas</h3>
          <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {kanbanGroups["Rechazado"].length}
          </span>
        </div>

        <div className="space-y-3 flex-1">
          {getPaginatedData(kanbanGroups["Rechazado"], "Rechazado").map((transaction) => (
            <div
              key={transaction.id}
              draggable
              onDragStart={(e) => startDrag(e, transaction.id.toString())}
              className="kanban-card border-l-red-400"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2">
                    {transaction.client_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium">{transaction.client_name}</h4>
                    <span className="text-xs text-gray-500">Vendedor: {transaction.seller_name}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold">${transaction.amount}</span>
              </div>

              <div className="mt-3">
                <p className="text-sm">{transaction.package}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(transaction.start_date).toLocaleDateString()}
                  </span>
                  <span className="status-badge status-canceled">Rechazado</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <PaginationControls
          columnName="Rechazado"
          data={kanbanGroups["Rechazado"]}
        />
      </div>
    </div>
  );
}; 