import { useState, useEffect } from "react";
import axios from "axios";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency } from "../../lib/utils";
import { Transaction, Traveler } from "@/types/transactions";

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
      //const response = await axios.post("/api/",{"url": "http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000/transactions/filter/pendiente","method": "GET"});
      const response = await axios.get("https://medium-server3.vercel.app/api/transactions")
      console.log(response)
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
      
      // If no transactions were fetched or they're empty, add mock transactions
      if (!transactions.length) {
        transactions = getMockTransactions();
      }
      
      setPendingTransactions(transactions);
      setError(null);
    } catch (err) {
      console.error("Error fetching pending transactions:", err);
      setError("Error al cargar transacciones pendientes");
      toast.error("No se pudieron cargar las transacciones pendientes");
      
      // Add mock transactions in case of error
      setPendingTransactions(getMockTransactions());
    } finally {
      setLoading(false);
    }
  };

  // Function to generate mock transactions with the required client names
  const getMockTransactions = (): Transaction[] => {
    return [
      {
        id: 1001,
        client_name: "Sofia Salinas",
        client_email: "sofia@example.com",
        client_phone: "+573145678901",
        client_dni: "1089345678",
        client_address: "Calle 123, Bogotá",
        invoice_image: "",
        id_image: "",
        package: "Student Adventure",
        quoted_flight: "Bogotá - Toulouse",
        agency_cost: 950,
        amount: 1250,
        transaction_type: "Internacional",
        status: "pendiente",
        seller_id: 101,
        seller_name: "John Seller",
        receipt: "",
        start_date: "2025-08-12",
        end_date: "2025-08-20",
        travelers: [
          {
            id: 1,
            name: "Sofia Salinas",
            dni: "1089345678",
            age: 22,
            phone: "+573145678901",
            dni_image: ""
          }
        ]
      },
      {
        id: 1002,
        client_name: "Daniel Rivera",
        client_email: "daniel@example.com",
        client_phone: "+573156789012",
        client_dni: "1089456789",
        client_address: "Carrera 45, Medellín",
        invoice_image: "",
        id_image: "",
        package: "París Tour Package",
        quoted_flight: "Bogotá - París",
        agency_cost: 1000,
        amount: 1200,
        transaction_type: "Internacional",
        status: "pendiente",
        seller_id: 102,
        seller_name: "John Seller",
        receipt: "",
        start_date: "2025-07-15",
        end_date: "2025-07-25",
        travelers: [
          {
            id: 2,
            name: "Daniel Rivera",
            dni: "1089456789",
            age: 30,
            phone: "+573156789012",
            dni_image: ""
          }
        ]
      },
      {
        id: 1003,
        client_name: "Miguel Muñoz",
        client_email: "miguel@example.com",
        client_phone: "+573167890123",
        client_dni: "1089567890",
        client_address: "Avenida 67, Cali",
        invoice_image: "",
        id_image: "",
        package: "Barcelona Tour",
        quoted_flight: "Bogotá - Barcelona",
        agency_cost: 800,
        amount: 850,
        transaction_type: "Internacional",
        status: "pendiente",
        seller_id: 101,
        seller_name: "Admin User",
        receipt: "",
        start_date: "2025-08-10",
        end_date: "2025-08-20",
        travelers: [
          {
            id: 3,
            name: "Miguel Muñoz",
            dni: "1089567890",
            age: 28,
            phone: "+573167890123",
            dni_image: ""
          }
        ]
      }
    ];
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
    try {
      await axios.post("https://elder-link-staging-n8n.fwoasm.easypanel.host/webhook/d5e02b96-c7fa-4358-8120-65fccbee7892",
        { transaction_id: id},
        {
          headers: {
            accept: 'application/json',
          },
          timeout: 5000 // Add timeout to prevent long waits
        }
      );
    } catch (err) {
      console.error("Error generating document:", err);
      // We don't show an error to the user since this is a background process
    }
  }

  const handleReject = async (id: number) => {
    try {
      // Use the Vite proxy with a relative URL
      await axios.patch(`/api/transactions/${id}/status?status=rechazado`);
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
        ) : error && pendingTransactions.length === 0 ? (
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
                  <p className="text-sm text-gray-500">Paquete</p>
                  <p className="text-sm">{transaction.package}</p>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">Fecha inicio</p>
                  <p className="text-sm">{new Date(transaction.start_date).toLocaleDateString()}</p>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">Fecha fin</p>
                  <p className="text-sm">{new Date(transaction.end_date).toLocaleDateString()}</p>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">Vuelo cotizado</p>
                  <p className="text-sm">{transaction.quoted_flight}</p>
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
