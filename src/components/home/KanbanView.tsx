import { DragEvent } from "react";
import { Button } from "../ui/button";
import { Clock, Check, X } from "lucide-react";
import { SalesTransaction } from "../../types/sales";
import { useAuth } from "../../contexts/AuthContext";

interface KanbanViewProps {
  kanbanGroups: {
    "Pendiente": SalesTransaction[];
    "Aprobado": SalesTransaction[];
    "Terminado": SalesTransaction[];
    "Rechazado": SalesTransaction[];
  };
  onDrop: (e: DragEvent<HTMLDivElement>, targetStatus: "Pendiente" | "Aprobado" | "Rechazado" | "Terminado") => void;
  allowDrop: (e: DragEvent<HTMLDivElement>) => void;
  loadingTransaction: boolean;
  startDrag: (e: DragEvent<HTMLDivElement>, transactionId: string) => void;
  onCompleteInfo: (transactionId: number) => void;
  viewTransaction: (transactionId: any) => void;
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Pending Column */}
      <div
        className="kanban-column border-t-4 border-blue-400"
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

        <div className="space-y-3">
          {kanbanGroups["Pendiente"].map((transaction) => (
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
      </div>

      {/* Approved Column */}
      <div
        className="kanban-column border-t-4 border-yellow-400"
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

        <div className="space-y-3">
          {kanbanGroups["Aprobado"].map((transaction) => (
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
                {isSeller && transaction.seller_id === user?.id && (
                  <Button
                    size="sm"
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => onCompleteInfo(transaction.id)}
                  >
                    Completar Información
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminado Column */}
      <div
        className="kanban-column border-t-4 border-green-400"
        onDrop={(e) => onDrop(e, "Terminado")}
        onDragOver={allowDrop}
      >
        <div className="flex items-center mb-4">
          <Check className="h-5 w-5 mr-2 text-green-500" />
          <h3 className="font-semibold">Completadas</h3>
          <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {kanbanGroups["Terminado"].length}
          </span>
        </div>

        <div className="space-y-3">
          {kanbanGroups["Terminado"].map((transaction) => (
            <div
              key={transaction.id}
              draggable
              onDragStart={(e) => startDrag(e, transaction.id.toString())}
              className="kanban-card border-l-green-400"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">
                    {transaction.client_name.charAt(0)} 
                    {/* {transaction.id} */}
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
                  <span className="status-badge status-success">Terminado</span>
                </div>
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
                  <Button
                    size="sm"
                    className="w-full mt-2 bg-gray-600 hover:bg-gray-700"
                    onClick={() => generateInvoice(transaction.id)}
                  >
                    Generar Factura
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rejected Column */}
      <div
        className="kanban-column border-t-4 border-red-400"
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

        <div className="space-y-3">
          {kanbanGroups["Rechazado"].map((transaction) => (
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
      </div>
    </div>
  );
}; 