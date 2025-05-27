
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import ImageUpload from '../ui/image-upload';
import TravelerForm from './TravelerForm';
import { SalesFormData, TravelerFormData } from '@/types/sales';

interface EnhancedSalesFormProps {
  onSubmit: (data: SalesFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const EnhancedSalesForm: React.FC<EnhancedSalesFormProps> = ({
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<SalesFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerDni: '',
    customerAddress: '',
    package: '',
    quotedFlight: '',
    agencyCost: 0,
    amount: 0,
    transactionType: 'Nacional',
    startDate: '',
    endDate: '',
    travelers: [],
    invoiceImage: undefined
  });

  const updateField = (field: keyof SalesFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.customerName || !formData.package || !formData.amount) {
      alert('Por favor completa los campos obligatorios');
      return;
    }
    
    if (formData.travelers.length === 0) {
      alert('Debe agregar al menos un viajero');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Customer Information */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">
          Información del Cliente
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nombre completo *</Label>
            <Input
              value={formData.customerName}
              onChange={(e) => updateField('customerName', e.target.value)}
              placeholder="Nombre del cliente"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Email *</Label>
            <Input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => updateField('customerEmail', e.target.value)}
              placeholder="email@ejemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Teléfono *</Label>
            <Input
              value={formData.customerPhone}
              onChange={(e) => updateField('customerPhone', e.target.value)}
              placeholder="Número de teléfono"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Documento de identidad *</Label>
            <Input
              value={formData.customerDni}
              onChange={(e) => updateField('customerDni', e.target.value)}
              placeholder="Número de documento"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Dirección *</Label>
          <Textarea
            value={formData.customerAddress}
            onChange={(e) => updateField('customerAddress', e.target.value)}
            placeholder="Dirección completa del cliente"
            required
          />
        </div>
      </div>

      {/* Package Information */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">
          Información del Paquete
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Paquete turístico *</Label>
            <Input
              value={formData.package}
              onChange={(e) => updateField('package', e.target.value)}
              placeholder="Nombre del paquete"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de transacción *</Label>
            <Select
              value={formData.transactionType}
              onValueChange={(value: "Nacional" | "Internacional") => updateField('transactionType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nacional">Nacional</SelectItem>
                <SelectItem value="Internacional">Internacional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Vuelo cotizado</Label>
            <Input
              value={formData.quotedFlight}
              onChange={(e) => updateField('quotedFlight', e.target.value)}
              placeholder="Ruta del vuelo"
            />
          </div>

          <div className="space-y-2">
            <Label>Costo de agencia *</Label>
            <Input
              type="number"
              value={formData.agencyCost}
              onChange={(e) => updateField('agencyCost', parseFloat(e.target.value))}
              placeholder="Costo para la agencia"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Precio total *</Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => updateField('amount', parseFloat(e.target.value))}
              placeholder="Precio total del paquete"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha de inicio *</Label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha de fin *</Label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
              required
            />
          </div>
        </div>

        <ImageUpload
          label="Factura"
          onImageSelect={(file) => updateField('invoiceImage', file)}
          required
        />
      </div>

      {/* Travelers */}
      <div className="bg-white p-6 rounded-lg border">
        <TravelerForm
          travelers={formData.travelers}
          onTravelersChange={(travelers) => updateField('travelers', travelers)}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6">
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
          className="bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Crear Venta'}
        </Button>
      </div>
    </form>
  );
};

export default EnhancedSalesForm;
