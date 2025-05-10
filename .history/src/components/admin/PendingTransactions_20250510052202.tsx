
import { useState, useEffect } from "react";
import axios from "axios";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency } from "../../lib/utils";

interface Traveler {
  id: number;
  name: string;
  dni: string;
  age: number;
  phone: string;
  dni_image: string;
}

interface Transaction {
  id: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_dni: string;
  client_address: string;
  invoice_image: string;
  id_image: string;
  package: string;
  quoted_flight: string;
  agency_cost: number;
  amount: number;
  transaction_type: string;
  status: string;
  seller_id: number;
  seller_name: string;
  receipt: string;
  start_date: string;
  end_date: string;
  travelers: Traveler[];
}

const PendingTransactions = () => {
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMoreCount, setShowMoreCount] = useState(3);

  useEffect(() => {
    fetchPendingTransactions();
    
    // Set up polling to refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchPendingTransactions();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchPendingTransactions = async () => {
    try {
      setLoading(true);
      // Use the Vite proxy with a relative URL
      const response = await axios.get("/api/transactions/filter/pendiente");
      
      // Check if response.data is an array, if not, handle accordingly
      let transactions: Transaction[] = [];
      
      if (Array.isArray(response.data)) {
        transactions = response.data;
      } else if (response.data && typeof response.data === 'object') {
        // If it's an object with a data property that is an array
        if (Array.isArray(response.data.data)) {
          transactions = response.data.data;
        } else {
          // If it's a single transaction object, wrap it in an array
          transactions = [response.data].filter(item => item && typeof item === 'object');
        }
      }
      
      console.log("Fetched transactions:", transactions);
      setPendingTransactions(transactions);
      setError(null);
    } catch (err) {
      console.error("Error fetching pending transactions:", err);
      setError("Error al cargar transacciones pendientes");
      toast.error("No se pudieron cargar las transacciones pendientes");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      // Use the Vite proxy with a relative URL
      await axios.patch(`/api/transactions/${id}/status?status=completado`);
      toast.success(`Transacción #${id} aprobada`);
      // Call Document generation
      callDocumentGeneration(id);
      // Remove from pending list
      setPendingTransactions(pendingTransactions.filter(transaction => transaction.id !== id));

    } catch (err) {
      console.error("Error approving transaction:", err);
      toast.error("Error al aprobar la transacción");
    }
  };

  const callDocumentGeneration = async(id : number) => {

    await axios.post("https://elder-link-staging-n8n.fwoasm.easypanel.host/webhook/d5e02b96-c7fa-4358-8120-65fccbee7892",
      { transaction_id: id},
      {
        headers: {
          accept: 'application/json',
        },
        timeout: 5000 // Add timeout to prevent long waits
      }
    );
  }

  const handleReject = async (id: number) => {
    try {
      // Use the Vite proxy with a relative URL
      await axios.patch(`/api/transactions/${id}/status?status=rejected`);
      toast.info(`Transacción #${id} rechazada`);
      // Remove from pending list
      setPendingTransactions(pendingTransactions.filter(transaction => transaction.id !== id));
    } catch (err) {
      console.error("Error rejecting transaction:", err);
      toast.error("Error al rechazar la transacción");
    }
  };

  const handleShowMore = () => {
    setShowMoreCount(prev => prev + 3);
  };

  const displayTransactions = pendingTransactions.slice(0, showMoreCount);

  return (
    <Card className="bg-white border-blue-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Aprobaciones de Ventas Pendientes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : pendingTransactions.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No hay transacciones pendientes</div>
        ) : (
          <div className="space-y-4">
            {displayTransactions.map((transaction) => (
              <div key={transaction.id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-medium">{transaction.client_name}</h3>
                    <p className="text-sm text-gray-500">Cliente</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{transaction.transaction_type}</p>
                    <p className="font-bold text-lg">{formatCurrency(transaction.amount)}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">Fecha inicio</p>
                  <p className="text-sm">{new Date(transaction.start_date).toLocaleString()}</p>
                </div>
                
                <div className="flex justify-end gap-2 mt-3">
                  <Button 
                    className="bg-green-500 hover:bg-green-600" 
                    onClick={() => handleApprove(transaction.id)}
                  >
                    <Check className="mr-1 h-4 w-4" /> Aprobar
                  </Button>
                  <Button 
                    className="bg-red-500 hover:bg-red-600" 
                    onClick={() => handleReject(transaction.id)}
                  >
                    <X className="mr-1 h-4 w-4" /> Rechazar
                  </Button>
                </div>
              </div>
            ))}
            
            {pendingTransactions.length > showMoreCount && (
              <div className="flex justify-center mt-4">
                <Button 
                  variant="outline" 
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={handleShowMore}
                >
                  Ver más
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingTransactions;
