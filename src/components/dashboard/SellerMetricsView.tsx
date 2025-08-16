import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  DollarSign,
  Users,
  ShoppingBag,
  ArrowUp,
} from "lucide-react";
import {
  getTotalIncomeMetrics,
} from "@/lib/api";
import {
  TotalIncomeMetrics,
} from "@/types/transactions";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuincenalCommissions } from "./QuincenalCommissions";
import moment from "moment";

// Define chart colors matching the uploaded image
const CHART_COLORS = ["#2563eb", "#16a34a", "#dc2626", "#7c3aed"];

const SellerMetricsView: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metricsData, setMetricsData] = useState<TotalIncomeMetrics | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const isMobile = useIsMobile();

  // Fetch metrics when user or date range changes
  useEffect(() => {
    if (user?.id) {
      fetchMetricsData();
    }
  }, [user?.id, selectedDateRange]);

  const fetchMetricsData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getTotalIncomeMetrics(
        selectedDateRange?.startDate, 
        selectedDateRange?.endDate, 
        user.id
      );
      setMetricsData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching seller metrics data:", err);
      setError("Error al cargar las métricas del vendedor");
    } finally {
      setLoading(false);
    }
  };

  // Handle quincenal selection from QuincenalCommissions component
  const handleQuincenaCalculation = () => {
    // This will be triggered when the recalculate button is pressed
    // The QuincenalCommissions component already handles its own logic
    // We just need to sync with any date changes from the quincenal component
    if (user?.id) {
      fetchMetricsData();
    }
  };

  // Listen to quincenal changes by extracting dates from the quincenal component
  const extractQuincenaDates = () => {
    // For now, we'll let the QuincenalCommissions component manage itself
    // and we'll show overall seller metrics
    // Later we can refactor to connect them properly
  };

  // Calculate key metrics from API data
  const totalRevenue = metricsData?.total_ingresos || 0;
  const totalProfit = metricsData?.total_ganancias || 0;
  const totalCommission = metricsData?.total_comision || 0;
  const totalSales = metricsData?.estadisticas_ventas?.total_ventas || 0;

  // Prepare data for sales status chart
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

  const statusData = prepareStatusData();

  if (!user?.id) {
    return (
      <div className="text-center text-red-500 py-4">
        Usuario no identificado
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quincenal Commission Component */}
      <QuincenalCommissions />

      {/* Seller Metrics Section */}
      <Card className="bg-white border-blue-200">
        <CardHeader className="pb-2 border-b border-blue-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-blue-700">Mis Métricas de Ventas</CardTitle>
              {metricsData?.titulo_periodo && (
                <p className="text-sm text-gray-600 mt-1">
                  {metricsData.titulo_periodo}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Status Distribution - Left side taking full height */}
                <Card className="bg-white shadow-md border border-gray-200 lg:col-span-2">
                  <CardHeader className="pb-2 border-b border-gray-200">
                    <CardTitle className="text-gray-700 text-lg">
                      Distribución de mis ventas por estado
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[500px] flex items-center justify-center">
                      {loading ? (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                          <p className="text-gray-500">Cargando datos...</p>
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

                {/* KPIs - Right side in vertical column */}
                <div className="space-y-6">
                  {loading ? (
                    // Loading state for KPI widgets
                    <>
                      {[1, 2, 3].map((index) => (
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
                              Mis Ingresos Totales
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
                              Ventas generadas
                            </span>
                            <span className="text-gray-500 ml-1">
                              por mí
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white shadow-md border border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">
                              Mi Comisión (2.25%)
                            </h3>
                            <div className="p-2 bg-purple-500 text-white rounded-md">
                              <DollarSign size={20} />
                            </div>
                          </div>
                          <div className="text-3xl font-bold text-purple-600">
                            {formatCurrency(totalCommission)}
                          </div>
                          <div className="flex items-center mt-2 text-sm">
                            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-500 font-medium">
                              2.25%
                            </span>
                            <span className="text-gray-500 ml-1">
                              por venta aprobada
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white shadow-md border border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">
                              Mis Ventas Totales
                            </h3>
                            <div className="p-2 bg-orange-500 text-white rounded-md">
                              <ShoppingBag size={20} />
                            </div>
                          </div>
                          <div className="text-3xl font-bold text-gray-900">
                            {totalSales}
                          </div>
                          <div className="flex items-center mt-2 text-sm">
                            <Users className="h-4 w-4 text-blue-500 mr-1" />
                            <span className="text-blue-500 font-medium">
                              Todas mis ventas
                            </span>
                            <span className="text-gray-500 ml-1">
                              registradas
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerMetricsView;
