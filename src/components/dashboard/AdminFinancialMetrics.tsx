
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingBag 
} from "lucide-react";
import TimePeriodFilter, { TimePeriod } from "./TimePeriodFilter";
import SellerFilter from "./SellerFilter";
import { getAllTransactions } from "@/lib/api";
import { calculateTotalRevenue, calculateTotalProfit, calculateTotalCommission, filterTransactionsByPeriod } from "@/lib/financialUtils";
import { Transaction } from "@/types/transactions";
import { formatCurrency } from "@/lib/utils";

const AdminFinancialMetrics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllTransactions();
        setTransactions(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("No se pudieron cargar las transacciones");
        // Add mock data in case of error
        setTransactions(getMockTransactions());
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Apply filters whenever transactions, time period or selected seller changes
  useEffect(() => {
    let result = filterTransactionsByPeriod(transactions, timePeriod);
    
    // Filter by seller if one is selected
    if (selectedSellerId !== null) {
      result = result.filter(t => t.seller_id === selectedSellerId);
    }
    
    setFilteredTransactions(result);
  }, [transactions, timePeriod, selectedSellerId]);
  
  // Mock data for testing or when API fails
  const getMockTransactions = (): Transaction[] => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    
    const lastFortnightDate = new Date(today);
    lastFortnightDate.setDate(today.getDate() - 15);
    
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
        status: "completado",
        seller_id: 101,
        seller_name: "John Seller",
        receipt: "",
        start_date: new Date(lastFortnightDate).toISOString().split('T')[0],
        end_date: today.toISOString().split('T')[0],
        travelers: []
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
        status: "completado",
        seller_id: 102,
        seller_name: "Maria Seller",
        receipt: "",
        start_date: new Date(lastMonth).toISOString().split('T')[0],
        end_date: today.toISOString().split('T')[0],
        travelers: []
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
        status: "completado",
        seller_id: 101,
        seller_name: "John Seller",
        receipt: "",
        start_date: new Date(lastMonth).toISOString().split('T')[0],
        end_date: today.toISOString().split('T')[0],
        travelers: []
      }
    ];
  };
  
  // Calculate key metrics
  const totalRevenue = calculateTotalRevenue(filteredTransactions);
  const totalProfit = calculateTotalProfit(totalRevenue);
  const totalCommission = calculateTotalCommission(filteredTransactions);
  const totalSales = filteredTransactions.length;
  
  const handlePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period);
  };
  
  const handleSellerChange = (sellerId: number | null) => {
    setSelectedSellerId(sellerId);
  };
  
  return (
    <Card className="bg-white border-blue-200 mb-6">
      <CardHeader className="pb-2 border-b border-blue-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-blue-700">Métricas de Ventas</CardTitle>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <SellerFilter
              transactions={transactions}
              selectedSellerId={selectedSellerId}
              onSellerChange={handleSellerChange}
            />
            <TimePeriodFilter currentPeriod={timePeriod} onPeriodChange={handlePeriodChange} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-800">Ingresos Totales</h3>
                  <div className="p-2 bg-blue-500 text-white rounded-md">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-900">{formatCurrency(totalRevenue)}</div>
                <p className="text-sm text-blue-600 mt-2">
                  {timePeriod === "fortnight" && "Últimos 15 días"}
                  {timePeriod === "month" && "Último mes"}
                  {timePeriod === "all" && "Histórico completo"}
                  {selectedSellerId !== null && ", Vendedor seleccionado"}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-800">Ganancia (15%)</h3>
                  <div className="p-2 bg-green-500 text-white rounded-md">
                    <DollarSign size={20} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-900">{formatCurrency(totalProfit)}</div>
                <p className="text-sm text-green-600 mt-2">
                  {timePeriod === "fortnight" && "Últimos 15 días"}
                  {timePeriod === "month" && "Último mes"}
                  {timePeriod === "all" && "Histórico completo"}
                  {selectedSellerId !== null && ", Vendedor seleccionado"}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-purple-800">Comisión a Vendedores</h3>
                  <div className="p-2 bg-purple-500 text-white rounded-md">
                    <Users size={20} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-purple-900">{formatCurrency(totalCommission)}</div>
                <p className="text-sm text-purple-600 mt-2">
                  {timePeriod === "fortnight" && "Últimos 15 días"}
                  {timePeriod === "month" && "Último mes"}
                  {timePeriod === "all" && "Histórico completo"}
                  {selectedSellerId !== null && ", Vendedor seleccionado"}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-amber-800">Total Ventas</h3>
                  <div className="p-2 bg-amber-500 text-white rounded-md">
                    <ShoppingBag size={20} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-amber-900">{totalSales}</div>
                <p className="text-sm text-amber-600 mt-2">
                  {timePeriod === "fortnight" && "Últimos 15 días"}
                  {timePeriod === "month" && "Último mes"}
                  {timePeriod === "all" && "Histórico completo"}
                  {selectedSellerId !== null && ", Vendedor seleccionado"}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminFinancialMetrics;
