
import React, { useState } from "react";
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

type TransactionStatus = "Pendiente" | "Completado" | "Rechazado";

interface TransaccionesClientesProps {
  sales: Sale[];
}

const mapStatusToSpanish = (status: Sale['status']): TransactionStatus => {
  switch (status) {
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
  
  // Ensure we have all the specified customers including Sofia Salinas' specific Toulouse trip
  const allSales = [...sales];
  const sofiaToulouseExists = allSales.some(sale => 
    sale.customerName === "Natalia Sofia Salinas" && sale.package === "Toulouse"
  );
  
  if (!sofiaToulouseExists) {
    // Add Natalia Sofia Salinas' specific Toulouse trip if it doesn't exist
    allSales.push({
      id: `s${Date.now()}`,
      customerId: "c5", // Assuming Sofia uses the c5 customer ID
      customerName: "Natalia Sofia Salinas",
      customerAvatar: "https://i.pravatar.cc/150?img=5",
      package: "Toulouse",
      date: "2025-08-12", // From August 12-20, 2025
      status: "Success", // Will display as "Completado"
      amount: 1850,
      sellerName: "John Seller",
      sellerId: "2"
    });
  }
  
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

  return (
    <div className="rounded-lg border bg-white">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Transacciones de Clientes</h3>
      </div>
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
                    {sale.package === "Toulouse" ? 
                      "12-20 Aug, 2025" : 
                      new Date(sale.date).toLocaleDateString('es-ES')
                    }
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
    </div>
  );
};

export default TransaccionesClientes;
