import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle } from 'lucide-react';
import { SalesTransaction } from '@/types/sales';
import { endpoints } from '@/lib/endpoints';
import { useAuth } from '@/contexts/AuthContext';

interface ApprovedSalesViewProps {
  approvedTransactions: SalesTransaction[];
  viewTransaction: (transactionId: any) => void;
  loadingTransaction: boolean;
}

export const ApprovedSalesView: React.FC<ApprovedSalesViewProps> = ({
  approvedTransactions,
  viewTransaction,
  loadingTransaction
}) => {
  const { user } = useAuth();
  const [unpaidTransactions, setUnpaidTransactions] = useState<SalesTransaction[]>([]);
  const [paidTransactions, setPaidTransactions] = useState<SalesTransaction[]>([]);
  const [loadingUnpaid, setLoadingUnpaid] = useState(false);
  const [loadingPaid, setLoadingPaid] = useState(false);

  console.log('🔍 ApprovedSalesView - Componente renderizado');
  console.log('🔍 ApprovedSalesView - user?.id:', user?.id);

  // Log para verificar la información del usuario
  console.log('🔍 Debug - Información del usuario:');
  console.log('🔍 User completo:', user);
  console.log('🔍 User ID:', user?.id);
  console.log('🔍 User role:', user?.role);
  console.log('🔍 User name:', user?.name);
  console.log('🔍 User email:', user?.email);

  // Cargar transacciones no pagadas del usuario
  useEffect(() => {
    console.log('🔍 useEffect unpaid - Iniciando...');
    console.log('🔍 useEffect unpaid - user:', user);
    console.log('🔍 useEffect unpaid - user?.id:', user?.id);
    
    const fetchUnpaidTransactions = async () => {
      if (!user?.id) {
        console.log('🔍 useEffect unpaid - No hay user.id, saliendo...');
        return;
      }
      
      console.log('🔍 useEffect unpaid - Iniciando fetch...');
      setLoadingUnpaid(true);
      try {
        const url = endpoints.transactions.getUserUnpaid(user.id.toString());
        console.log('🔍 URL completa para transacciones NO pagadas:', url);
        console.log('🔍 Base URL esperada: https://fastapi-data-1-nc7j.onrender.com');
        console.log('🔍 Endpoint esperado: /transactions/user/unpaid/{id_user}');
        console.log('🔍 User ID:', user.id);
        console.log('🔍 User ID como string:', user.id.toString());
        
        // Verificar que la URL se construya correctamente
        const expectedUrl = `https://fastapi-data-1-nc7j.onrender.com/transactions/user/unpaid/${user.id}`;
        console.log('🔍 URL esperada:', expectedUrl);
        console.log('🔍 URLs coinciden:', url === expectedUrl);
        
        const response = await fetch(url);
        console.log('🔍 Response status (unpaid):', response.status);
        console.log('🔍 Response ok (unpaid):', response.ok);
        console.log('🔍 Response headers (unpaid):', response.headers);
        console.log('🔍 Response type (unpaid):', response.type);
        console.log('🔍 Response url (unpaid):', response.url);
        
        if (response.ok) {
          const data = await response.json();
          console.log('🔍 Respuesta del endpoint /transactions/user/unpaid:', data);
          console.log('🔍 Tipo de data:', typeof data);
          console.log('🔍 Es array?', Array.isArray(data));
          console.log('🔍 Longitud del array:', Array.isArray(data) ? data.length : 'No es array');
          console.log('🔍 JSON.stringify(data):', JSON.stringify(data, null, 2));
          
          // Extraer el array 'transactions' del objeto
          const transactionsArray = data.transactions || [];
          console.log('🔍 Array de transacciones extraído:', transactionsArray);
          console.log('🔍 Longitud del array extraído:', transactionsArray.length);
          
          // Asegurar que transactionsArray sea un array
          setUnpaidTransactions(Array.isArray(transactionsArray) ? transactionsArray : []);
        } else {
          console.error('Error fetching unpaid transactions - Status:', response.status);
          console.error('Error fetching unpaid transactions - Status Text:', response.statusText);
          // Intentar leer el body del error
          try {
            const errorText = await response.text();
            console.error('Error response body (unpaid):', errorText);
          } catch (e) {
            console.error('No se pudo leer el body del error (unpaid)');
          }
          setUnpaidTransactions([]);
        }
      } catch (error) {
        console.error('Error fetching unpaid transactions:', error);
        setUnpaidTransactions([]);
      } finally {
        setLoadingUnpaid(false);
        console.log('🔍 useEffect unpaid - Fetch completado');
      }
    };

    fetchUnpaidTransactions();
    console.log('🔍 useEffect unpaid - fetchUnpaidTransactions llamado');
  }, [user?.id]);

  // Cargar transacciones pagadas del usuario
  useEffect(() => {
    console.log('🔍 useEffect paid - Iniciando...');
    console.log('🔍 useEffect paid - user:', user);
    console.log('🔍 useEffect paid - user?.id:', user?.id);
    
    const fetchPaidTransactions = async () => {
      if (!user?.id) {
        console.log('🔍 useEffect paid - No hay user.id, saliendo...');
        return;
      }
      
      console.log('🔍 useEffect paid - Iniciando fetch...');
      setLoadingPaid(true);
      try {
        const url = endpoints.transactions.getUserPaid(user.id.toString());
        console.log('🔍 URL completa para transacciones pagadas:', url);
        console.log('🔍 Base URL esperada: https://fastapi-data-1-nc7j.onrender.com');
        console.log('🔍 Endpoint esperado: /transactions/user/paid/{id_user}');
        console.log('🔍 User ID:', user.id);
        console.log('🔍 User ID como string:', user.id.toString());
        
        // Verificar que la URL se construya correctamente
        const expectedUrl = `https://fastapi-data-1-nc7j.onrender.com/transactions/user/paid/${user.id}`;
        console.log('🔍 URL esperada:', expectedUrl);
        console.log('🔍 URLs coinciden:', url === expectedUrl);
        
        const response = await fetch(url);
        console.log('🔍 Response status:', response.status);
        console.log('🔍 Response ok:', response.ok);
        console.log('🔍 Response headers:', response.headers);
        console.log('🔍 Response type:', response.type);
        console.log('🔍 Response url:', response.url);
        
        if (response.ok) {
          const data = await response.json();
          console.log('🔍 Respuesta del endpoint /transactions/user/paid:', data);
          console.log('🔍 Tipo de data:', typeof data);
          console.log('🔍 Es array?', Array.isArray(data));
          console.log('🔍 Longitud del array:', Array.isArray(data) ? data.length : 'No es array');
          console.log('🔍 JSON.stringify(data):', JSON.stringify(data, null, 2));
          
          // Extraer el array 'transactions' del objeto
          const transactionsArray = data.transactions || [];
          console.log('🔍 Array de transacciones extraído:', transactionsArray);
          console.log('🔍 Longitud del array extraído:', transactionsArray.length);
          
          // Asegurar que transactionsArray sea un array
          setPaidTransactions(Array.isArray(transactionsArray) ? transactionsArray : []);
        } else {
          console.error('Error fetching paid transactions - Status:', response.status);
          console.error('Error fetching paid transactions - Status Text:', response.statusText);
          // Intentar leer el body del error
          try {
            const errorText = await response.text();
            console.error('Error response body:', errorText);
          } catch (e) {
            console.error('No se pudo leer el body del error');
          }
          setPaidTransactions([]);
        }
      } catch (error) {
        console.error('Error fetching paid transactions:', error);
        setPaidTransactions([]);
      } finally {
        setLoadingPaid(false);
        console.log('🔍 useEffect paid - Fetch completado');
      }
    };

    fetchPaidTransactions();
    console.log('🔍 useEffect paid - fetchPaidTransactions llamado');
  }, [user?.id]);

  // Asegurar que las transacciones sean siempre arrays
  const safeUnpaidTransactions = Array.isArray(unpaidTransactions) ? unpaidTransactions : [];
  const safePaidTransactions = Array.isArray(paidTransactions) ? paidTransactions : [];

  const kanbanGroups = {
    "Pendiente por Pago": safeUnpaidTransactions,
    "Ventas Pagas": safePaidTransactions
  };

  // Logs para debugging del renderizado
  console.log('🔍 Debug - Estado actual:');
  console.log('🔍 safeUnpaidTransactions:', safeUnpaidTransactions);
  console.log('🔍 safePaidTransactions:', safePaidTransactions);
  console.log('🔍 loadingUnpaid:', loadingUnpaid);
  console.log('🔍 loadingPaid:', loadingPaid);
  console.log('🔍 kanbanGroups["Pendiente por Pago"]:', kanbanGroups["Pendiente por Pago"]);
  console.log('🔍 kanbanGroups["Ventas Pagas"]:', kanbanGroups["Ventas Pagas"]);
  console.log('🔍 Longitud de Pendiente por Pago:', kanbanGroups["Pendiente por Pago"].length);
  console.log('🔍 Longitud de Ventas Pagas:', kanbanGroups["Ventas Pagas"].length);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <div className="text-sm font-medium text-yellow-700">Pendientes por Pago</div>
                <div className="text-2xl font-bold text-yellow-600">{safeUnpaidTransactions.length}</div>
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
                <div className="text-sm font-medium text-green-700">Ventas Pagas</div>
                <div className="text-2xl font-bold text-green-600">{safePaidTransactions.length}</div>
                <div className="text-xs text-green-500">Completamente pagadas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pendiente por Pago Column */}
        <div className="kanban-column border-t-4 border-yellow-400">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 mr-2 text-yellow-500" />
            <h3 className="font-semibold">Pendiente por Pago</h3>
            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {loadingUnpaid ? '...' : kanbanGroups["Pendiente por Pago"].length}
            </span>
          </div>

          <div className="space-y-3">
            {loadingUnpaid ? (
              <div className="text-center py-4 text-gray-500">Cargando transacciones pendientes...</div>
            ) : !safeUnpaidTransactions || safeUnpaidTransactions.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No hay transacciones pendientes</div>
            ) : (
              safeUnpaidTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="kanban-card border-l-yellow-400 bg-yellow-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-2">
                        {transaction.client_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <h4 className="font-medium">{transaction.client_name || 'Sin nombre'}</h4>
                        <span className="text-xs text-gray-500">Vendedor: {transaction.seller_name || 'Sin vendedor'}</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">${transaction.amount || 0}</span>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm">{transaction.package || 'Sin paquete'}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {transaction.start_date ? new Date(transaction.start_date).toLocaleDateString() : 'Sin fecha'}
                      </span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Pendiente
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-2 bg-yellow-600 hover:bg-yellow-700"
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

        {/* Ventas Pagas Column */}
        <div className="kanban-column border-t-4 border-green-400">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            <h3 className="font-semibold">Ventas Pagas</h3>
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {loadingPaid ? '...' : kanbanGroups["Ventas Pagas"].length}
            </span>
          </div>

          <div className="space-y-3">
            {loadingPaid ? (
              <div className="text-center py-4 text-gray-500">Cargando ventas pagas...</div>
            ) : !safePaidTransactions || safePaidTransactions.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No hay ventas pagas</div>
            ) : (
              safePaidTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="kanban-card border-l-green-400 bg-green-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">
                        {transaction.client_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <h4 className="font-medium">{transaction.client_name || 'Sin nombre'}</h4>
                        <span className="text-xs text-gray-500">Vendedor: {transaction.seller_name || 'Sin vendedor'}</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">${transaction.amount || 0}</span>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm">{transaction.package || 'Sin paquete'}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {transaction.start_date ? new Date(transaction.start_date).toLocaleDateString() : 'Sin fecha'}
                      </span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
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
  );
}; 