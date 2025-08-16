import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Users, User, TrendingUp, ShoppingBag, ArrowUp } from 'lucide-react';
import { 
  getCurrentYearQuincenas, 
  calculateQuincenalCommission,
  calculateAllSellersQuincenalCommissions 
} from '@/lib/financialUtils';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions } from '@/hooks/useTransactions';
import { getUsers, getTotalIncomeMetrics } from '@/lib/api';
import { TotalIncomeMetrics } from '@/types/transactions';
import { formatCurrency } from '@/lib/utils';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import moment from 'moment';

interface QuincenalCommissionsProps {
  sellers?: { id: number; name: string }[];
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone_number?: string;
}

// Define chart colors
const CHART_COLORS = ["#2563eb", "#16a34a", "#dc2626", "#7c3aed"];

export const QuincenalCommissions: React.FC<QuincenalCommissionsProps> = ({ sellers = [] }) => {
  const { user, isAdmin } = useAuth();
  const { filteredTransactions } = useTransactions();
  const [selectedQuincena, setSelectedQuincena] = useState<string>('');
  const [selectedSeller, setSelectedSeller] = useState<string>('');
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [quincenas] = useState(getCurrentYearQuincenas());
  const [sellersList, setSellersList] = useState<{ id: number; name: string }[]>([]);
  
  // New states for seller metrics
  const [metricsData, setMetricsData] = useState<TotalIncomeMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const isMobile = useIsMobile();

  // Obtener lista de vendedores desde el endpoint de usuarios
  const fetchSellers = async () => {
    try {
      const users = await getUsers();
      // Filtrar usuarios con rol "seller"
      const sellers = users.filter((user: User) => user.role === 'seller');
      const sellersFormatted = sellers.map((seller: User) => ({
        id: seller.id,
        name: seller.name
      }));
      setSellersList(sellersFormatted);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      // Fallback: usar vendedores únicos de las transacciones
      const sellerMap = new Map<number, string>();
      filteredTransactions.forEach(transaction => {
        if (transaction.seller_id && transaction.seller_name) {
          sellerMap.set(transaction.seller_id, transaction.seller_name);
        }
      });
      const fallbackSellers = Array.from(sellerMap.entries()).map(([id, name]) => ({ id, name }));
      setSellersList(fallbackSellers);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  // Function to fetch seller metrics for the selected quincenal period
  const fetchSellerMetrics = async (startDate: string, endDate: string) => {
    if (!user?.id || isAdmin) return; // Only for non-admin sellers
    
    try {
      setMetricsLoading(true);
      const fecha_inicio = moment(startDate).format("YYYY-MM-DD");
      const fecha_fin = moment(endDate).format("YYYY-MM-DD");
      
      const data = await getTotalIncomeMetrics(fecha_inicio, fecha_fin, user.id);
      setMetricsData(data);
    } catch (error) {
      console.error('Error fetching seller metrics:', error);
    } finally {
      setMetricsLoading(false);
    }
  };

  // Seleccionar la quincena actual por defecto
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const currentQuincena = currentDay <= 15 ? 1 : 2;
    
    const currentQuincenaKey = `${now.getFullYear()}-${currentMonth.toString().padStart(2, '0')}-${currentQuincena}`;
    setSelectedQuincena(currentQuincenaKey);
  }, []);

  const calculateCommissions = async () => {
    if (!selectedQuincena) return;

    setLoading(true);
    try {
      const [year, month, quincena] = selectedQuincena.split('-');
      const quincenaData = quincenas.find(q => 
        q.year === parseInt(year) && 
        q.month === parseInt(month) && 
        q.quincena === parseInt(quincena)
      );

      if (!quincenaData) {
        console.error('Quincena no encontrada');
        return;
      }

      let results = [];

      if (isAdmin) {
        if (selectedSeller && selectedSeller !== 'all') {
          // Calcular solo para el vendedor seleccionado
          const sellerId = parseInt(selectedSeller);
          const seller = sellersList.find(s => s.id === sellerId);
          if (seller) {
            const result = await calculateQuincenalCommission(
              sellerId,
              quincenaData.startDate,
              quincenaData.endDate
            );
            results = [{
              sellerId: seller.id,
              sellerName: seller.name,
              commission: result.total,
              formatted: result.formatted,
              transactionCount: result.transactions.length
            }];
          }
        } else {
          // Calcular para todos los vendedores
          results = await calculateAllSellersQuincenalCommissions(
            sellersList,
            quincenaData.startDate,
            quincenaData.endDate
          );
        }
      } else if (user?.id) {
        // Calcular solo para el seller logueado
        const result = await calculateQuincenalCommission(
          user.id,
          quincenaData.startDate,
          quincenaData.endDate
        );
        results = [{
          sellerId: user.id,
          sellerName: user.name,
          commission: result.total,
          formatted: result.formatted,
          transactionCount: result.transactions.length
        }];
      }

      setCommissions(results);
      
      // Fetch seller metrics if user is not admin
      if (!isAdmin && user?.id && quincenaData) {
        await fetchSellerMetrics(quincenaData.startDate, quincenaData.endDate);
      }
    } catch (error) {
      console.error('Error calculating commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedQuincena) {
      calculateCommissions();
    }
  }, [selectedQuincena, selectedSeller]);

  const getQuincenaLabel = (key: string) => {
    const [year, month, quincena] = key.split('-');
    const quincenaData = quincenas.find(q => 
      q.year === parseInt(year) && 
      q.month === parseInt(month) && 
      q.quincena === parseInt(quincena)
    );
    return quincenaData?.label || key;
  };

  const totalCommission = commissions.reduce((sum, c) => sum + c.commission, 0);
  const totalTransactions = commissions.reduce((sum, c) => sum + c.transactionCount, 0);

  // Prepare data for seller metrics charts
  const prepareStatusData = () => {
    if (!metricsData?.estadisticas_ventas) {
      return [];
    }

    const { estadisticas_ventas } = metricsData;
    const statusMapping = {
      pending: "Pendiente",
      approved: "Aprobado",
      incompleta: "Incompleta",
      rejected: "Rechazado",
      terminado: "Terminado",
    };

    return Object.entries(estadisticas_ventas)
      .filter(([key]) => key !== "total_ventas")
      .map(([key, value]) => ({
        name: statusMapping[key as keyof typeof statusMapping] || key,
        value,
      }));
  };

  // Get metrics for seller
  const statusData = prepareStatusData();
  const sellerTotalRevenue = metricsData?.total_ingresos || 0;
  const sellerTotalCommission = metricsData?.total_comision || 0;
  const sellerTotalSales = metricsData?.estadisticas_ventas?.total_ventas || 0;

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-2 border-b border-blue-200">
        <CardTitle className="text-blue-700 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Comisiones Quincenales
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <Select value={selectedQuincena} onValueChange={setSelectedQuincena}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Seleccionar quincena" />
              </SelectTrigger>
              <SelectContent>
                {quincenas.map((quincena) => (
                  <SelectItem 
                    key={`${quincena.year}-${quincena.month.toString().padStart(2, '0')}-${quincena.quincena}`}
                    value={`${quincena.year}-${quincena.month.toString().padStart(2, '0')}-${quincena.quincena}`}
                  >
                    {quincena.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Filtro por vendedor solo para administradores */}
            {isAdmin && (
              <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Seleccionar vendedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Todos los vendedores
                  </SelectItem>
                  {sellersList.map((seller) => (
                    <SelectItem key={seller.id} value={seller.id.toString()}>
                      {seller.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Button 
              onClick={calculateCommissions} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Calculando...' : 'Recalcular'}
            </Button>
          </div>

          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-md border border-blue-200 flex items-center">
              <DollarSign className="h-10 w-10 text-blue-500 mr-3" />
              <div>
                <div className="font-semibold text-blue-700">Total Comisiones Quincenales</div>
                <div className="text-2xl font-bold text-blue-600">
                  {totalCommission.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}
                </div>
                <div className="text-sm text-blue-500">2.25% por venta aprobada en la quincena</div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md border border-blue-200 flex items-center">
              <Users className="h-10 w-10 text-blue-500 mr-3" />
              <div>
                <div className="font-semibold text-blue-700">Sellers con Ventas</div>
                <div className="text-2xl font-bold text-blue-600">{commissions.length}</div>
                <div className="text-sm text-blue-500">Con ventas aprobadas en la quincena</div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md border border-blue-200 flex items-center">
              <Calendar className="h-10 w-10 text-blue-500 mr-3" />
              <div>
                <div className="font-semibold text-blue-700">Ventas Aprobadas</div>
                <div className="text-2xl font-bold text-blue-600">{totalTransactions}</div>
                <div className="text-sm text-blue-500">Transacciones aprobadas en la quincena</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de comisiones por seller */}
        <div className="space-y-3">
          <h3 className="font-semibold text-blue-700 mb-3">
            Comisiones Quincenales por Seller - {getQuincenaLabel(selectedQuincena)}
            {isAdmin && selectedSeller && selectedSeller !== 'all' && (
              <span className="text-sm text-blue-500 ml-2">
                (Filtrado por vendedor)
              </span>
            )}
          </h3>
          
          {loading ? (
            <div className="text-center py-8 text-blue-500">Calculando comisiones...</div>
          ) : commissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay comisiones para esta quincena
            </div>
          ) : (
            commissions.map((commission) => (
              <div
                key={commission.sellerId}
                className="bg-white p-4 rounded-md border border-blue-200 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    {commission.sellerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700">{commission.sellerName}</h4>
                    <div className="text-sm text-blue-500">
                      {commission.transactionCount} venta{commission.transactionCount !== 1 ? 's' : ''} aprobada{commission.transactionCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {commission.formatted}
                  </div>
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    Comisión Quincenal 2.25%
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Seller Metrics Section - Only shown for non-admin users */}
        {!isAdmin && user?.id && (
          <div className="mt-8 pt-6 border-t border-blue-200">
            <h2 className="text-xl font-semibold text-blue-700 mb-6">
              Mis Métricas para la Quincena - {getQuincenaLabel(selectedQuincena)}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Status Distribution Chart */}
              <Card className="bg-white shadow-md border border-gray-200 lg:col-span-2">
                <CardHeader className="pb-2 border-b border-gray-200">
                  <CardTitle className="text-gray-700 text-lg">
                    Distribución de mis ventas por estado
                  </CardTitle>
                  {metricsData?.titulo_periodo && (
                    <p className="text-sm text-gray-600">
                      {metricsData.titulo_periodo}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[400px] flex items-center justify-center">
                    {metricsLoading ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-500">Cargando métricas...</p>
                      </div>
                    ) : statusData.length === 0 ? (
                      <div className="text-center text-gray-500">
                        No hay datos de ventas para esta quincena
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={isMobile ? 40 : 60}
                            outerRadius={isMobile ? 80 : 100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {statusData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Legend verticalAlign="bottom" height={36} />
                          <Tooltip
                            formatter={(value, name) => [`${value} ventas`, name]}
                            labelFormatter={() => "Estado"}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Seller KPIs */}
              <div className="space-y-4">
                {metricsLoading ? (
                  // Loading state for KPI widgets
                  <>
                    {[1, 2, 3].map((index) => (
                      <Card
                        key={index}
                        className="bg-white shadow-md border border-gray-200"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                            <div className="p-2 bg-gray-200 rounded-md w-8 h-8 animate-pulse"></div>
                          </div>
                          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                ) : (
                  <>
                    <Card className="bg-white shadow-md border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold text-gray-700">
                            Mis Ingresos [BORRAR]
                          </h3> 
                          <div className="p-1 bg-blue-500 text-white rounded-md">
                            <TrendingUp size={16} />
                          </div>
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {formatCurrency(sellerTotalRevenue)}
                        </div>
                        <div className="flex items-center mt-1 text-xs">
                          <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                          <span className="text-green-500 font-medium">
                            Total generado
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white shadow-md border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold text-gray-700">
                            Mi Comisión
                          </h3>
                          <div className="p-1 bg-purple-500 text-white rounded-md">
                            <DollarSign size={16} />
                          </div>
                        </div>
                        <div className="text-xl font-bold text-purple-600">
                          {formatCurrency(sellerTotalCommission)}
                        </div>
                        <div className="flex items-center mt-1 text-xs">
                          <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                          <span className="text-green-500 font-medium">
                            2.25%
                          </span>
                          <span className="text-gray-500 ml-1">
                            por venta
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white shadow-md border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold text-gray-700">
                            Mis Ventas
                          </h3>
                          <div className="p-1 bg-orange-500 text-white rounded-md">
                            <ShoppingBag size={16} />
                          </div>
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {sellerTotalSales}
                        </div>
                        <div className="flex items-center mt-1 text-xs">
                          <Users className="h-3 w-3 text-blue-500 mr-1" />
                          <span className="text-blue-500 font-medium">
                            Total ventas
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 