
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, X } from 'lucide-react';
import { FlightInfo, HotelInfo } from '@/types/transactions';

interface FlightHotelFormProps {
  onSubmit: (flightInfo: FlightInfo, hotelInfo: HotelInfo) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const FlightHotelForm: React.FC<FlightHotelFormProps> = ({
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [flightInfo, setFlightInfo] = useState<FlightInfo>({
    aerolinea: '',
    ruta: '',
    fecha: '',
    hora_salida: '',
    hora_llegada: ''
  });

  const [hotelInfo, setHotelInfo] = useState<HotelInfo>({
    hotel: '',
    noches: 0,
    incluye: [],
    no_incluye: [],
    alimentacion: '',
    acomodacion: '',
    direccion_hotel: '',
    pais_destino: '',
    ciudad_destino: ''
  });

  const [newIncluye, setNewIncluye] = useState('');
  const [newNoIncluye, setNewNoIncluye] = useState('');

  const handleFlightChange = (field: keyof FlightInfo, value: string) => {
    setFlightInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleHotelChange = (field: keyof Omit<HotelInfo, 'incluye' | 'no_incluye'>, value: string | number) => {
    setHotelInfo(prev => ({ ...prev, [field]: value }));
  };



  const addIncluye = () => {
    if (newIncluye.trim()) {
      setHotelInfo(prev => ({
        ...prev,
        incluye: [...prev.incluye, newIncluye.trim()]
      }));
      setNewIncluye('');
    }
  };

  const removeIncluye = (index: number) => {
    setHotelInfo(prev => ({
      ...prev,
      incluye: prev.incluye.filter((_, i) => i !== index)
    }));
  };

  const addNoIncluye = () => {
    if (newNoIncluye.trim()) {
      setHotelInfo(prev => ({
        ...prev,
        no_incluye: [...prev.no_incluye, newNoIncluye.trim()]
      }));
      setNewNoIncluye('');
    }
  };

  const removeNoIncluye = (index: number) => {
    setHotelInfo(prev => ({
      ...prev,
      no_incluye: prev.no_incluye.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!flightInfo.aerolinea || !flightInfo.ruta || !flightInfo.fecha ||
        !hotelInfo.hotel || hotelInfo.noches <= 0) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    await onSubmit(flightInfo, hotelInfo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Flight Information */}
      <Card className="bg-white border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Información de Vuelo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Aerolínea *</Label>
              <Input
                value={flightInfo.aerolinea}
                onChange={(e) => handleFlightChange('aerolinea', e.target.value)}
                placeholder="Nombre de la aerolínea"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Ruta *</Label>
              <Input
                value={flightInfo.ruta}
                onChange={(e) => handleFlightChange('ruta', e.target.value)}
                placeholder="Bogotá - París"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Fecha *</Label>
              <Input
                type="date"
                value={flightInfo.fecha.split('T')[0]}
                onChange={(e) => handleFlightChange('fecha', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Hora de Salida *</Label>
              <Input
                type="time"
                value={flightInfo.hora_salida}
                onChange={(e) => handleFlightChange('hora_salida', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Hora de Llegada *</Label>
              <Input
                type="time"
                value={flightInfo.hora_llegada}
                onChange={(e) => handleFlightChange('hora_llegada', e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotel Information */}
      <Card className="bg-white border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Información de Hotel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hotel *</Label>
              <Input
                value={hotelInfo.hotel}
                onChange={(e) => handleHotelChange('hotel', e.target.value)}
                placeholder="Nombre del hotel"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Número de Noches *</Label>
              <Input
                type="number"
                value={hotelInfo.noches}
                onChange={(e) => handleHotelChange('noches', parseInt(e.target.value))}
                placeholder="0"
                min="1"
                required
              />
            </div>
          </div>

          {/* Incluye Section */}
          <div className="space-y-2">
            <Label>Incluye</Label>
            <div className="flex gap-2">
              <Input
                value={newIncluye}
                onChange={(e) => setNewIncluye(e.target.value)}
                placeholder="Agregar servicio incluido"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIncluye())}
              />
              <Button type="button" onClick={addIncluye} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {hotelInfo.incluye.map((item, index) => (
                <div key={index} className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded">
                  <span className="text-sm">{item}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeIncluye(index)}
                    className="ml-1 h-4 w-4 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* No Incluye Section */}
          <div className="space-y-2">
            <Label>No Incluye</Label>
            <div className="flex gap-2">
              <Input
                value={newNoIncluye}
                onChange={(e) => setNewNoIncluye(e.target.value)}
                placeholder="Agregar servicio no incluido"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNoIncluye())}
              />
              <Button type="button" onClick={addNoIncluye} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {hotelInfo.no_incluye.map((item, index) => (
                <div key={index} className="flex items-center bg-red-100 text-red-800 px-2 py-1 rounded">
                  <span className="text-sm">{item}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNoIncluye(index)}
                    className="ml-1 h-4 w-4 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>



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
          {loading ? 'Guardando...' : 'Completar Información'}
        </Button>
      </div>
    </form>
  );
};

export default FlightHotelForm;
