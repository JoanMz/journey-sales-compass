
// import React, { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from "@/components/ui/table";
// import { ChevronDown } from "lucide-react";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { getAllTransactions } from "@/lib/api";
// import { Transaction } from "@/types/transactions";
// import { calculateCommissionByVendor } from "@/lib/financialUtils";
// import { formatCurrency } from "@/lib/utils";

// interface CommissionDetailsProps {
//   className?: string;
// }

// const CommissionDetails: React.FC<CommissionDetailsProps> = ({ className }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
  
//   useEffect(() => {
//     // Only fetch data when component is opened
//     if (isOpen) {
//       fetchData();
//     }
//   }, [isOpen]);
  
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const data = await getAllTransactions();
//       setTransactions(Array.isArray(data) ? data : []);
//       setError(null);
//     } catch (err) {
//       console.error("Error fetching transactions:", err);
//       setError("No se pudieron cargar las comisiones");
//       // Add mock data in case of error
//       setTransactions(getMockTransactions());
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Mock data for testing or when API fails
//   const getMockTransactions = (): Transaction[] => {
//     return [
//       {
//         id: 1001,
//         client_name: "Sofia Salinas",
//         client_email: "sofia@example.com",
//         client_phone: "+573145678901",
//         client_dni: "1089345678",
//         client_address: "Calle 123, Bogotá",
//         invoice_image: "",
//         id_image: "",
//         package: "Student Adventure",
//         quoted_flight: "Bogotá - Toulouse",
//         agency_cost: 950,
//         amount: 1250,
//         transaction_type: "abono",
//         status: "approved",
//         seller_id: 101,
//         seller_name: "John Seller",
//         receipt: "",
//         start_date: "2025-05-01",
//         end_date: "2025-05-15",
//         travelers: []
//       },
//       {
//         id: 1002,
//         client_name: "Daniel Rivera",
//         client_email: "daniel@example.com",
//         client_phone: "+573156789012",
//         client_dni: "1089456789",
//         client_address: "Carrera 45, Medellín",
//         invoice_image: "",
//         id_image: "",
//         package: "París Tour Package",
//         quoted_flight: "Bogotá - París",
//         agency_cost: 1000,
//         amount: 1200,
//         transaction_type: "abono",
//         status: "approved",
//         seller_id: 102,
//         seller_name: "Maria Seller",
//         receipt: "",
//         start_date: "2025-04-15",
//         end_date: "2025-04-25",
//         travelers: []
//       },
//       {
//         id: 1003,
//         client_name: "Miguel Muñoz",
//         client_email: "miguel@example.com",
//         client_phone: "+573167890123",
//         client_dni: "1089567890",
//         client_address: "Avenida 67, Cali",
//         invoice_image: "",
//         id_image: "",
//         package: "Barcelona Tour",
//         quoted_flight: "Bogotá - Barcelona",
//         agency_cost: 800,
//         amount: 850,
//         transaction_type: "abono",
//         status: "approved",
//         seller_id: 101,
//         seller_name: "John Seller",
//         receipt: "",
//         start_date: "2025-03-10",
//         end_date: "2025-03-20",
//         travelers: []
//       }
//     ];
//   };
  
//   const approvedTransactions = transactions.filter(t => t.status === "approved");
//   const commissionsByVendor = calculateCommissionByVendor(approvedTransactions);
//   const vendorCommissions = Object.values(commissionsByVendor);
  
//   return (
//     <Card className={`bg-white border-blue-200 ${className}`}>
//       <Collapsible open={isOpen} onOpenChange={setIsOpen}>
//         <CardHeader className="pb-2 border-b border-blue-200">
//           <CollapsibleTrigger asChild>
//             <div className="flex items-center justify-between cursor-pointer">
//               <CardTitle className="text-blue-700">Detalle de Comisiones por Vendedor</CardTitle>
//               <Button variant="ghost" size="sm">
//                 <ChevronDown className={`h-4 w-4 transform ${isOpen ? 'rotate-180' : ''}`} />
//               </Button>
//             </div>
//           </CollapsibleTrigger>
//         </CardHeader>
//         <CollapsibleContent>
//           <CardContent className="pt-4">
//             {loading ? (
//               <div className="flex justify-center py-6">
//                 <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
//               </div>
//             ) : error ? (
//               <div className="text-center text-red-500 py-4">{error}</div>
//             ) : vendorCommissions.length === 0 ? (
//               <div className="text-center text-gray-500 py-4">No hay comisiones disponibles</div>
//             ) : (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>ID Vendedor</TableHead>
//                     <TableHead>Nombre</TableHead>
//                     <TableHead>Ventas Totales</TableHead>
//                     <TableHead>Comisión (2.25%)</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {vendorCommissions.map((vendor) => (
//                     <TableRow key={vendor.sellerId}>
//                       <TableCell>{vendor.sellerId}</TableCell>
//                       <TableCell>{vendor.sellerName}</TableCell>
//                       <TableCell>{formatCurrency(vendor.sales)}</TableCell>
//                       <TableCell>{formatCurrency(vendor.commission)}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             )}
//           </CardContent>
//         </CollapsibleContent>
//       </Collapsible>
//     </Card>
//   );
// };

// export default CommissionDetails;
