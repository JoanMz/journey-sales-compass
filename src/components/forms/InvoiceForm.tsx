import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  validateForm, 
  validateCurrency, 
  validateFutureDate,
  formatCurrency, 
  parseCurrencyInput,
  cleanCurrencyInput,
  FormValidationConfig 
} from '@/utils/validations';


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

  // Track which field is currently being edited
  const [editingField, setEditingField] = useState<string | null>(null);

  // Raw input values (what user is typing)
  const [rawInputValues, setRawInputValues] = useState({
    tarifa_adulto: '',
    tarifa_nino: ''
  });

  // Display values for currency inputs (formatted with thousands separators)
  const [displayValues, setDisplayValues] = useState({
    tarifa_adulto: '0,00',
    tarifa_nino: '0,00'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Configuración de validación usando el sistema centralizado
  const validationConfig: FormValidationConfig = {
    ciudad_salida: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    ciudad_llegada: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    fecha_inicio: {
      required: true,
      custom: (value: string) => validateFutureDate(value, "Fecha de inicio")
    },
    fecha_regreso: {
      required: true,
      custom: (value: string) => validateFutureDate(value, "Fecha de regreso")
    },
    tarifa_adulto: {
      required: true,
      custom: (value: number) => validateCurrency(value, "Tarifa por adulto", 0)
    },
    tarifa_nino: {
      custom: (value: number) => value > 0 ? validateCurrency(value, "Tarifa por niño", 0) : { isValid: true }
    }
  };

  // Initialize display values when form opens
  useEffect(() => {
    if (isOpen) {
      setDisplayValues({
        tarifa_adulto: formatCurrency(formData.tarifa_adulto),
        tarifa_nino: formatCurrency(formData.tarifa_nino)
      });
      setRawInputValues({
        tarifa_adulto: formData.tarifa_adulto.toString(),
        tarifa_nino: formData.tarifa_nino.toString()
      });
      setErrors({}); // Limpiar errores al abrir
    }
  }, [isOpen, formData.tarifa_adulto, formData.tarifa_nino]);

  const updateField = (field: keyof InvoiceFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando se modifica
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCurrencyChange = (field: 'tarifa_adulto' | 'tarifa_nino', inputValue: string) => {
    const cleanedValue = cleanCurrencyInput(inputValue);
    
    setRawInputValues(prev => ({
      ...prev,
      [field]: cleanedValue
    }));
  };

  const handleCurrencyBlur = (field: 'tarifa_adulto' | 'tarifa_nino') => {
    const rawValue = rawInputValues[field];
    const numericValue = rawValue === '' ? 0 : parseCurrencyInput(rawValue);
    const formattedValue = formatCurrency(numericValue);
    
    // Update the numeric value in formData
    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }));
    
    // Update the display value with formatting
    setDisplayValues(prev => ({
      ...prev,
      [field]: formattedValue
    }));
    
    // Mark field as no longer being edited
    setEditingField(null);
  };

  const handleCurrencyFocus = (field: 'tarifa_adulto' | 'tarifa_nino') => {
    // Mark field as being edited
    setEditingField(field);
    // Show raw value when focusing for easier editing
    const currentValue = formData[field];
    const rawValue = currentValue === 0 ? '' : currentValue.toString();
    setRawInputValues(prev => ({
      ...prev,
      [field]: rawValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Usar el sistema de validaciones centralizado
      const validationResult = validateForm(formData, validationConfig);
      
      if (!validationResult.isValid) {
        setErrors(validationResult.errors);
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
                className={errors.ciudad_salida ? 'border-red-500' : ''}
              />
              {errors.ciudad_salida && (
                <span className="text-red-500 text-sm">{errors.ciudad_salida}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ciudad_llegada">Ciudad de llegada *</Label>
              <Input
                id="ciudad_llegada"
                value={formData.ciudad_llegada}
                onChange={(e) => updateField('ciudad_llegada', e.target.value)}
                placeholder="Ciudad de destino"
                className={errors.ciudad_llegada ? 'border-red-500' : ''}
              />
              {errors.ciudad_llegada && (
                <span className="text-red-500 text-sm">{errors.ciudad_llegada}</span>
              )}
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
                className={errors.fecha_inicio ? 'border-red-500' : ''}
              />
              {errors.fecha_inicio && (
                <span className="text-red-500 text-sm">{errors.fecha_inicio}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_regreso">Fecha de regreso *</Label>
              <Input
                id="fecha_regreso"
                type="date"
                value={formData.fecha_regreso}
                onChange={(e) => updateField('fecha_regreso', e.target.value)}
                className={errors.fecha_regreso ? 'border-red-500' : ''}
              />
              {errors.fecha_regreso && (
                <span className="text-red-500 text-sm">{errors.fecha_regreso}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tarifa_adulto">Tarifa por adulto *</Label>
              <Input
                id="tarifa_adulto"
                type="text"
                value={editingField === 'tarifa_adulto' ? rawInputValues.tarifa_adulto : displayValues.tarifa_adulto}
                onChange={(e) => handleCurrencyChange('tarifa_adulto', e.target.value)}
                onBlur={() => handleCurrencyBlur('tarifa_adulto')}
                onFocus={() => handleCurrencyFocus('tarifa_adulto')}
                placeholder="Ingresa el valor"
                className={`text-right ${errors.tarifa_adulto ? 'border-red-500' : ''}`}
              />
              {errors.tarifa_adulto && (
                <span className="text-red-500 text-sm">{errors.tarifa_adulto}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tarifa_nino">Tarifa por niño</Label>
              <Input
                id="tarifa_nino"
                type="text"
                value={editingField === 'tarifa_nino' ? rawInputValues.tarifa_nino : displayValues.tarifa_nino}
                onChange={(e) => handleCurrencyChange('tarifa_nino', e.target.value)}
                onBlur={() => handleCurrencyBlur('tarifa_nino')}
                onFocus={() => handleCurrencyFocus('tarifa_nino')}
                placeholder="Ingresa el valor"
                className={`text-right ${errors.tarifa_nino ? 'border-red-500' : ''}`}
              />
              {errors.tarifa_nino && (
                <span className="text-red-500 text-sm">{errors.tarifa_nino}</span>
              )}
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