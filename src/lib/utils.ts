
import { TransactionStatus } from "@/contexts/DataContext";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, useSymbol: boolean = true): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
    currencyDisplay: useSymbol ? 'symbol' : 'code',
  }).format(amount);
}

export const mapStatusToSpanish = (status: string): TransactionStatus => {
  // Asegúrate de que el estado de entrada sea consistente (minúsculas, sin espacios extra)
  const normalizedStatus = status.toLowerCase().trim();

  switch (normalizedStatus) {
    case "pending":
    case "on process": // Mapea "On Process" a "pending"
      return "Pendiente";
    case "approved":
    case "success": // Mapea "Success" a "approved"
      return "Aprobado";
    case "rejected":
    case "canceled": // Mapea "Canceled" a "rejected"
      return "Rechazado";
    default:
      console.warn(`Estado de transacción desconocido: ${status}. Mapeando a pending.`);
      return "Pendiente";
  }
};