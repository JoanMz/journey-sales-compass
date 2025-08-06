import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { endpoints } from "../../lib/endpoints";
import { toast } from "sonner";

interface EvidenceFormProps {
  transactionId: string;
  onSubmit: (evidenceData: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const EvidenceForm: React.FC<EvidenceFormProps> = ({
  transactionId,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    filename: "",
    evidenceFile: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("El monto es requerido y debe ser mayor a 0");
      return;
    }

    if (!formData.filename.trim()) {
      toast.error("El nombre del archivo es requerido");
      return;
    }

    if (!formData.evidenceFile) {
      toast.error("Debe seleccionar una imagen");
      return;
    }

    try {
      // Primero subir la imagen al webhook
      const imageFormData = new FormData();
      imageFormData.append("payment_evidence", formData.evidenceFile);

      console.log('📤 Subiendo imagen al webhook...');
      const imageResponse = await fetch('https://elder-link-staging-n8n.fwoasm.easypanel.host/webhook/6e0954b7-832f-4817-86cd-9c59f18d8a52', {
        method: 'POST',
        body: imageFormData
      });

      if (!imageResponse.ok) {
        throw new Error("Error al subir la imagen");
      }

      const imageResult = await imageResponse.json();
      console.log('📥 Respuesta del webhook de imagen:', imageResult);

      // Extraer la URL de la imagen
      let imageUrl = null;
      
      // Verificar si la respuesta es un array
      if (Array.isArray(imageResult) && imageResult.length > 0) {
        const firstItem = imageResult[0];
        imageUrl = firstItem.imageUrl || firstItem.url || firstItem.data;
      } else if (typeof imageResult === 'object') {
        // Si es un objeto directo
        imageUrl = imageResult.imageUrl || imageResult.url || imageResult.data;
      }
      
      if (!imageUrl) {
        console.error('❌ Estructura de respuesta inesperada:', imageResult);
        throw new Error("No se recibió URL de la imagen");
      }

      // Preparar datos para el endpoint de evidencia
      const evidenceData = {
        evidence_file: imageUrl,
        amount: parseFloat(formData.amount),
        filename: formData.filename.trim()
      };

      console.log('📤 Enviando datos de evidencia:', evidenceData);
      onSubmit(evidenceData);

    } catch (error) {
      console.error('❌ Error en el proceso:', error);
      toast.error("Error al procesar la evidencia");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        evidenceFile: file
      }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Evidencia de Abono</CardTitle>
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
            <Label htmlFor="filename">Nombre del Archivo *</Label>
            <Input
              id="filename"
              type="text"
              value={formData.filename}
              onChange={(e) => handleInputChange("filename", e.target.value)}
              placeholder="Ej: comprobante_pago_001"
              required
            />
          </div>

          <div>
            <Label htmlFor="evidenceFile">Imagen de Comprobante *</Label>
            <Input
              id="evidenceFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Formatos aceptados: JPG, PNG, GIF
            </p>
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
              {loading ? "Procesando..." : "Agregar Evidencia"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EvidenceForm; 