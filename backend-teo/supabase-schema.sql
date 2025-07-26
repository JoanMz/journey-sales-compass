-- Supabase Schema for Medical Appointment System

-- Document Type Table
CREATE TABLE document_type (
    id SERIAL PRIMARY KEY,
    document_type INTEGER NOT NULL,
    value VARCHAR(10) NOT NULL
);

-- EPS (Health Insurance) Table
CREATE TABLE eps (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    code VARCHAR(50) NOT NULL
);

-- Headquarters Table
CREATE TABLE headquarters (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL
);

-- Service Table
CREATE TABLE service (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('cita', 'procedimiento'))
);

-- Specialty Table
CREATE TABLE specialty (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    id_service INTEGER REFERENCES service(id)
);

-- Doctor Table
CREATE TABLE doctor (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    specialty1 INTEGER REFERENCES specialty(id),
    specialty2 INTEGER REFERENCES specialty(id),
    specialty3 INTEGER REFERENCES specialty(id)
);

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    document_type_id INTEGER REFERENCES document_type(id),
    document_number VARCHAR(50) NOT NULL,
    telephone_number VARCHAR(20),
    eps_id INTEGER REFERENCES eps(id),
    headquarters_id INTEGER REFERENCES headquarters(id),
    birthday DATE,
    issue_date DATE
);

-- Activity Table
CREATE TABLE activity (
    id SERIAL PRIMARY KEY,
    ips_service_code VARCHAR(50) NOT NULL,
    duration INTEGER NOT NULL, -- Duration in minutes
    related_contract_description_id INTEGER,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL
);

-- Scheduling Table
CREATE TABLE scheduling (
    id SERIAL PRIMARY KEY,
    parameterization VARCHAR(50) CHECK (parameterization IN ('schedule', 'view', 'reschedule', 'delete')),
    service_type INTEGER REFERENCES service(id),
    user_id INTEGER REFERENCES users(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    responsible_physician_id INTEGER REFERENCES doctor(id),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('asignado', 'confirmado'))
);

-- Current Authorizations Table
CREATE TABLE current_authorizations (
    id SERIAL PRIMARY KEY,
    authorization_number VARCHAR(100) NOT NULL,
    user_id INTEGER REFERENCES users(id)
);

-- Add some initial data for document types
INSERT INTO document_type (document_type, value) VALUES 
(1, 'CC'), -- Cédula de Ciudadanía
(2, 'TI'); -- Tarjeta de Identidad

-- Add RLS policies for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduling ENABLE ROW LEVEL SECURITY;
ALTER TABLE current_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor ENABLE ROW LEVEL SECURITY;

-- Create views for easier querying
CREATE VIEW user_appointments AS
SELECT 
    s.id, 
    u.full_name, 
    u.document_number, 
    e.name as eps_name, 
    s.appointment_date, 
    s.appointment_time, 
    d.name as doctor_name, 
    srv.name as service_name,
    s.status
FROM scheduling s
JOIN users u ON s.user_id = u.id
JOIN doctor d ON s.responsible_physician_id = d.id
JOIN eps e ON u.eps_id = e.id
JOIN service srv ON s.service_type = srv.id;

-- Create indexes for performance
CREATE INDEX idx_scheduling_user_id ON scheduling(user_id);
CREATE INDEX idx_scheduling_doctor_id ON scheduling(responsible_physician_id);
CREATE INDEX idx_scheduling_date ON scheduling(appointment_date);
CREATE INDEX idx_users_document ON users(document_number);


-- Create data example in spansh

INSERT INTO document_type (document_type, value) VALUES 
(1, 'CC'), -- Cédula de Ciudadanía
(2, 'TI'); -- Tarjeta de Identidad      


INSERT INTO eps (name, entity_type, code) VALUES 
('Sura', 'EPS', '1234567890'),
('Salud Total', 'EPS', '0987654321');


INSERT INTO headquarters (code, entity_type, name, address) VALUES 
('001', 'EPS', '', 'Norte calle 1N # 21-13'),
('002', 'EPS', '', '18 # 66-51');


INSERT INTO service (name, code, type) VALUES 
('Medicina General', '001', 'cita'),
('Odontologia', '002', 'cita'),
('Electrocardiograma', '003', 'procedimiento'),
('Ecocardiografía', '004', 'procedimiento');


INSERT INTO specialty (code, name, id_service) VALUES 
('111', 'Medico General', '001'),
('222', 'Odontologo', '002'),
('333', 'Cardiologo', '003'),
('444', 'Cardiologo', '004');


INSERT INTO activity (ips_service_code, duration, related_contract_description_id, code, name) VALUES 
('001', 20, 1, '', 'Consulta Medica General'),
('002', 15, 1, '', 'Consulta Odontologica'),
('003', 10, 1, '', 'Electrocardiograma'),
('004', 30, 1, '', 'Ecocardiografía'),
('005', 10, 1, '', 'Consulta de control o de seguimiento por optometria');

INSERT INTO doctor (name, code, specialty1, specialty2, specialty3) VALUES 
('Juan Perez', '001', 1, 2, 3),
('Maria Lopez', '002', 1, 2, 3),
('Pedro Ramirez', '003', 1, 2, 3),
('Ana Torres', '004', 1, 2, 3),
('Luis Gonzalez', '005', 1, 2, 3),
('Laura Martinez', '006', 1, 2, 3),
('Carlos Rodriguez', '007', 1, 2, 3),
('Sofia Hernandez', '008', 1, 2, 3);


INSERT INTO users (full_name, document_type_id, document_number, telephone_number, eps_id, headquarters_id, birthday, issue_date) VALUES    
('Juan Perez', 1, '1234567890', '3178901234', 1, 1, '1990-01-01', '2021-01-01'),
('Maria Lopez', 1, '1234567890', '3178901234', 1, 1, '1990-01-01', '2021-01-01'),
('Pedro Ramirez', 1, '1234567890', '3178901234', 1, 1, '1990-01-01', '2021-01-01');

INSERT INTO current_authorizations (authorization_number, user_id) VALUES 
('1234567890', 1),
('0987654321', 1);

INSERT INTO scheduling (id, date, time, status, doctor_id, activity_id, user_id) VALUES
(1, '2024-03-20', '09:00:00', 'scheduled', 1, 1, 1),
(2, '2024-03-21', '10:30:00', 'scheduled', 2, 2, 2),
(3, '2024-03-22', '14:00:00', 'scheduled', 3, 3, 3),
(4, '2024-03-23', '15:30:00', 'scheduled', 4, 4, 1),
(5, '2024-03-24', '11:00:00', 'scheduled', 5, 5, 2);

INSERT INTO user_appointments (id, scheduling_id, current_authorization_id) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 2),
(4, 4, 1),
(5, 5, 2);


