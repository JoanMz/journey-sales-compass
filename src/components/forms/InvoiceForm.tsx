import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface InvoiceFormData {
  ciudad_salida: string;
  ciudad_llegada: string;
  fecha_inicio: string;
  fecha_regreso: string;
  tarifa_adulto: number;
  tarifa_nino: number;
}

interface InvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InvoiceFormData) => void;
  transactionId?: string;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  transactionId
}) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    ciudad_salida: '',
    ciudad_llegada: '',
    fecha_inicio: '',
    fecha_regreso: '',
    tarifa_adulto: 0,
    tarifa_nino: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof InvoiceFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Validar campos requeridos
      if (!formData.ciudad_salida || !formData.ciudad_llegada || 
          !formData.fecha_inicio || !formData.fecha_regreso) {
        alert('Por favor completa todos los campos requeridos');
        setIsSubmitting(false);
        return;
      }

      if (formData.tarifa_adulto <= 0 || formData.tarifa_nino <= 0) {
        alert('Las tarifas deben ser mayores a 0');
        setIsSubmitting(false);
        return;
      }

      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error generando factura:', error);
      alert('Error al generar la factura');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-800">
            Generar Factura
            {transactionId && (
              <span className="text-sm text-gray-500 ml-2">
                (Transacción #{transactionId})
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ciudad_salida">Ciudad de salida *</Label>
              <Input
                id="ciudad_salida"
                value={formData.ciudad_salida}
                onChange={(e) => updateField('ciudad_salida', e.target.value)}
                placeholder="Ciudad de origen"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ciudad_llegada">Ciudad de llegada *</Label>
              <Input
                id="ciudad_llegada"
                value={formData.ciudad_llegada}
                onChange={(e) => updateField('ciudad_llegada', e.target.value)}
                placeholder="Ciudad de destino"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_inicio">Fecha de inicio *</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => updateField('fecha_inicio', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_regreso">Fecha de regreso *</Label>
              <Input
                id="fecha_regreso"
                type="date"
                value={formData.fecha_regreso}
                onChange={(e) => updateField('fecha_regreso', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tarifa_adulto">Tarifa por adulto *</Label>
              <Input
                id="tarifa_adulto"
                type="number"
                min="0"
                step="0.01"
                value={formData.tarifa_adulto}
                onChange={(e) => updateField('tarifa_adulto', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tarifa_nino">Tarifa por niño *</Label>
              <Input
                id="tarifa_nino"
                type="number"
                min="0"
                step="0.01"
                value={formData.tarifa_nino}
                onChange={(e) => updateField('tarifa_nino', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Generando...' : 'Generar Factura'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceForm; 