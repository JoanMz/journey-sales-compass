import { useState } from "react";

export const useDialogs = () => {
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
  const [isCompleteInfoOpen, setIsCompleteInfoOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);

  const openAddSale = () => setIsAddSaleOpen(true);
  const closeAddSale = () => setIsAddSaleOpen(false);

  const openCompleteInfo = (transactionId: number) => {
    setSelectedTransactionId(transactionId);
    setIsCompleteInfoOpen(true);
  };

  const closeCompleteInfo = () => {
    setIsCompleteInfoOpen(false);
    setSelectedTransactionId(null);
  };

  return {
    // Add Sale Dialog
    isAddSaleOpen,
    openAddSale,
    closeAddSale,
    
    // Complete Info Dialog
    isCompleteInfoOpen,
    selectedTransactionId,
    openCompleteInfo,
    closeCompleteInfo
  };
}; 