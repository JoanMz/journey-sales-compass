import { useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { SalesTransaction, FlightInfo, HotelInfo } from "../types/sales";
import { mapStatusToSpanish } from "../lib/utils";
import { updateTransactionWithFlightHotel } from "../lib/api";
import { toast } from "sonner";

export const useTransactions = () => {
  const { isAdmin, user } = useAuth();
  const { transactions, loading, refreshTransactions, addTransaction } = useData();

  // Convert transactions to sales format with proper status mapping
  const salesTransactions: SalesTransaction[] = useMemo(() => 
    transactions.map(transaction => ({
      ...transaction,
      customerAvatar: "",
      displayStatus: mapStatusToSpanish(transaction.status)
    })), [transactions]
  );

  // Filter transactions for the current user if not admin
  const filteredTransactions = useMemo(() => 
    isAdmin
      ? salesTransactions
      : salesTransactions.filter(transaction => 
          transaction.seller_id.toString() === user?.id?.toString()
        ), [isAdmin, salesTransactions, user?.id]
  );

  // Group transactions by status for Kanban view
  const kanbanGroups = useMemo(() => ({
    "Pendiente": filteredTransactions.filter(transaction => transaction.displayStatus === "Pendiente"),
    "Aprobado": filteredTransactions.filter(transaction => transaction.displayStatus === "Aprobado"),
    "Terminado": filteredTransactions.filter(transaction => transaction.displayStatus === "Terminado"),
    "Rechazado": filteredTransactions.filter(transaction => transaction.displayStatus === "Rechazado"),
  }), [filteredTransactions]);

  const handleAddSale = async (formData: FormData) => {
    try {
      console.log('Creating new sale with file:', formData);
      const result = await addTransaction(formData);
      console.log('Sale created successfully:', result);
      await refreshTransactions();
      return result;
    } catch (error) {
      console.error('Error creating sale:', error);
      throw new Error('Error al crear la venta');
    }
  };

  const handleCompleteTransaction = async (
    transactionId: number,
    flightInfo: FlightInfo,
    hotelInfo: HotelInfo
  ) => {
    try {
      if (!transactionId) {
        toast.error("No hay transacción seleccionada para completar.");
        return;
      }
      await updateTransactionWithFlightHotel(transactionId, flightInfo, hotelInfo);
      toast.success("Venta completada exitosamente");
      await refreshTransactions();
    } catch (error) {
      toast.error("Error al completar la venta");
      console.error(error);
      throw error;
    }
  };

  return {
    salesTransactions,
    filteredTransactions,
    kanbanGroups,
    loading,
    handleAddSale,
    handleCompleteTransaction,
    refreshTransactions
  };
}; 