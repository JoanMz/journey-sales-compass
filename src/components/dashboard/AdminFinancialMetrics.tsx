import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  DollarSign,
  Users,
  ShoppingBag,
  ArrowUp,
} from "lucide-react";
import TimePeriodFilter, { TimePeriod } from "./TimePeriodFilter";
import SellerFilter from "./SellerFilter";
import {
  getTransactionsByMixedFilters,
  getTransactionsByPeriod,
  getTotalIncomeMetrics,
  getTotalIncomeBySeller,
} from "@/lib/api";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
registerLocale("es", es);
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Transaction, TotalIncomeMetrics } from "@/types/transactions";
import { formatCurrency, mapStatusToSpanish } from "@/lib/utils";
import { useData } from "@/contexts/DataContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import "./dashboardStyles.css";

// Define chart colors matching the uploaded image
const CHART_COLORS = ["#2563eb", "#16a34a", "#dc2626", "#7c3aed"];

const AdminFinancialMetrics: React.FC = () => {
  const {
    transactions,
    loading: contextLoading,
    error: contextError,
  } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);
  const [metricsData, setMetricsData] = useState<TotalIncomeMetrics | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (transactions.length > 0) {
      fetchFilteredData();
    }
    fetchMetricsData(undefined, undefined, selectedSellerId);
  }, []);

  const [dateRange, setDateRange] = useState([
    // moment().subtract(3, "months").startOf("month").toDate(),
    null,
    // moment().endOf("month").toDate(),
    null,
  ]);
  const [startDate, endDate] = dateRange;

  const fetchMetricsData = async (fecha_inicio?: string, fecha_fin?: string, sellerId?: number | null) => {
    try {
      setLoading(true);
      let data;
      
      if (sellerId !== null && sellerId !== undefined) {
        // Use seller-specific metrics when a seller is selected
        data = await getTotalIncomeBySeller(sellerId, fecha_inicio, fecha_fin);
      } else {
        // Use general metrics when no seller is selected
        data = await getTotalIncomeMetrics(fecha_inicio, fecha_fin);
      }
      
      setMetricsData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching metrics data:", err);
      setError("Error al cargar las métricas");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredData = async () => {
    try {
      setLoading(true);
      if (selectedSellerId === null && timePeriod === "all") {
        // Use transactions from context for "all" period with no seller filter
        setFilteredTransactions(transactions);
      } else if (selectedSellerId === null) {
        const response = await getTransactionsByPeriod(timePeriod);
        const data = response;
        setFilteredTransactions(Array.isArray(data) ? data : []);
      } else {
        const response = await getTransactionsByMixedFilters(
          timePeriod,
          selectedSellerId
        );
        const data = response;
        setFilteredTransactions(Array.isArray(data) ? data : []);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching filtered transactions:", err);
      setError("No se pudieron cargar las transacciones filtradas");
      // Fallback to context transactions
      setFilteredTransactions(transactions);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredDatav2 = async (timePeriod2: TimePeriod) => {
    try {
      setLoading(true);
      if (selectedSellerId === null && timePeriod2 === "all") {
        // Use transactions from context for "all" period with no seller filter
        setFilteredTransactions(transactions);
        setLoading(false);
      } else if (selectedSellerId === null) {
        const response = await getTransactionsByPeriod(timePeriod2);
        const data = response;
        setFilteredTransactions(Array.isArray(data) ? data : []);
        setLoading(false);
      } else {
        const response = await getTransactionsByMixedFilters(
          timePeriod2,
          selectedSellerId
        );
        const data = response;
        setFilteredTransactions(Array.isArray(data) ? data : []);
        setLoading(false);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching filtered transactions:", err);
      setError("No se pudieron cargar las transacciones filtradas");
      // Fallback to context transactions
      setFilteredTransactions(transactions);
    } finally {
      setLoading(false);
    }
  };

  // Use context transactions as fallback when no filtered data
  const displayTransactions =
    filteredTransactions.length > 0 ? filteredTransactions : transactions;

  // Calculate key metrics from API data
  const totalRevenue = metricsData?.total_ingresos || 0;
  const totalProfit = metricsData?.total_ganancias || 0;
  const totalCommission = metricsData?.total_comision || 0;
  const totalSales = metricsData?.estadisticas_ventas?.total_ventas || 0;

  // Prepare data for charts
  const prepareMonthlyData = () => {
    const monthlyData: {
      [key: string]: { month: string; revenue: number; sales: number };
    } = {};

    displayTransactions.forEach((transaction) => {
      const date = new Date(transaction.start_date);
      const monthYear = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { month: monthYear, revenue: 0, sales: 0 };
      }

      monthlyData[monthYear].revenue += transaction.amount;
      monthlyData[monthYear].sales += 1;
    });

    return Object.values(monthlyData).sort((a, b) => {
      return a.month.localeCompare(b.month);
    });
  };

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
      terminado: "Terminado"
    };

    return Object.entries(estadisticas_ventas)
      .filter(([key]) => key !== "total_ventas")
      .map(([key, value]) => ({
        name: statusMapping[key as keyof typeof statusMapping] || key,
        value,
      }));
  };

  const prepareSellerCommissionData = () => {
    const sellerCommissions: {
      [key: string]: { name: string; value: number };
    } = {};

    displayTransactions.forEach((transaction) => {
      const sellerName = transaction.seller_name || "Unknown";
      const commission = transaction.amount * 0.0225; // 2.25% commission

      if (!sellerCommissions[sellerName]) {
        sellerCommissions[sellerName] = { name: sellerName, value: 0 };
      }

      sellerCommissions[sellerName].value += commission;
    });

    return Object.values(sellerCommissions);
  };

  const monthlyData = prepareMonthlyData();
  const statusData = prepareStatusData();
  const commissionData = prepareSellerCommissionData();

  const handlePeriodChange = (period: TimePeriod) => {
    console.log("period", period);
    setTimePeriod(period);
    fetchFilteredDatav2(period);
  };

  const handleSellerChange = (sellerId: number | null) => {
    setSelectedSellerId(sellerId);
    
    // Fetch metrics data with the new seller selection
    if (!startDate && !endDate) {
      // No date range selected, fetch all data
      fetchMetricsData(undefined, undefined, sellerId);
    } else if (startDate && endDate) {
      // Date range is selected, use it
      const fecha_inicio = moment(startDate).format("YYYY-MM-DD");
      const fecha_fin = moment(endDate).format("YYYY-MM-DD");
      fetchMetricsData(fecha_inicio, fecha_fin, sellerId);
    }
  };

  const isLoading = contextLoading || loading;
  const displayError = contextError || error;

  /**
   * Esta funcion se llama cuando se selecciona un rango de fechas
   * @param {Array} update - El rango de fechas seleccionado
   */
  const handleDateRangeChange = (update) => {
    const [start, end] = update;
    
    // Actualizar el estado del rango de fechas
    setDateRange([start, end]);

    // Solo hacer búsqueda si ambas fechas están seleccionadas o si no hay fechas
    if (!start && !end) {
      // No hay fechas seleccionadas, obtener todos los datos
      fetchMetricsData(undefined, undefined, selectedSellerId);
    } else if (start && end) {
      // Usar exactamente las fechas seleccionadas por el usuario
      const fecha_inicio = moment(start).format("YYYY-MM-DD");
      const fecha_fin = moment(end).format("YYYY-MM-DD");
      fetchMetricsData(fecha_inicio, fecha_fin, selectedSellerId);
    }
    // Si solo hay una fecha seleccionada, NO hacer búsqueda (esperar a la segunda fecha)
  };

  return (
    <Card className="bg-white border-blue-200 mb-6">
      {loading ? (
        <>
          <div className="flex justify-center py-6">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        </>
      ) : (
        <>
          <CardHeader className="pb-2 border-b border-blue-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-blue-700">
                  Métricas de Ventas
                </CardTitle>
                {metricsData?.titulo_periodo && (
                  <p className="text-sm text-gray-600 mt-1">
                    {metricsData.titulo_periodo}
                  </p>
                )}
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <SellerFilter
                  selectedSellerId={selectedSellerId}
                  onSellerChange={handleSellerChange}
                />

                <DatePicker
                  locale="es"
                  selectsRange={true}
                  // showMonthYearPicker
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleDateRangeChange}
                  isClearable={true}
                  placeholderText="Selecciona un rango de fechas"
                  dateFormat="MM/dd/yyyy"
                  showDisabledMonthNavigation
                  className="w-[300px] h-[30px] border-2 border-blue-200 rounded-md px-2 py-5"
                  // className="form-control custom-datepicker-range"
                  // minDate={moment().subtract(5, "months").startOf("month").toDate()}
                  // maxDate={
                  //   startDate
                  //     ? moment().endOf("month").isBefore(addMonths(startDate, 5))
                  //       ? moment().endOf("month").toDate()
                  //       : addMonths(startDate, 5)
                  //     : moment().endOf("month").toDate()
                  // }
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : displayError ? (
              <div className="text-center text-red-500 py-4">
                {displayError}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Sales Status Distribution - Left side taking full height */}
                  <Card className="bg-white shadow-md border border-gray-200 lg:col-span-2">
                    <CardHeader className="pb-2 border-b border-gray-200">
                      <CardTitle className="text-gray-700 text-lg">
                        Distribución de ventas por estado
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="h-[500px] flex items-center justify-center">
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
                                  fill={
                                    CHART_COLORS[index % CHART_COLORS.length]
                                  }
                                />
                              ))}
                            </Pie>
                            <Legend verticalAlign="bottom" height={36} />
                            <Tooltip
                              formatter={(value, name) => [
                                `${value} ventas`,
                                name,
                              ]}
                              labelFormatter={() => "Estado"}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* KPIs - Right side in vertical column */}
                  <div className="space-y-6">
                    <Card className="bg-white shadow-md border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-700">
                            Ingresos Totales
                          </h3>
                          <div className="p-2 bg-blue-500 text-white rounded-md">
                            <TrendingUp size={20} />
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                          {formatCurrency(totalRevenue)}
                        </div>
                        <div className="flex items-center mt-2 text-sm">
                          <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-500 font-medium">
                            +12.5%
                          </span>
                          <span className="text-gray-500 ml-1">
                            (vs mes anterior)
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white shadow-md border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-700">
                            Ganancia (15%)
                          </h3>
                          <div className="p-2 bg-green-500 text-white rounded-md">
                            <DollarSign size={20} />
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-green-600">
                          {formatCurrency(totalProfit)}
                        </div>
                        <div className="flex items-center mt-2 text-sm">
                          <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-500 font-medium">
                            +5.1%
                          </span>
                          <span className="text-gray-500 ml-1">
                            (vs mes anterior)
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white shadow-md border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-700">
                            Comisión a Vendedores
                          </h3>
                          <div className="p-2 bg-purple-500 text-white rounded-md">
                            <Users size={20} />
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                          {formatCurrency(totalCommission)}
                        </div>
                        <div className="flex items-center mt-2 text-sm">
                          <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-500 font-medium">
                            +2.3%
                          </span>
                          <span className="text-gray-500 ml-1">
                            (vs mes anterior)
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white shadow-md border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-700">
                            Total Ventas
                          </h3>
                          <div className="p-2 bg-orange-500 text-white rounded-md">
                            <ShoppingBag size={20} />
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                          {totalSales}
                        </div>
                        <div className="flex items-center mt-2 text-sm">
                          <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-500 font-medium">
                            +8.2%
                          </span>
                          <span className="text-gray-500 ml-1">
                            (vs mes anterior)
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* Revenue Chart */}
                  <Card className="bg-white shadow-md border border-gray-200">
                    <CardHeader className="pb-2 border-b border-gray-200">
                      <CardTitle className="text-gray-700 text-lg">
                        Ingresos por período
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={monthlyData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f0f0f0"
                            />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis
                              tickFormatter={(value) => {
                                return new Intl.NumberFormat("es-CO", {
                                  notation: "compact",
                                  compactDisplay: "short",
                                  style: "currency",
                                  currency: "COP",
                                  maximumFractionDigits: 1,
                                }).format(value);
                              }}
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                              formatter={(value) => [
                                formatCurrency(value as number),
                                "Ingresos",
                              ]}
                              labelFormatter={(label) => `Periodo: ${label}`}
                            />
                            <Bar
                              dataKey="revenue"
                              fill="#2563eb"
                              name="Ingresos"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Commission Distribution */}
                  <Card className="bg-white shadow-md border border-gray-200">
                    <CardHeader className="pb-2 border-b border-gray-200">
                      <CardTitle className="text-gray-700 text-lg">
                        Distribución de comisiones por vendedor
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={commissionData}
                            layout="vertical"
                            margin={{
                              top: 5,
                              right: 30,
                              left: isMobile ? 60 : 100,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f0f0f0"
                            />
                            <XAxis
                              type="number"
                              tickFormatter={(value) =>
                                formatCurrency(value, false)
                              }
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis
                              dataKey="name"
                              type="category"
                              width={80}
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                              formatter={(value) => [
                                formatCurrency(value as number),
                                "Comisión",
                              ]}
                              labelFormatter={(label) => `Vendedor: ${label}`}
                            />
                            <Bar
                              dataKey="value"
                              fill="#7c3aed"
                              radius={[0, 4, 4, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default AdminFinancialMetrics;
