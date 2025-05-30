import React, { useState, useRef } from 'react';
import { Upload, X, Eye } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  label: string;
  onImageSelect: (file: File | null) => void;
  currentImage?:  string | null;
  accept?: string;
  required?: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  onImageSelect,
  currentImage,
  accept = "image/*",
  required = false,
  className
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
      console.log("File selected:", e.target.files[0]);
    }
  };

const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      onImageSelect(file);
      reader.onload = (e) => {
        setPreview(e.target?.result as string); // Para mostrar la vista previa localmente
      };
      reader.readAsDataURL(file);
      // ¡Envía el objeto File!
    } else {
        alert('Por favor selecciona un archivo de imagen válido.');
        onImageSelect(null); // No seleccionó una imagen
        setPreview(null);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageSelect(null); // Pasa null para indicar que no hay archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive 
            ? "border-blue-500 bg-blue-50" 
            : preview 
            ? "border-green-500 bg-green-50" // Color verde si hay preview
            : "border-gray-300 hover:border-gray-400"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          name="image"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        
        {preview ? (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="max-h-32 mx-auto rounded object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Cambiar imagen
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Arrastra una imagen aquí o haz clic para seleccionar
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF hasta 10MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;