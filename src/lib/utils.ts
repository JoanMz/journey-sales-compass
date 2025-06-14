import { TransactionStatus } from "@/contexts/DataContext";
import { Transaction } from "@/types/transactions";
import { AxiosResponse } from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  useSymbol: boolean = true
): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
    currencyDisplay: useSymbol ? "symbol" : "code",
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
    case "terminado": // Mapea "Canceled" a "rejected"
      return "Terminado";
    default:
      console.warn(
        `Estado de transacción desconocido: ${status}. Mapeando a pending.`
      );
      return "Pendiente";
  }
};

export const parseTransactionsResponse = (response: AxiosResponse): Transaction[] => {
  let transactions: Transaction[] = [];

  if (Array.isArray(response.data)) {
    transactions = response.data;
  } else if (response.data && typeof response.data === "object") {
    // If it's an object with a data property that is an array
    if (Array.isArray(response.data.data)) {
      transactions = response.data.data;
    } else {
      // If it's a single transaction object, wrap it in an array
      transactions = [response.data].filter(
        (item) => item && typeof item === "object"
      );
    }
  }
  if (Array.isArray(response.data)) {
    transactions = response.data;
  } else if (response.data && typeof response.data === "object") {
    // If it's an object with a data property that is an array
    if (Array.isArray(response.data.data)) {
      transactions = response.data.data;
    } else {
      // If it's a single transaction object, wrap it in an array
      transactions = [response.data].filter(
        (item) => item && typeof item === "object"
      );
    }
  }
  return transactions
};
