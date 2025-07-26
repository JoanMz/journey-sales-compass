-- Esquema de base de datos para Supabase

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre_completo TEXT NOT NULL,
  tipo_documento TEXT NOT NULL CHECK (tipo_documento IN ('CC', 'Pasaporte', 'TI')),
  numero_documento TEXT NOT NULL,
  telefono TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear un índice único para evitar duplicados de documentos
CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_documento ON usuarios (tipo_documento, numero_documento);

-- Tabla de servicios
CREATE TABLE IF NOT EXISTS servicios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de citas
CREATE TABLE IF NOT EXISTS citas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dia TIMESTAMPTZ NOT NULL,
  tipo_servicio UUID NOT NULL REFERENCES servicios(id),
  duracion INTEGER NOT NULL, -- duración en minutos
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear un índice para búsquedas rápidas por fecha
CREATE INDEX IF NOT EXISTS idx_citas_dia ON citas (dia);

-- Crear un índice para búsquedas por usuario
CREATE INDEX IF NOT EXISTS idx_citas_usuario ON citas (usuario_id);

-- Función para actualizar automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar el campo updated_at automáticamente
CREATE TRIGGER update_usuarios_timestamp
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_servicios_timestamp
BEFORE UPDATE ON servicios
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_citas_timestamp
BEFORE UPDATE ON citas
FOR EACH ROW
EXECUTE FUNCTION update_timestamp(); 



-- crear datos de prueba al menos 5 de cada tabla

-- Insertar usuarios de prueba
INSERT INTO usuarios (nombre_completo, tipo_documento, numero_documento, telefono) VALUES
('Juan Carlos Pérez', 'CC', '1020304050', '3001234567'),
('María Fernanda Gómez', 'CC', '1098765432', '3109876543'),
('Carlos Andrés Rodríguez', 'Pasaporte', 'AB123456', '3201234567'),
('Ana María Martínez', 'CC', '1112233445', '3151234567'),
('Luis Felipe Vargas', 'TI', '99112233', '3054321098');

-- Insertar servicios de prueba
INSERT INTO servicios (nombre, estado) VALUES
('Corte de cabello', 'activo'),
('Manicure', 'activo'),
('Pedicure', 'activo'),
('Masaje relajante', 'activo'),
('Tratamiento facial', 'activo'),
('Depilación', 'activo'),
('Tinte de cabello', 'inactivo');

-- Insertar citas de prueba (usando los IDs generados dinámicamente)
DO $$
DECLARE
    usuario1_id UUID;
    usuario2_id UUID;
    usuario3_id UUID;
    servicio1_id UUID;
    servicio2_id UUID;
    servicio3_id UUID;
    servicio4_id UUID;
BEGIN
    -- Obtener IDs de usuarios
    SELECT id INTO usuario1_id FROM usuarios WHERE numero_documento = '1020304050' LIMIT 1;
    SELECT id INTO usuario2_id FROM usuarios WHERE numero_documento = '1098765432' LIMIT 1;
    SELECT id INTO usuario3_id FROM usuarios WHERE numero_documento = 'AB123456' LIMIT 1;
    
    -- Obtener IDs de servicios
    SELECT id INTO servicio1_id FROM servicios WHERE nombre = 'Corte de cabello' LIMIT 1;
    SELECT id INTO servicio2_id FROM servicios WHERE nombre = 'Manicure' LIMIT 1;
    SELECT id INTO servicio3_id FROM servicios WHERE nombre = 'Pedicure' LIMIT 1;
    SELECT id INTO servicio4_id FROM servicios WHERE nombre = 'Masaje relajante' LIMIT 1;
    
    -- Insertar citas
    INSERT INTO citas (dia, tipo_servicio, duracion, usuario_id, estado) VALUES
    (NOW() + interval '1 day' + interval '10 hours', servicio1_id, 30, usuario1_id, 'pendiente'),
    (NOW() + interval '1 day' + interval '14 hours', servicio2_id, 45, usuario2_id, 'confirmada'),
    (NOW() + interval '2 days' + interval '11 hours', servicio3_id, 45, usuario3_id, 'pendiente'),
    (NOW() + interval '3 days' + interval '16 hours', servicio4_id, 60, usuario1_id, 'pendiente'),
    (NOW() + interval '5 days' + interval '9 hours', servicio1_id, 30, usuario2_id, 'confirmada'),
    (NOW() + interval '6 days' + interval '15 hours', servicio2_id, 45, usuario3_id, 'pendiente');
END
$$; 


