import React, { useState, useEffect } from "react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";
import { SalesTransaction } from "@/types/sales";
import { endpoints } from "@/lib/endpoints";
import { useAuth } from "@/contexts/AuthContext";

interface ApprovedSalesViewProps {
  approvedTransactions: SalesTransaction[];
  viewTransaction: (transactionId: any) => void;
  loadingTransaction: boolean;
  addAbono?: (transactionId: any) => void;
}

export const ApprovedSalesView: React.FC<ApprovedSalesViewProps> = ({
  approvedTransactions,
  viewTransaction,
  loadingTransaction,
  addAbono,
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

  console.log("🔍 ApprovedSalesView - Componente renderizado");
  console.log("🔍 ApprovedSalesView - user?.id:", user?.id);

  // Log para verificar la información del usuario
  console.log("🔍 Debug - Información del usuario:");
  console.log("🔍 User completo:", user);
  console.log("🔍 User ID:", user?.id);
  console.log("🔍 User role:", user?.role);
  console.log("🔍 User name:", user?.name);
  console.log("🔍 User email:", user?.email);

  // Cargar transacciones no pagadas del usuario
  useEffect(() => {
    console.log("🔍 useEffect unpaid - Iniciando...");
    console.log("🔍 useEffect unpaid - user:", user);
    console.log("🔍 useEffect unpaid - user?.id:", user?.id);

    const fetchUnpaidTransactions = async () => {
      if (!user?.id) {
        console.log("🔍 useEffect unpaid - No hay user.id, saliendo...");
        return;
      }

      console.log("🔍 useEffect unpaid - Iniciando fetch...");
      setLoadingUnpaid(true);
      try {
        const url = endpoints.transactions.getUserUnpaid(user.id.toString());
        console.log("🔍 URL completa para transacciones NO pagadas:", url);
        console.log(
          "🔍 Base URL esperada: https://fastapi-data-1-nc7j.onrender.com"
        );
        console.log(
          "🔍 Endpoint esperado: /transactions/user/unpaid/{id_user}"
        );
        console.log("🔍 User ID:", user.id);
        console.log("🔍 User ID como string:", user.id.toString());

        // Verificar que la URL se construya correctamente
        const expectedUrl = `https://fastapi-data-1-nc7j.onrender.com/transactions/user/unpaid/${user.id}`;
        console.log("🔍 URL esperada:", expectedUrl);
        console.log("🔍 URLs coinciden:", url === expectedUrl);

        const response = await fetch(url);
        console.log("🔍 Response status (unpaid):", response.status);
        console.log("🔍 Response ok (unpaid):", response.ok);
        console.log("🔍 Response headers (unpaid):", response.headers);
        console.log("🔍 Response type (unpaid):", response.type);
        console.log("🔍 Response url (unpaid):", response.url);

        if (response.ok) {
          const data = await response.json();
          console.log(
            "🔍 Respuesta del endpoint /transactions/user/unpaid:",
            data
          );
          console.log("🔍 Tipo de data:", typeof data);
          console.log("🔍 Es array?", Array.isArray(data));
          console.log(
            "🔍 Longitud del array:",
            Array.isArray(data) ? data.length : "No es array"
          );
          console.log(
            "🔍 JSON.stringify(data):",
            JSON.stringify(data, null, 2)
          );

          // Extraer el array 'transactions' del objeto
          const transactionsArray = data.transactions.reverse() || [];
          console.log("🔍 Array de transacciones extraído:", transactionsArray);
          console.log(
            "🔍 Longitud del array extraído:",
            transactionsArray.length
          );

          // Asegurar que transactionsArray sea un array
          setUnpaidTransactions(
            Array.isArray(transactionsArray) ? transactionsArray : []
          );
        } else {
          console.error(
            "Error fetching unpaid transactions - Status:",
            response.status
          );
          console.error(
            "Error fetching unpaid transactions - Status Text:",
            response.statusText
          );
          // Intentar leer el body del error
          try {
            const errorText = await response.text();
            console.error("Error response body (unpaid):", errorText);
          } catch (e) {
            console.error("No se pudo leer el body del error (unpaid)");
          }
          setUnpaidTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching unpaid transactions:", error);
        setUnpaidTransactions([]);
      } finally {
        setLoadingUnpaid(false);
        console.log("🔍 useEffect unpaid - Fetch completado");
      }
    };

    fetchUnpaidTransactions();
    console.log("🔍 useEffect unpaid - fetchUnpaidTransactions llamado");
  }, [user?.id]);

  // Cargar transacciones pagadas del usuario
  useEffect(() => {
    console.log("🔍 useEffect paid - Iniciando...");
    console.log("🔍 useEffect paid - user:", user);
    console.log("🔍 useEffect paid - user?.id:", user?.id);

    const fetchPaidTransactions = async () => {
      if (!user?.id) {
        console.log("🔍 useEffect paid - No hay user.id, saliendo...");
        return;
      }

      console.log("🔍 useEffect paid - Iniciando fetch...");
      setLoadingPaid(true);
      try {
        const url = endpoints.transactions.getUserPaid(user.id.toString());
        console.log("🔍 URL completa para transacciones pagadas:", url);
        console.log(
          "🔍 Base URL esperada: https://fastapi-data-1-nc7j.onrender.com"
        );
        console.log("🔍 Endpoint esperado: /transactions/user/paid/{id_user}");
        console.log("🔍 User ID:", user.id);
        console.log("🔍 User ID como string:", user.id.toString());

        // Verificar que la URL se construya correctamente
        const expectedUrl = `https://fastapi-data-1-nc7j.onrender.com/transactions/user/paid/${user.id}`;
        console.log("🔍 URL esperada:", expectedUrl);
        console.log("🔍 URLs coinciden:", url === expectedUrl);

        const response = await fetch(url);
        console.log("🔍 Response status:", response.status);
        console.log("🔍 Response ok:", response.ok);
        console.log("🔍 Response headers:", response.headers);
        console.log("🔍 Response type:", response.type);
        console.log("🔍 Response url:", response.url);

        if (response.ok) {
          const data = await response.json();
          console.log(
            "🔍 Respuesta del endpoint /transactions/user/paid:",
            data
          );
          console.log("🔍 Tipo de data:", typeof data);
          console.log("🔍 Es array?", Array.isArray(data));
          console.log(
            "🔍 Longitud del array:",
            Array.isArray(data) ? data.length : "No es array"
          );
          console.log(
            "🔍 JSON.stringify(data):",
            JSON.stringify(data, null, 2)
          );

          // Extraer el array 'transactions' del objeto
          const transactionsArray = data.transactions || [];
          console.log("🔍 Array de transacciones extraído:", transactionsArray);
          console.log(
            "🔍 Longitud del array extraído:",
            transactionsArray.length
          );

          // Asegurar que transactionsArray sea un array
          setPaidTransactions(
            Array.isArray(transactionsArray) ? transactionsArray : []
          );
        } else {
          console.error(
            "Error fetching paid transactions - Status:",
            response.status
          );
          console.error(
            "Error fetching paid transactions - Status Text:",
            response.statusText
          );
          // Intentar leer el body del error
          try {
            const errorText = await response.text();
            console.error("Error response body:", errorText);
          } catch (e) {
            console.error("No se pudo leer el body del error");
          }
          setPaidTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching paid transactions:", error);
        setPaidTransactions([]);
      } finally {
        setLoadingPaid(false);
        console.log("🔍 useEffect paid - Fetch completado");
      }
    };

    fetchPaidTransactions();
    console.log("🔍 useEffect paid - fetchPaidTransactions llamado");
  }, [user?.id]);

  // Cargar evidencias pendientes de aprobación
  useEffect(() => {
    console.log("🔍 useEffect evidence - Iniciando...");
    console.log("🔍 useEffect evidence - user?.id:", user?.id);
    console.log("🔍 useEffect evidence - isAdmin:", isAdmin);

    const fetchPendingEvidence = async () => {
      if (!user?.id) {
        console.log("🔍 useEffect evidence - No hay user.id, saliendo...");
        return;
      }

      console.log("🔍 useEffect evidence - Iniciando fetch...");
      setLoadingEvidence(true);
      try {
        // Usar el endpoint getPendingToApproved para evidencias pendientes de aprobación
        const url = endpoints.evidence.getPendingToApproved;
        console.log(
          "🔍 URL completa para evidencias pendientes de aprobación:",
          url
        );
        console.log(
          "🔍 Base URL esperada: https://fastapi-data-1-nc7j.onrender.com"
        );
        console.log(
          "🔍 Endpoint esperado: /transactions/evidence/filter/pending?transaction_status=approved"
        );

        const response = await fetch(url);
        console.log("🔍 Response status (pending evidence):", response.status);
        console.log("🔍 Response ok (pending evidence):", response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log("🔍 Respuesta del endpoint getPendingToApproved:", data);
          console.log("🔍 Tipo de data:", typeof data);
          console.log("🔍 Es array?", Array.isArray(data));
          console.log(
            "🔍 Longitud del array:",
            Array.isArray(data) ? data.length : "No es array"
          );
          console.log(
            "🔍 JSON.stringify(data):",
            JSON.stringify(data, null, 2)
          );

          // Asegurar que data sea un array y filtrar por usuario si no es admin
          const filteredEvidence = Array.isArray(data) ? data : [];
          console.log(
            "🔍 Evidencias pendientes antes del filtro de usuario:",
            filteredEvidence.length
          );

          const userFilteredEvidence = isAdmin
            ? filteredEvidence
            : // : filteredEvidence.filter(evidence => {
              //     const sellerId = evidence.transaction_info?.seller?.id?.toString();
              //     const userId = user?.id?.toString();
              //     const matches = sellerId === userId;
              //     console.log(`🔍 Evidencia pendiente ${evidence.id}: seller_id=${sellerId}, user_id=${userId}, matches=${matches}`);
              //     return matches;
              //   });
              filteredEvidence;

          console.log(
            "🔍 Evidencias pendientes después del filtro de usuario:",
            userFilteredEvidence.length
          );
          console.log(
            "🔍 userFilteredEvidence pendientes:",
            userFilteredEvidence
          );
          setPendingEvidence(userFilteredEvidence.reverse());
        } else {
          console.error(
            "Error fetching pending evidence - Status:",
            response.status
          );
          console.error(
            "Error fetching pending evidence - Status Text:",
            response.statusText
          );
          try {
            const errorText = await response.text();
            console.error("Error response body (evidence):", errorText);
          } catch (e) {
            console.error("No se pudo leer el body del error (evidence)");
          }
          setPendingEvidence([]);
        }
      } catch (error) {
        console.error("Error fetching pending evidence:", error);
        setPendingEvidence([]);
      } finally {
        setLoadingEvidence(false);
        console.log("🔍 useEffect evidence - Fetch completado");
      }
    };

    fetchPendingEvidence();
    console.log("🔍 useEffect evidence - fetchPendingEvidence llamado");
  }, [user?.id, isAdmin]);

  // Cargar evidencias aprobadas
  useEffect(() => {
    console.log("🔍 useEffect approved evidence - Iniciando...");
    console.log("🔍 useEffect approved evidence - user?.id:", user?.id);
    console.log("🔍 useEffect approved evidence - isAdmin:", isAdmin);

    const fetchApprovedEvidence = async () => {
      if (!user?.id) {
        console.log(
          "🔍 useEffect approved evidence - No hay user.id, saliendo..."
        );
        return;
      }

      console.log("🔍 useEffect approved evidence - Iniciando fetch...");
      setLoadingApprovedEvidence(true);
      try {
        // Usar el endpoint getPendingEvidence para evidencias aprobadas
        const url = endpoints.evidence.getPendingEvidence;
        console.log("🔍 URL completa para evidencias aprobadas:", url);
        console.log(
          "🔍 Base URL esperada: https://fastapi-data-1-nc7j.onrender.com"
        );
        console.log(
          "🔍 Endpoint esperado: /transactions/evidence/filter/approved/not-invoiced?transaction_status=approved&payment_status=pago_incompleto"
        );

        const response = await fetch(url);
        console.log("🔍 Response status (approved evidence):", response.status);
        console.log("🔍 Response ok (approved evidence):", response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log("🔍 Respuesta del endpoint getPendingEvidence:", data);
          console.log("🔍 Tipo de data:", typeof data);
          console.log("🔍 Es array?", Array.isArray(data));
          console.log(
            "🔍 Longitud del array:",
            Array.isArray(data) ? data.length : "No es array"
          );
          console.log(
            "🔍 JSON.stringify(data):",
            JSON.stringify(data, null, 2)
          );

          // Asegurar que data sea un array y filtrar por usuario si no es admin
          const filteredEvidence = Array.isArray(data) ? data : [];
          console.log(
            "🔍 Evidencias aprobadas antes del filtro de usuario:",
            filteredEvidence.length
          );

          const userFilteredEvidence = isAdmin
            ? filteredEvidence
            : // : filteredEvidence.filter(evidence => {
              //     const sellerId = evidence.transaction_info?.seller?.id?.toString();
              //     const userId = user?.id?.toString();
              //     const matches = sellerId === userId;
              //     console.log(`🔍 Evidencia aprobada ${evidence.id}: seller_id=${sellerId}, user_id=${userId}, matches=${matches}`);
              //     return matches;
              //   });
              filteredEvidence;

          console.log(
            "🔍 Evidencias aprobadas después del filtro de usuario:",
            userFilteredEvidence.length
          );
          setApprovedEvidence(userFilteredEvidence);
        } else {
          console.error(
            "Error fetching approved evidence - Status:",
            response.status
          );
          console.error(
            "Error fetching approved evidence - Status Text:",
            response.statusText
          );
          try {
            const errorText = await response.text();
            console.error(
              "Error response body (approved evidence):",
              errorText
            );
          } catch (e) {
            console.error(
              "No se pudo leer el body del error (approved evidence)"
            );
          }
          setApprovedEvidence([]);
        }
      } catch (error) {
        console.error("Error fetching approved evidence:", error);
        setApprovedEvidence([]);
      } finally {
        setLoadingApprovedEvidence(false);
        console.log("🔍 useEffect approved evidence - Fetch completado");
      }
    };

    fetchApprovedEvidence();
    console.log(
      "🔍 useEffect approved evidence - fetchApprovedEvidence llamado"
    );
  }, [user?.id, isAdmin]);

  // Cargar facturas gestionadas
  useEffect(() => {
    const fetchInvoicedEvidence = async () => {
      if (!user?.id) {
        console.log(
          "🔍 useEffect invoiced evidence - No hay user.id, saliendo..."
        );
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
            : // : filteredEvidence.filter(evidence => {
              //     const sellerId = evidence.transaction_info?.seller?.id?.toString();
              //     const userId = user?.id?.toString();
              //     const matches = sellerId === userId;
              //     console.log(`🔍 Factura gestionada ${evidence.id}: seller_id=${sellerId}, user_id=${userId}, matches=${matches}`);
              //     return matches;
              //   });
              filteredEvidence;

          console.log(
            "🔍 Facturas gestionadas después del filtro de usuario:",
            userFilteredEvidence.length
          );
          setInvoicedEvidence(userFilteredEvidence);
        } else {
          setInvoicedEvidence([]);
        }
      } catch (error) {
        console.error("Error fetching invoiced evidence:", error);
        setInvoicedEvidence([]);
      } finally {
        setLoadingInvoicedEvidence(false);
        console.log("🔍 useEffect invoiced evidence - Fetch completado");
      }
    };

    fetchInvoicedEvidence();
    console.log(
      "🔍 useEffect invoiced evidence - fetchInvoicedEvidence llamado"
    );
  }, [user?.id, isAdmin]);

  // Función para generar factura
  const generateInvoice = async (transactionId: number | string) => {
    console.log("🔍 generateInvoice llamado");
    console.log("📋 transactionId:", transactionId);

    try {
      console.log("📤 Enviando transaction_id al webhook...");
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

      console.log("📥 Response recibido:", response);
      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        console.error(
          "❌ Response no ok:",
          response.status,
          response.statusText
        );
        throw new Error("Error al generar la factura");
      }

      console.log("📥 Parseando JSON...");
      const result = await response.json();
      console.log("📥 Result:", result);

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

        console.log("📥 Convirtiendo base64 a PDF...");
        const pdfBytes = base64ToUint8Array(result.data);
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);

        console.log("📥 Abriendo PDF en nueva pestaña...");
        window.open(blobUrl, "_blank");
        console.log("✅ Factura generada y abierta exitosamente");
      } else {
        console.log("✅ Factura generada exitosamente");
        alert("Factura generada exitosamente");
      }
    } catch (error) {
      console.error("❌ Error al generar la factura:", error);
      alert("Error al generar la factura");
      throw error;
    }
  };

  // Función para aprobar evidencia
  const approveEvidence = async (evidenceId: number | string) => {
    console.log("🔍 approveEvidence llamado");
    console.log("📋 evidenceId:", evidenceId);

    try {
      const url = endpoints.evidence.updateStatus(evidenceId, "approved");
      console.log("🔍 URL para aprobar evidencia:", url);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("🔍 Response status (approve):", response.status);
      console.log("🔍 Response ok (approve):", response.ok);

      if (response.ok) {
        console.log("✅ Evidencia aprobada exitosamente");
        // Recargar las evidencias pendientes con filtro de usuario usando getPendingToApproved
        const refreshResponse = await fetch(
          endpoints.evidence.getPendingToApproved
        );
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const filteredEvidence = Array.isArray(refreshData)
            ? refreshData
            : [];
          const userFilteredEvidence = isAdmin
            ? filteredEvidence
            : // : filteredEvidence.filter(evidence =>
              //     evidence.transaction_info?.seller?.id?.toString() === user?.id?.toString()
              //   );
              filteredEvidence;
          setPendingEvidence(userFilteredEvidence);
        }
      } else {
        console.error(
          "❌ Error al aprobar evidencia - Status:",
          response.status
        );
        console.error(
          "❌ Error al aprobar evidencia - Status Text:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("❌ Error al aprobar evidencia:", error);
    }
  };

  // Asegurar que las transacciones sean siempre arrays
  const safeUnpaidTransactions = Array.isArray(unpaidTransactions)
    ? unpaidTransactions
    : [];
  const safePaidTransactions = Array.isArray(paidTransactions)
    ? paidTransactions
    : [];

  const kanbanGroups = {
    "Pendiente por Pago": safeUnpaidTransactions,
    "Abonos Pendientes Por Aprobación": pendingEvidence,
    "Abonos Aprobados": approvedEvidence,
    "Facturas Gestionadas": invoicedEvidence,
    "Ventas Pagas": safePaidTransactions,
  };

  // Logs para debugging del renderizado
  console.log("🔍 Debug - Estado actual:");
  console.log("🔍 isAdmin:", isAdmin);
  console.log("🔍 user?.id:", user?.id);
  console.log("🔍 safeUnpaidTransactions:", safeUnpaidTransactions);
  console.log("🔍 safePaidTransactions:", safePaidTransactions);
  console.log("🔍 pendingEvidence:", pendingEvidence);
  console.log("🔍 approvedEvidence:", approvedEvidence);
  console.log("🔍 invoicedEvidence:", invoicedEvidence);
  console.log("🔍 loadingUnpaid:", loadingUnpaid);
  console.log("🔍 loadingPaid:", loadingPaid);
  console.log("🔍 loadingEvidence:", loadingEvidence);
  console.log("🔍 loadingApprovedEvidence:", loadingApprovedEvidence);
  console.log("🔍 loadingInvoicedEvidence:", loadingInvoicedEvidence);
  console.log(
    '🔍 kanbanGroups["Pendiente por Pago"]:',
    kanbanGroups["Pendiente por Pago"]
  );
  console.log(
    '🔍 kanbanGroups["Abonos Pendientes Por Aprobación"]:',
    kanbanGroups["Abonos Pendientes Por Aprobación"]
  );
  console.log(
    '🔍 kanbanGroups["Abonos Aprobados"]:',
    kanbanGroups["Abonos Aprobados"]
  );
  console.log(
    '🔍 kanbanGroups["Facturas Gestionadas"]:',
    kanbanGroups["Facturas Gestionadas"]
  );
  console.log('🔍 kanbanGroups["Ventas Pagas"]:', kanbanGroups["Ventas Pagas"]);
  console.log(
    "🔍 Longitud de Pendiente por Pago:",
    kanbanGroups["Pendiente por Pago"].length
  );
  console.log(
    "🔍 Longitud de Abonos Pendientes Por Aprobación:",
    kanbanGroups["Abonos Pendientes Por Aprobación"].length
  );
  console.log(
    "🔍 Longitud de Abonos Aprobados:",
    kanbanGroups["Abonos Aprobados"].length
  );
  console.log(
    "🔍 Longitud de Facturas Gestionadas:",
    kanbanGroups["Facturas Gestionadas"].length
  );
  console.log(
    "🔍 Longitud de Ventas Pagas:",
    kanbanGroups["Ventas Pagas"].length
  );

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
                  {safeUnpaidTransactions.length}
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
                  {safePaidTransactions.length}
                </div>
                <div className="text-xs text-green-500">
                  Completamente pagadas
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                    {loadingUnpaid
                      ? "..."
                      : kanbanGroups["Pendiente por Pago"].length}
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[60vh]">
                  {loadingUnpaid ? (
                    <div className="text-center py-4 text-gray-500">
                      Cargando transacciones pendientes...
                    </div>
                  ) : !safeUnpaidTransactions ||
                    safeUnpaidTransactions.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No hay transacciones pendientes
                    </div>
                  ) : (
                    safeUnpaidTransactions.map((transaction) => (
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
              </div>

              {/* Abonos Pendientes Por Aprobación Column */}
              <div className="kanban-column border-t-4 border-orange-400 w-80 flex-shrink-0">
                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 mr-2 text-orange-500" />
                  <h3 className="font-semibold">
                    Abonos Pendientes Por Aprobación
                  </h3>
                  <span className="ml-2 bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {loadingEvidence
                      ? "..."
                      : kanbanGroups["Abonos Pendientes Por Aprobación"].length}
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[60vh]">
                  {loadingEvidence ? (
                    <div className="text-center py-4 text-gray-500">
                      Cargando evidencias pendientes...
                    </div>
                  ) : !kanbanGroups["Abonos Pendientes Por Aprobación"] ||
                    kanbanGroups["Abonos Pendientes Por Aprobación"].length ===
                      0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No hay evidencias pendientes
                    </div>
                  ) : (
                    kanbanGroups["Abonos Pendientes Por Aprobación"].map(
                      (evidence) => (
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
                      )
                    )
                  )}
                </div>
              </div>

              {/* Abonos Aprobados Column */}
              <div className="kanban-column border-t-4 border-purple-400 w-80 flex-shrink-0">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-5 w-5 mr-2 text-purple-500" />
                  <h3 className="font-semibold">Abonos Aprobados</h3>
                  <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {loadingApprovedEvidence
                      ? "..."
                      : kanbanGroups["Abonos Aprobados"].length}
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[60vh]">
                  {loadingApprovedEvidence ? (
                    <div className="text-center py-4 text-gray-500">
                      Cargando abonos aprobados...
                    </div>
                  ) : !kanbanGroups["Abonos Aprobados"] ||
                    kanbanGroups["Abonos Aprobados"].length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No hay abonos aprobados
                    </div>
                  ) : (
                    kanbanGroups["Abonos Aprobados"].map((evidence) => (
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
              </div>

              {/* Facturas Gestionadas Column */}
              <div className="kanban-column border-t-4 border-blue-400 w-80 flex-shrink-0">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
                  <h3 className="font-semibold">Facturas Gestionadas</h3>
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {loadingInvoicedEvidence
                      ? "..."
                      : kanbanGroups["Facturas Gestionadas"].length}
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[60vh]">
                  {loadingInvoicedEvidence ? (
                    <div className="text-center py-4 text-gray-500">
                      Cargando facturas gestionadas...
                    </div>
                  ) : !kanbanGroups["Facturas Gestionadas"] ||
                    kanbanGroups["Facturas Gestionadas"].length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No hay facturas gestionadas
                    </div>
                  ) : (
                    kanbanGroups["Facturas Gestionadas"].map((evidence) => (
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
              </div>

              {/* Ventas Pagas Column */}
              <div className="kanban-column border-t-4 border-green-400 w-80 flex-shrink-0">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <h3 className="font-semibold">Ventas Pagas</h3>
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {loadingPaid ? "..." : kanbanGroups["Ventas Pagas"].length}
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[60vh]">
                  {loadingPaid ? (
                    <div className="text-center py-4 text-gray-500">
                      Cargando ventas pagas...
                    </div>
                  ) : !safePaidTransactions ||
                    safePaidTransactions.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No hay ventas pagas
                    </div>
                  ) : (
                    safePaidTransactions.map((transaction) => (
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
