import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { endpoints } from "../../lib/endpoints";
import { toast } from "sonner";

interface AbonoFormProps {
  transactionId: string;
  onSubmit: (abonoData: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const AbonoForm: React.FC<AbonoFormProps> = ({
  transactionId,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    payment_method: "transfer",
    reference_number: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("El monto del abono es requerido y debe ser mayor a 0");
      return;
    }

    const abonoData = {
      ...formData,
      amount: parseFloat(formData.amount),
      transaction_id: transactionId,
    };

    onSubmit(abonoData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Abono</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Monto del Abono *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descripción del abono (opcional)"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="payment_method">Método de Pago</Label>
            <select
              id="payment_method"
              value={formData.payment_method}
              onChange={(e) => handleInputChange("payment_method", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="transfer">Transferencia</option>
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <div>
            <Label htmlFor="reference_number">Número de Referencia</Label>
            <Input
              id="reference_number"
              type="text"
              value={formData.reference_number}
              onChange={(e) => handleInputChange("reference_number", e.target.value)}
              placeholder="Número de referencia del pago (opcional)"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Agregando..." : "Agregar Abono"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AbonoForm; 