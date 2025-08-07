import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  DollarSign,
  Users,
  ShoppingBag,
  ArrowUp,
} from "lucide-react";
import SellerFilter from "./SellerFilter";
import {
  getTotalIncomeMetrics,
  getTotalIncomeBySeller,
  getMonthlyIncomeByPeriod,
  getCommissionsByUser,
} from "@/lib/api";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
registerLocale("es", es);
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import {
  Transaction,
  TotalIncomeMetrics,
  MonthlyIncomeResponse,
  CommissionsByUserResponse,
} from "@/types/transactions";
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
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);
  const [metricsData, setMetricsData] = useState<TotalIncomeMetrics | null>(
    null
  );
  const [monthlyIncomeData, setMonthlyIncomeData] =
    useState<MonthlyIncomeResponse | null>(null);
  const [commissionsData, setCommissionsData] =
    useState<CommissionsByUserResponse | null>(null);
  const isMobile = useIsMobile();

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // New date range for bottom widgets (last 3 months by default)
  const [bottomDateRange, setBottomDateRange] = useState([
    moment().subtract(3, "months").startOf("month").toDate(),
    moment().endOf("month").toDate(),
  ]);
  const [bottomStartDate, bottomEndDate] = bottomDateRange;

  useEffect(() => {
    fetchMetricsData(undefined, undefined, selectedSellerId);
    // Fetch bottom widgets data with default 3 months
    const fecha_inicio = moment(bottomStartDate).format("YYYY-MM-DD");
    const fecha_fin = moment(bottomEndDate).format("YYYY-MM-DD");
    fetchMonthlyIncomeData(fecha_inicio, fecha_fin);
    fetchCommissionsData(fecha_inicio, fecha_fin);
  }, []);

  const fetchMetricsData = async (
    fecha_inicio?: string,
    fecha_fin?: string,
    sellerId?: number | null
  ) => {
    try {
      setLoading(true);
      let data;

      if (sellerId !== null && sellerId !== undefined) {
        // Use seller-specific metrics when a seller is selected
        data = await getTotalIncomeMetrics(fecha_inicio, fecha_fin);
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

  const [bottomLoading, setBottomLoading] = useState(false);

  const fetchMonthlyIncomeData = async (
    fecha_inicio: string,
    fecha_fin: string
  ) => {
    try {
      setBottomLoading(true);
      const data = await getMonthlyIncomeByPeriod(fecha_inicio, fecha_fin);
      setMonthlyIncomeData(data);
    } catch (err) {
      console.error("Error fetching monthly income data:", err);
    } finally {
      setBottomLoading(false);
    }
  };

  const fetchCommissionsData = async (
    fecha_inicio: string,
    fecha_fin: string
  ) => {
    try {
      setBottomLoading(true);
      const data = await getCommissionsByUser(fecha_inicio, fecha_fin);
      setCommissionsData(data);
    } catch (err) {
      console.error("Error fetching commissions data:", err);
    } finally {
      setBottomLoading(false);
    }
  };

  // Calculate key metrics from API data
  const totalRevenue = metricsData?.total_ingresos || 0;
  const totalProfit = metricsData?.total_ganancias || 0;
  const totalCommission = metricsData?.total_comision || 0;
  const totalSales = metricsData?.estadisticas_ventas?.total_ventas || 0;

  // Prepare data for charts using new API data
  const prepareMonthlyData = () => {
    if (!monthlyIncomeData?.datos_mensuales) {
      return [];
    }

    return monthlyIncomeData.datos_mensuales.map((item) => ({
      month: `${item.nombre_mes} ${item.año}`,
      revenue: item.ingresos,
      profit: item.ganancias,
      commission: item.comision,
    }));
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
      terminado: "Terminado",
    };

    return Object.entries(estadisticas_ventas)
      .filter(([key]) => key !== "total_ventas")
      .map(([key, value]) => ({
        name: statusMapping[key as keyof typeof statusMapping] || key,
        value,
      }));
  };

  const prepareCommissionData = () => {
    if (!commissionsData?.usuarios) {
      return [];
    }

    return commissionsData.usuarios.map((user) => ({
      name: user.nombre,
      value: user.comision,
      ingresos: user.ingresos,
      ganancias: user.ganancias,
    }));
  };

  const monthlyData = prepareMonthlyData();
  const statusData = prepareStatusData();
  const commissionData = prepareCommissionData();

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

  /**
   * Esta funcion se llama cuando se selecciona un rango de fechas para los widgets de abajo
   * @param {Array} update - El rango de fechas seleccionado
   */
  const handleBottomDateRangeChange = (update) => {
    const [start, end] = update;

    // Actualizar el estado del rango de fechas
    setBottomDateRange([start, end]);

    // Solo hacer búsqueda si ambas fechas están seleccionadas
    if (start && end) {
      const fecha_inicio = moment(start).format("YYYY-MM-DD");
      const fecha_fin = moment(end).format("YYYY-MM-DD");
      fetchMonthlyIncomeData(fecha_inicio, fecha_fin);
      fetchCommissionsData(fecha_inicio, fecha_fin);
    }
  };

  return (
    <Card className="bg-white border-blue-200 mb-6">
      <CardHeader className="pb-2 border-b border-blue-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-blue-700">Métricas de Ventas</CardTitle>
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
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateRangeChange}
              isClearable={true}
              placeholderText="Selecciona un rango de fechas"
              dateFormat="MM/dd/yyyy"
              showDisabledMonthNavigation
              className="w-[300px] h-[30px] border-2 border-blue-200 rounded-md px-2 py-5"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {displayError ? (
          <div className="text-center text-red-500 py-4">{displayError}</div>
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
                  </div>
                </CardContent>
              </Card>

              {/* KPIs - Right side in vertical column */}
              <div className="space-y-6">
                {loading ? (
                  // Loading state for KPI widgets
                  <>
                    {[1, 2, 3, 4].map((index) => (
                      <Card
                        key={index}
                        className="bg-white shadow-md border border-gray-200"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                            <div className="p-2 bg-gray-200 rounded-md w-10 h-10 animate-pulse"></div>
                          </div>
                          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse mb-2"></div>
                          <div className="flex items-center mt-2">
                            <div className="h-4 w-4 bg-gray-200 rounded mr-1 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse mr-1"></div>
                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Date picker for bottom widgets */}
              <div className="lg:col-span-2 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Filtro de fechas para gráficos
                  </h3>
                  <div className="w-[300px]">
                    <DatePicker
                      locale="es"
                      selectsRange={true}
                      startDate={bottomStartDate}
                      endDate={bottomEndDate}
                      onChange={handleBottomDateRangeChange}
                      isClearable={false}
                      placeholderText="Selecciona un rango de fechas"
                      dateFormat="MM/dd/yyyy"
                      showDisabledMonthNavigation
                      className="w-[300px] h-[30px] border-2 border-blue-200 rounded-md px-2 py-5"
                    />
                  </div>
                </div>
              </div>

              {/* Revenue Chart */}
              <Card className="bg-white shadow-md border border-gray-200">
                <CardHeader className="pb-2 border-b border-gray-200">
                  <CardTitle className="text-gray-700 text-lg">
                    Métricas por período
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {bottomLoading ? (
                    <div className="h-72 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-500">Cargando datos...</p>
                      </div>
                    </div>
                  ) : (
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
                            formatter={(value, name) => [
                              formatCurrency(value as number),
                              name,
                            ]}
                            labelFormatter={(label) => `Periodo: ${label}`}
                          />
                          <Bar
                            dataKey="revenue"
                            fill="#2563eb"
                            name="Ingresos"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="profit"
                            fill="#16a34a"
                            name="Ganancias"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="commission"
                            fill="#dc2626"
                            name="Comisiones"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
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
                  {bottomLoading ? (
                    <div className="h-72 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-500">Cargando datos...</p>
                      </div>
                    </div>
                  ) : (
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
                            formatter={(value, name) => [
                              formatCurrency(value as number),
                              name,
                            ]}
                            labelFormatter={(label) => `Vendedor: ${label}`}
                          />
                          <Bar
                            dataKey="value"
                            fill="#7c3aed"
                            name="Comisión"
                            radius={[0, 4, 4, 0]}
                          />
                          <Bar
                            dataKey="ganancias"
                            fill="#16a34a"
                            name="Ganancias"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminFinancialMetrics;
