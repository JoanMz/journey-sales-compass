import { DragEvent } from "react";

type KanbanStatus = "Pendiente" | "Aprobado" | "Rechazado" | "Terminado";

export const useDragAndDrop = () => {
  // Handle dropping a transaction card to a new status column
  const handleDrop = (e: DragEvent<HTMLDivElement>, targetStatus: KanbanStatus) => {
    e.preventDefault();
    const transactionId = e.dataTransfer.getData("text/plain");
    console.log(`Moving transaction ${transactionId} to ${targetStatus}`);
    // TODO: Implement API call to update transaction status
  };

  // Allow dropping
  const allowDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Start drag
  const startDrag = (e: DragEvent<HTMLDivElement>, transactionId: string) => {
    e.dataTransfer.setData("text/plain", transactionId);
  };

  return {
    handleDrop,
    allowDrop,
    startDrag
  };
}; 