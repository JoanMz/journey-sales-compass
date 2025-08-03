
import { Transaction, Traveler, FlightInfo, HotelInfo } from "./transactions";
export type { FlightInfo, HotelInfo };

// Unified sales transaction type that extends the base transaction
export interface SalesTransaction extends Transaction {
  // Additional UI-specific fields for backward compatibility
  customerAvatar?: string;
  displayStatus: "Pendiente" | "Aprobado" | "Rechazado"| "Terminado" | "Incompleta";
  payment_status?: "pending" | "paid" | "cancelled";
}

// Form data for creating new sales with image uploads
export interface SalesFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDni: string;
  customerAddress: string;
  package: string;
  quotedFlight?: string;
  agencyCost: number;
  amount: number;
  paidAmount: number;
  documentType: string;
  transactionType: "venta" | "abono";
  startDate: string;
  endDate: string;
  travelers: TravelerFormData[];
  invoiceImage: File;
  // Nuevos campos para información de vuelo (itinerario) - ahora es un array
  flightInfo?: Array<{
    aerolinea: string;
    ruta: string;
    fecha: string;
    hora_salida: string;
    hora_llegada: string;
  }>;
  // Nuevos campos para información de hotel (travel_info) - ahora es un array
  hotelInfo?: Array<{
    hotel: string;
    noches: number;
    incluye: string[];
    no_incluye: string[];
    alimentacion: string;
    acomodacion: string;
    direccion_hotel: string;
    pais_destino: string;
    ciudad_destino: string;
    cuentas_recaudo: {
      banco: string;
      numero: string;
      nombre: string;
      nit: string;
    };
  }>;
}

// Traveler form data with image upload
export interface TravelerFormData extends Omit<Traveler, 'id' | 'dni_image' | 'date_birth'> {
  date_birth: string;
  dniImage?: File;
  tipo_documento?: string;
}
// Image upload component props
// export interface ImageUploadProps {
//   label: string;
//   onImageSelect: (file: File | null) => void;
//   currentImage?: string;
//   accept?: string;
//   required?: boolean;
// }

