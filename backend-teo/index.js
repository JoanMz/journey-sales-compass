const express = require("express");
const cors = require("cors");
const axios = require("axios");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
require("dotenv").config();

// Import Supabase client from config
const supabase = require("./supabase-config");

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Citas",
      version: "1.0.0",
      description:
        "API para gestión de citas, usuarios y servicios, NO HAY VALIDACION DE CITAS SOLAPADAS",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Servidor de desarrollo",
      },
    ],
  },
  apis: ["./index.js"], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Habilitar CORS para cualquier origen
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware para parsear JSON
app.use(express.json());

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar el estado del servidor
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running correctly",
  });
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Ruta principal
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is working correctly",
    version: "1.0.0",
  });
});

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
app.get("/usuarios", async (req, res) => {
  try {
    const { data, error } = await supabase.from("usuarios").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

/**
 * @swagger
 * /servicios:
 *   get:
 *     summary: Listar todos los servicios
 *     tags: [Servicios]
 *     responses:
 *       200:
 *         description: Lista de servicios
 */
app.get("/servicios", async (req, res) => {
  try {
    const { data, error } = await supabase.from("servicios").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al listar servicios:", error);
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
});

/**
 * @swagger
 * /database/health:
 *   get:
 *     summary: Verificar si la base de datos está activa
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: Base de datos activa y funcionando correctamente
 *         content:
 *           application/json:
 *             example:
 *               status: "ok"
 *               message: "Base de datos activa y funcionando correctamente"
 *       500:
 *         description: Base de datos no disponible
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Base de datos no disponible"
 *               error: "connection refused"
 */
app.get("/database/health", async (req, res) => {
  try {
    // Realizar una consulta simple para verificar la conexión
    const { data, error } = await supabase
      .from("usuarios")
      .select("id")
      .limit(1);

    if (error) throw error;

    res.status(200).json({
      status: "ok",
      message: "Base de datos activa y funcionando correctamente",
    });
  } catch (error) {
    console.error("Error al verificar estado de la base de datos:", error);
    res.status(500).json({
      status: "error",
      message: "Base de datos no disponible",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /document-types:
 *   get:
 *     summary: Listar todos los tipos de documento
 *     tags: [Tipos de Documento]
 *     responses:
 *       200:
 *         description: Lista de tipos de documento
 */
app.get("/document-types", async (req, res) => {
  try {
    const { data, error } = await supabase.from("document_type").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al listar tipos de documento:", error);
    res.status(500).json({ error: "Error al obtener los tipos de documento" });
  }
});

/**
 * @swagger
 * /eps:
 *   get:
 *     summary: Listar todas las EPS
 *     tags: [EPS]
 *     responses:
 *       200:
 *         description: Lista de EPS
 */
app.get("/eps", async (req, res) => {
  try {
    const { data, error } = await supabase.from("eps").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al listar EPS:", error);
    res.status(500).json({ error: "Error al obtener las EPS" });
  }
});

/**
 * @swagger
 * /headquarters:
 *   get:
 *     summary: Listar todas las sedes
 *     tags: [Sedes]
 *     responses:
 *       200:
 *         description: Lista de sedes
 */
app.get("/headquarters", async (req, res) => {
  try {
    const { data, error } = await supabase.from("headquarters").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al listar sedes:", error);
    res.status(500).json({ error: "Error al obtener las sedes" });
  }
});

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Listar todos los servicios
 *     tags: [Servicios]
 *     responses:
 *       200:
 *         description: Lista de servicios
 */
app.get("/services", async (req, res) => {
  try {
    const { data, error } = await supabase.from("service").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al listar servicios:", error);
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
});

/**
 * @swagger
 * /specialties:
 *   get:
 *     summary: Listar todas las especialidades
 *     tags: [Especialidades]
 *     responses:
 *       200:
 *         description: Lista de especialidades
 */
app.get("/specialties", async (req, res) => {
  try {
    const { data, error } = await supabase.from("specialty").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al listar especialidades:", error);
    res.status(500).json({ error: "Error al obtener las especialidades" });
  }
});

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Listar todos los médicos
 *     tags: [Médicos]
 *     responses:
 *       200:
 *         description: Lista de médicos
 */
app.get("/doctors", async (req, res) => {
  try {
    const { data, error } = await supabase.from("doctor").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al listar médicos:", error);
    res.status(500).json({ error: "Error al obtener los médicos" });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
app.get("/users", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Listar todas las actividades
 *     tags: [Actividades]
 *     responses:
 *       200:
 *         description: Lista de actividades
 */
app.get("/activities", async (req, res) => {
  try {
    const { data, error } = await supabase.from("activity").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al listar actividades:", error);
    res.status(500).json({ error: "Error al obtener las actividades" });
  }
});

/**
 * @swagger
 * /scheduling:
 *   get:
 *     summary: Listar todas las citas programadas
 *     tags: [Programación]
 *     responses:
 *       200:
 *         description: Lista de citas programadas
 */
app.get("/scheduling", async (req, res) => {
  try {
    const { data, error } = await supabase.from("scheduling").select("*");

    console.log("data", data);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al listar programaciones:", error);
    res.status(500).json({ error: "Error al obtener las programaciones" });
  }
});

/**
 * @swagger
 * /authorizations:
 *   get:
 *     summary: Listar todas las autorizaciones vigentes
 *     tags: [Autorizaciones]
 *     responses:
 *       200:
 *         description: Lista de autorizaciones vigentes
 */
app.get("/authorizations", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("current_authorizations")
      .select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al listar autorizaciones:", error);
    res.status(500).json({ error: "Error al obtener las autorizaciones" });
  }
});

/**
 * @swagger
 * /user-appointments:
 *   get:
 *     summary: Listar todas las citas de usuarios con información detallada
 *     tags: [Citas]
 *     responses:
 *       200:
 *         description: Lista de citas con información detallada
 */
app.get("/user-appointments", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_appointments")
      .select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al listar citas de usuarios:", error);
    res.status(500).json({ error: "Error al obtener las citas de usuarios" });
  }
});

/**
 * @swagger
 * /citas/CC/{numero}:
 *   get:
 *     summary: Obtener todas las citas de un usuario por su número de documento (CC)
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de documento del usuario
 *     responses:
 *       200:
 *         description: Lista de citas del usuario
 *       404:
 *         description: No se encontraron citas para este usuario
 *       500:
 *         description: Error del servidor
 */
app.get("/citas/CC/:numero", async (req, res) => {
  try {
    const { numero } = req.params;
    
    const { data, error } = await supabase
      .from("user_appointments")
      .select("*")
      .eq("document_number", numero);

    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ message: "No se encontraron citas para este usuario" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener citas por documento:", error);
    res.status(500).json({ error: "Error al obtener las citas del usuario" });
  }
});

/**
 * @swagger
 * /citasByTypeDoc:
 *   post:
 *     summary: Crear una nueva cita usando número de documento
 *     tags: [Citas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipoServicio
 *               - numeroDocumento
 *               - appointment_date
 *               - appointment_time
 *             properties:
 *               tipoServicio:
 *                 type: string
 *                 example: "1"
 *               numeroDocumento:
 *                 type: string
 *                 example: "555666777"
 *               appointment_date:
 *                 type: string
 *                 format: date
 *                 example: "2023-08-15"
 *               appointment_time:
 *                 type: string
 *                 format: time
 *                 example: "10:30:00"
 *     responses:
 *       201:
 *         description: Cita creada correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
app.post("/citasByTypeDoc", async (req, res) => {
  try {
    const { tipoServicio, numeroDocumento, appointment_date, appointment_time } = req.body;

    // Validar campos requeridos
    if (!tipoServicio || !numeroDocumento || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: "El ID del servicio, número de documento, fecha y hora de la cita son requeridos" });
    }
    
    console.log("tipoServicio", tipoServicio);
    console.log("numeroDocumento", numeroDocumento);

    // Buscar el usuario por número de documento (asumiendo tipo CC)
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("document_type_id", 1)
      .eq("document_number", numeroDocumento)
      .single();

    console.log("userData", userData);

    if (userError && userError.code !== 'PGRST116') {
      console.error("Error al buscar usuario:", userError);
      return res.status(500).json({ error: "Error al buscar usuario" });
    }

    if (!userData) {
      return res.status(404).json({ error: "Usuario no encontrado con ese documento" });
    }

    // Si no se proporcionan fecha y hora, usar la fecha actual
    const fechaActual = new Date().toISOString();

    // Insertar en la tabla scheduling
    const { data, error } = await supabase
      .from("scheduling")
      .insert([
        {
          parameterization: 'schedule',
          service_type: tipoServicio,
          user_id: userData.id,
          appointment_date: appointment_date,
          appointment_time: appointment_time,
          responsible_physician_id: 1, // Default doctor ID
          status: 'asignado'
        }
      ])
      .select();

    if (error) {
      console.error("Error al crear la cita:", error);
      return res.status(500).json({ error: "Error al crear la cita" });
    }

    res.status(201).json({ 
      message: "Cita creada correctamente", 
      data: data[0] 
    });
  } catch (error) {
    console.error("Error al crear la cita:", error);
    res.status(500).json({ error: "Error al crear la cita" });
  }
});

/**
 * @swagger
 * /citas/{id}:
 *   delete:
 *     summary: Eliminar una cita por su ID
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita a eliminar
 *     responses:
 *       200:
 *         description: Cita eliminada correctamente
 *       404:
 *         description: Cita no encontrada
 *       500:
 *         description: Error del servidor
 */
app.delete("/citas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la cita existe
    const { data: existingAppointment, error: checkError } = await supabase
      .from("scheduling")
      .select("id")
      .eq("id", id)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error al verificar la cita:", checkError);
      return res.status(500).json({ error: "Error al verificar la cita" });
    }
    
    if (!existingAppointment) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }
    
    // Eliminar la cita
    const { error: deleteError } = await supabase
      .from("scheduling")
      .delete()
      .eq("id", id);
      
    if (deleteError) {
      console.error("Error al eliminar la cita:", deleteError);
      return res.status(500).json({ error: "Error al eliminar la cita" });
    }
    
    res.status(200).json({ 
      message: "Cita eliminada correctamente" 
    });
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
    res.status(500).json({ error: "Error al eliminar la cita" });
  }
});

/**
 * @swagger
 * /citas/servicio/{serviceId}/fecha/{fecha}:
 *   get:
 *     summary: Obtener todas las citas de un servicio en una fecha específica
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio
 *       - in: path
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha en formato YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Lista de citas para el servicio en la fecha especificada
 *       404:
 *         description: No se encontraron citas para este servicio en esta fecha
 *       500:
 *         description: Error del servidor
 */
app.get("/citas/servicio/:serviceId/fecha/:fecha", async (req, res) => {
  try {
    const { serviceId, fecha } = req.params;
    
    
    // Buscar citas para este servicio en esta fecha
    const { data, error } = await supabase
      .from("scheduling")
      .select(`
        *
      `)
      .eq("service_type", serviceId)
      .eq("appointment_date", fecha);

    if (error) {
      console.error("Error al obtener citas:", error);
      return res.status(500).json({ error: "Error al obtener las citas" });
    }
    
    // Si no hay citas, devolver un array vacío con un mensaje
    if (data.length === 0) {
      return res.status(200).json({ 
        message: "No hay citas programadas para este servicio en esta fecha",
        data: [] 
      });
    }
    
    // Ordenar por hora de cita
    data.sort((a, b) => {
      return a.appointment_time.localeCompare(b.appointment_time);
    });

    res.status(200).json({
      message: "Citas encontradas",
      fecha: fecha,
      servicio: serviceId,
      cantidad: data.length,
      data: data
    });
  } catch (error) {
    console.error("Error al obtener citas por servicio y fecha:", error);
    res.status(500).json({ error: "Error al obtener las citas" });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
