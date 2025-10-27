
import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ImageUpload from '../ui/image-upload';
import { Plus, Trash2 } from 'lucide-react';
import { TravelerFormData } from '@/types/sales';
import { filterNameInput, filterNumericInput } from '@/utils/validations';

interface TravelerFormProps {
  travelers: TravelerFormData[];
  onTravelersChange: (travelers: TravelerFormData[]) => void;
}

const TravelerForm: React.FC<TravelerFormProps> = ({
  travelers,
  onTravelersChange
}) => {
  const addTraveler = () => {
    const newTraveler: TravelerFormData = {
      name: '',
      dni: '',
      age: 18,
      date_birth: '',
      phone: '',
      dniImage: undefined,
      tipo_documento: ''
    };
    onTravelersChange([...travelers, newTraveler]);
  };

  const removeTraveler = (index: number) => {
    const updated = travelers.filter((_, i) => i !== index);
    onTravelersChange(updated);
  };

  const updateTraveler = (index: number, field: keyof TravelerFormData, value: any) => {
    let filteredValue = value;
    
    // Aplicar filtros según el tipo de campo usando las funciones de validations.ts
    if (field === 'name' && typeof value === 'string') {
      filteredValue = filterNameInput(value);
    } else if ((field === 'dni' || field === 'phone') && typeof value === 'string') {
      filteredValue = filterNumericInput(value);
    }
    
    const updated = travelers.map((traveler, i) => 
      i === index ? { ...traveler, [field]: filteredValue } : traveler
    );
    onTravelersChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Viajeros</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTraveler}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Viajero
        </Button>
      </div>

      {travelers.map((traveler, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Viajero {index + 1}</h4>
            {travelers.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeTraveler(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre completo *</Label>
              <Input
                value={traveler.name}
                onChange={(e) => updateTraveler(index, 'name', e.target.value)}
                placeholder="Nombre del viajero"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Documento de identidad *</Label>
              <Input
                value={traveler.dni}
                onChange={(e) => updateTraveler(index, 'dni', e.target.value)}
                placeholder="Número de documento"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de documento *</Label>
              <Select
                value={traveler.tipo_documento || ""}
                onValueChange={(value) => updateTraveler(index, 'tipo_documento', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dni">DNI</SelectItem>
                  <SelectItem value="pasaporte">Pasaporte</SelectItem>
                  <SelectItem value="cedula">Cédula</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* <div className="space-y-2">
              <Label>Edad *</Label>
              <Input
                type="number"
                value={traveler.age}
                onChange={(e) => updateTraveler(index, 'age', parseInt(e.target.value))}
                min="0"
                max="120"
                required
              />
            </div> */}

            <div className="space-y-2">
              <Label>Fecha de nacimiento *</Label>
              <Input
                type="date"
                value={traveler.date_birth}
                onChange={(e) => updateTraveler(index, 'date_birth', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input
                value={traveler.phone}
                onChange={(e) => updateTraveler(index, 'phone', e.target.value)}
                placeholder="Número de teléfono"
                maxLength={11}
              />
            </div>
          </div>

          <ImageUpload
            label="Documento de identidad"
            onImageSelect={(file) => updateTraveler(index, 'dniImage', file)}
            required
            className="mt-4"
          />
        </div>
      ))}

      {travelers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No hay viajeros agregados</p>
          <Button
            type="button"
            variant="outline"
            onClick={addTraveler}
            className="mt-2"
          >
            Agregar primer viajero
          </Button>
        </div>
      )}
    </div>
  );
};

export default TravelerForm;
