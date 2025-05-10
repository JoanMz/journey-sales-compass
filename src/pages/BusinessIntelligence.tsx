
import React from 'react';
import AppLayout from "../components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  Users, 
  Map, 
  Calendar,
  TrendingUp
} from "lucide-react";

// Import Business Intelligence Components
import TravelMap from "../components/bi/TravelMap";
import TopDestinationsChart from "../components/bi/TopDestinationsChart";
import PackageAnalytics from "../components/bi/PackageAnalytics";
import KeyMetricsCard from "../components/bi/KeyMetricsCard";
import SeasonalTrendsChart from "../components/bi/SeasonalTrendsChart";
import ConversionRateCard from "../components/bi/ConversionRateCard";

// Sample data for the dashboard
const destinations = [
  { name: "Cancún", lat: 21.1619, lng: -86.8515, popularity: 85 },
  { name: "Ciudad de México", lat: 19.4326, lng: -99.1332, popularity: 72 },
  { name: "Guanajuato", lat: 21.0190, lng: -101.2574, popularity: 65 },
  { name: "Los Cabos", lat: 22.8905, lng: -109.9167, popularity: 80 },
  { name: "Puerto Vallarta", lat: 20.6534, lng: -105.2253, popularity: 75 },
  { name: "Riviera Maya", lat: 20.6274, lng: -87.0799, popularity: 90 },
  { name: "Oaxaca", lat: 17.0732, lng: -96.7266, popularity: 60 },
  { name: "Acapulco", lat: 16.8531, lng: -99.8237, popularity: 55 },
  { name: "San Miguel de Allende", lat: 20.9144, lng: -100.7452, popularity: 70 },
  { name: "Mérida", lat: 20.9670, lng: -89.6237, popularity: 58 }
];

const origins = [
  { name: "Nueva York", lat: 40.7128, lng: -74.0060, count: 120 },
  { name: "Los Ángeles", lat: 34.0522, lng: -118.2437, count: 95 },
  { name: "Chicago", lat: 41.8781, lng: -87.6298, count: 75 },
  { name: "Madrid", lat: 40.4168, lng: -3.7038, count: 60 },
  { name: "Londres", lat: 51.5074, lng: -0.1278, count: 85 },
  { name: "Toronto", lat: 43.6532, lng: -79.3832, count: 70 },
  { name: "Buenos Aires", lat: -34.6037, lng: -58.3816, count: 45 },
  { name: "São Paulo", lat: -23.5505, lng: -46.6333, count: 40 },
  { name: "Bogotá", lat: 4.7110, lng: -74.0721, count: 35 },
  { name: "Santiago", lat: -33.4489, lng: -70.6693, count: 30 }
];

const destinationsChartData = [
  { name: "Cancún", visits: 15240, revenue: 4250000 },
  { name: "Riviera Maya", visits: 12800, revenue: 3800000 },
  { name: "Ciudad de México", visits: 10500, revenue: 2200000 },
  { name: "Los Cabos", visits: 9800, revenue: 3100000 },
  { name: "Puerto Vallarta", visits: 8750, revenue: 2650000 },
  { name: "San Miguel de Allende", visits: 7600, revenue: 1950000 },
  { name: "Oaxaca", visits: 6900, revenue: 1700000 },
  { name: "Guanajuato", visits: 5800, revenue: 1450000 },
  { name: "Mérida", visits: 5200, revenue: 1250000 },
  { name: "Acapulco", visits: 4800, revenue: 1150000 }
];

const packagesData = [
  { name: "Todo Incluido Playa", sales: 4850, revenue: 2900000 },
  { name: "Experiencia Cultural", sales: 3200, revenue: 1600000 },
  { name: "Aventura Ecoturística", sales: 2400, revenue: 1450000 },
  { name: "Ciudades Coloniales", sales: 1850, revenue: 980000 },
  { name: "Viaje Gastronómico", sales: 1450, revenue: 870000 },
  { name: "Ruta del Tequila", sales: 950, revenue: 570000 }
];

const keyMetricsData = [
  { 
    id: "revenue", 
    name: "Ingresos Totales", 
    value: "$12,580,000", 
    change: 12.5, 
    changeTimeframe: "vs mes anterior",
    icon: TrendingUp
  },
  { 
    id: "visitors", 
    name: "Visitantes", 
    value: "45,650", 
    change: 8.2, 
    changeTimeframe: "vs mes anterior",
    icon: Users
  },
  { 
    id: "satisfaction", 
    name: "Satisfacción", 
    value: "92%", 
    change: 3.5, 
    changeTimeframe: "vs mes anterior" 
  },
  { 
    id: "avgSpend", 
    name: "Gasto Promedio", 
    value: "$3,250", 
    change: 5.1, 
    changeTimeframe: "vs mes anterior" 
  },
  { 
    id: "repeatRate", 
    name: "Tasa de Repetición", 
    value: "24%", 
    change: -1.8, 
    changeTimeframe: "vs mes anterior" 
  },
  { 
    id: "leadToSale", 
    name: "Prospectos a Ventas", 
    value: "18%", 
    change: 2.3, 
    changeTimeframe: "vs mes anterior" 
  }
];

const seasonalTrendsData = [
  { month: "Ene", domestic: 2400, international: 4000 },
  { month: "Feb", domestic: 1398, international: 3000 },
  { month: "Mar", domestic: 9800, international: 2000 },
  { month: "Abr", domestic: 3908, international: 2780 },
  { month: "May", domestic: 4800, international: 1890 },
  { month: "Jun", domestic: 3800, international: 2390 },
  { month: "Jul", domestic: 4300, international: 3490 },
  { month: "Ago", domestic: 5300, international: 4300 },
  { month: "Sep", domestic: 4300, international: 2300 },
  { month: "Oct", domestic: 3300, international: 1800 },
  { month: "Nov", domestic: 2400, international: 2400 },
  { month: "Dic", domestic: 5400, international: 3800 }
];

const conversionStepsData = [
  { name: "Visitantes", count: 120000, percentage: 100 },
  { name: "Vista de Paquetes", count: 52000, percentage: 43.3 },
  { name: "Cotizaciones", count: 18000, percentage: 34.6 },
  { name: "Reservas Iniciadas", count: 9500, percentage: 52.7 },
  { name: "Ventas Concretadas", count: 5800, percentage: 61.1 }
];

const BusinessIntelligence = () => {
  return (
    <AppLayout requireAdmin={true}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Business Intelligence - Análisis de Viajes</h1>
          <Button>
            Descargar Informe
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            <TabsTrigger value="destinations">Destinos</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
            <TabsTrigger value="packages">Paquetes</TabsTrigger>
            <TabsTrigger value="forecast">Previsiones</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Performance Metrics */}
            <KeyMetricsCard metrics={keyMetricsData} />
            
            {/* Interactive Travel Map */}
            <TravelMap destinations={destinations} origins={origins} />
            
            {/* Top Destinations and Package Analytics in a grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TopDestinationsChart destinations={destinationsChartData} />
              <PackageAnalytics packages={packagesData} />
            </div>
            
            {/* Seasonal Trends and Conversion Rate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SeasonalTrendsChart data={seasonalTrendsData} />
              <ConversionRateCard steps={conversionStepsData} />
            </div>
          </TabsContent>
          
          <TabsContent value="destinations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Destinos</CardTitle>
                <CardDescription>
                  Análisis detallado de todos los destinos turísticos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Contenido detallado de destinos estará disponible en esta sección</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perfiles de Clientes</CardTitle>
                <CardDescription>
                  Análisis demográfico y comportamental de clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Datos demográficos de clientes estarán disponibles en esta sección</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="packages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paquetes Turísticos</CardTitle>
                <CardDescription>
                  Rendimiento detallado por paquete turístico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Análisis de rendimiento de paquetes estará disponible en esta sección</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="forecast" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Previsiones y Tendencias</CardTitle>
                <CardDescription>
                  Proyecciones de mercado y tendencias futuras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Previsiones y tendencias estarán disponibles en esta sección</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default BusinessIntelligence;
