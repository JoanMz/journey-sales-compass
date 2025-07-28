
import { Transaction, Traveler, FlightInfo, HotelInfo } from "./transactions";
export type { FlightInfo, HotelInfo };

// Unified sales transaction type that extends the base transaction
export interface SalesTransaction extends Transaction {
  // Additional UI-specific fields for backward compatibility
  customerAvatar?: string;
  displayStatus: "Pendiente" | "Aprobado" | "Rechazado"| "Terminado";
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
  transactionType: "venta" | "abono";
  startDate: string;
  endDate: string;
  travelers: TravelerFormData[];
  invoiceImage: File;
}

// Traveler form data with image upload
export interface TravelerFormData extends Omit<Traveler, 'id' | 'dni_image' | 'date_birth'> {
  date_birth: string;
  dniImage?: File;
}

// Image upload component props
// export interface ImageUploadProps {
//   label: string;
//   onImageSelect: (file: File | null) => void;
//   currentImage?: string;
//   accept?: string;
//   required?: boolean;
// }
