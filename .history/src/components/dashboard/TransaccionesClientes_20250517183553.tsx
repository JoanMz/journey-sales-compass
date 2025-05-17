import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Trash2, MoreHorizontal } from "lucide-react";
import { Sale } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { getAllTransactions } from "@/lib/api";
import { toast } from "sonner";
import { Transaction } from "@/types/transactions";
import axios from "axios";

type TransactionStatus = "Pendiente" | "Completado" | "Rechazado";

interface TransaccionesClientesProps {
  sales: Sale[];
}

const mapStatusToSpanish = (status: string): TransactionStatus => {
  switch (status) {
    case "pendiente": return "Pendiente";
    case "completado": return "Completado";
    case "rechazado": return "Rechazado";
    case "On Process": return "Pendiente";
    case "Success": return "Completado";
    case "Canceled": return "Rechazado";
    default: return "Pendiente";
  }
}

const mapStatusToStyle = (status: TransactionStatus): string => {
  switch (status) {
    case "Completado": return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Pendiente": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "Rechazado": return "bg-red-100 text-red-800 hover:bg-red-100";
    default: return "";
  }
}

const TransaccionesClientes: React.FC<TransaccionesClientesProps> = ({ sales }) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [apiTransactions, setApiTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // Use the Vite proxy with a relative URL
        const response = await axios.post("/api/", { "url": "http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000/transactions/filter/pendiente", "method": "GET" });

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

        setApiTransactions(transactions);
        setError(null);
      } catch (err) {
        console.error("Error fetching pending transactions:", err);
        setError("Error al cargar transacciones pendientes");
        toast.error("No se pudieron cargar las transacciones pendientes");

        // Add mock transactions in case of error
        setApiTransactions(getMockTransactions());
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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

  // Convert API transactions to Sale format for consistency
  const convertedTransactions: Sale[] = apiTransactions.map(transaction => ({
    id: transaction.id.toString(),
    customerId: transaction.id.toString(),
    customerName: transaction.client_name,
    customerAvatar: "",
    package: transaction.package,
    date: transaction.start_date,
    status: mapStatusToSpanish(transaction.status) === "Completado" ? "Success" :
      mapStatusToSpanish(transaction.status) === "Rechazado" ? "Canceled" : "On Process",
    amount: transaction.amount,
    sellerName: transaction.seller_name,
    sellerId: transaction.seller_id.toString()
  }));

  // Use API data if available, otherwise use props data
  const allSales = convertedTransactions.length > 0 ? convertedTransactions : sales;

  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedRows(prev =>
      prev.length === allSales.length ? [] : allSales.map(sale => sale.id)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedRows.length === allSales.length && allSales.length > 0}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Paquete</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allSales.map(sale => {
            const status = mapStatusToSpanish(sale.status);
            return (
              <TableRow key={sale.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(sale.id)}
                    onCheckedChange={() => toggleSelectRow(sale.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {sale.customerAvatar ? (
                        <AvatarImage src={sale.customerAvatar} alt={sale.customerName} />
                      ) : null}
                      <AvatarFallback>{sale.customerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{sale.customerName}</span>
                  </div>
                </TableCell>
                <TableCell>{sale.package}</TableCell>
                <TableCell>
                  {new Date(sale.date).toLocaleDateString('es-ES')}
                </TableCell>
                <TableCell>{formatCurrency(sale.amount)}</TableCell>
                <TableCell>
                  <Badge className={mapStatusToStyle(status)}>
                    {status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransaccionesClientes;
