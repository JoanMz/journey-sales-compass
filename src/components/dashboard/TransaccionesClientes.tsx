import React, { useState } from "react";
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
import { Eye, Trash2, MoreHorizontal, X } from "lucide-react";
import {
  Sale,
  TransaccionesClientesProps,
  TransactionStatus,
  useData,
} from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import endpoints from "@/lib/endpoints";

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
  const { sales, loading, error } = useData();

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedRows((prev) =>
      prev.length === sales.length && sales.length > 0
        ? []
        : sales.map((sale) => sale.id)
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
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedRows.length === sales.length && sales.length > 0
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
            {sales.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No hay transacciones disponibles.
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => {
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
      </div>

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
    </>
  );
};

export default TransaccionesClientes;
