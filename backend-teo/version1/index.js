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
        url: `https://swaggerbackend-vvfy.onrender.com`,
        description: "Servidor de producción new",
      },
      {
        url: `http://localhost:${PORT}`,
        description: "Servidor de desarrollo",
      }
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
 * components:
 *   schemas:
 *     Cita:
 *       type: object
 *       required:
 *         - dia
 *         - tipoServicio
 *         - duracion
 *         - usuarioId
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la cita
 *         dia:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la cita
 *         tipoServicio:
 *           type: string
 *           description: Tipo de servicio solicitado
 *         duracion:
 *           type: integer
 *           description: Duración en minutos
 *         usuarioId:
 *           type: string
 *           description: ID del usuario asociado a la cita
 *         estado:
 *           type: string
 *           enum: [pendiente, confirmada, cancelada, completada]
 *           default: pendiente
 *           description: Estado actual de la cita
 *     Usuario:
 *       type: object
 *       required:
 *         - nombreCompleto
 *         - tipoDocumento
 *         - numeroDocumento
 *         - telefono
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del usuario
 *         nombreCompleto:
 *           type: string
 *           description: Nombre completo del usuario
 *         tipoDocumento:
 *           type: string
 *           enum: [CC, Pasaporte, TI]
 *           description: Tipo de documento de identidad
 *         numeroDocumento:
 *           type: string
 *           description: Número de documento
 *         telefono:
 *           type: string
 *           description: Número de teléfono
 *     Servicio:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del servicio
 *         nombre:
 *           type: string
 *           description: Nombre del servicio
 *         estado:
 *           type: string
 *           enum: [activo, inactivo]
 *           default: activo
 *           description: Estado del servicio
 */

/**
 * @swagger
 * /citas:
 *   post:
 *     summary: Crear una nueva cita
 *     tags: [Citas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cita'
 *           example:
 *             dia: "2023-08-15T10:30:00Z"
 *             tipoServicio: "145310bb-f764-4d21-be4a-95a619d3a3d2"
 *             duracion: 45
 *             usuarioId: "fb4219e3-d141-4475-a3c3-6a9e94e2b133"
 *             estado: "pendiente"
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id: "a9b9c9d9-e9f9-49a9-b9c9-d9e9f9a9b9c9"
 *               dia: "2023-08-15T10:30:00Z"
 *               tipo_servicio: "145310bb-f764-4d21-be4a-95a619d3a3d2"
 *               duracion: 45
 *               usuario_id: "fb4219e3-d141-4475-a3c3-6a9e94e2b133"
 *               estado: "pendiente"
 *               created_at: "2023-08-01T15:30:45Z"
 *               updated_at: "2023-08-01T15:30:45Z"
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: "Faltan datos requeridos"
 */
app.post("/citas", async (req, res) => {
  try {
    const { dia, tipoServicio, duracion, usuarioId } = req.body;

    // Validación básica
    if (!dia || !tipoServicio || !duracion || !usuarioId) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    // Insertar en Supabase
    const { data, error } = await supabase
      .from("citas")
      .insert([
        {
          dia,
          tipo_servicio: tipoServicio,
          duracion,
          usuario_id: usuarioId,
          estado: "pendiente",
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Error al crear cita:", error);
    res.status(500).json({ error: "Error al crear la cita" });
  }
});


/**
 * @swagger
 * /citasByTypeDoc:
 *   post:
 *     summary: Crear una nueva cita usando tipo y número de documento
 *     tags: [Citas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dia
 *               - tipoServicio
 *               - duracion
 *               - tipoDocumento
 *               - numeroDocumento
 *             properties:
 *               dia:
 *                 type: string
 *                 format: date-time
 *               tipoServicio:
 *                 type: string
 *               duracion:
 *                 type: integer
 *               tipoDocumento:
 *                 type: string
 *                 enum: [CC, Pasaporte, TI]
 *               numeroDocumento:
 *                 type: string
 *           example:
 *             dia: "2023-08-15T10:30:00Z"
 *             tipoServicio: "145310bb-f764-4d21-be4a-95a619d3a3d2"
 *             duracion: 45
 *             tipoDocumento: "CC"
 *             numeroDocumento: "1193246872"
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id: "a9b9c9d9-e9f9-49a9-b9c9-d9e9f9a9b9c9"
 *               dia: "2023-08-15T10:30:00Z"
 *               tipo_servicio: "145310bb-f764-4d21-be4a-95a619d3a3d2"
 *               duracion: 45
 *               usuario_id: "fb4219e3-d141-4475-a3c3-6a9e94e2b133"
 *               estado: "pendiente"
 *               created_at: "2023-08-01T15:30:45Z"
 *               updated_at: "2023-08-01T15:30:45Z"
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: "Faltan datos requeridos"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: "Usuario no encontrado con ese documento"
 */
app.post("/citasByTypeDoc", async (req, res) => {
  try {
    const { dia, tipoServicio, duracion, tipoDocumento, numeroDocumento } = req.body;

    // Validación básica
    if (!dia || !tipoServicio || !duracion || !tipoDocumento || !numeroDocumento) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    // Buscar el usuario por tipo y número de documento
    const { data: usuarioData, error: usuarioError } = await supabase
      .from("usuarios")
      .select("id")
      .eq("tipo_documento", tipoDocumento)
      .eq("numero_documento", numeroDocumento)
      .single();

    if (usuarioError) {
      console.error("Error al buscar usuario:", usuarioError);
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (!usuarioData) {
      return res.status(404).json({ error: "Usuario no encontrado con ese documento" });
    }

    // Insertar en Supabase
    const { data, error } = await supabase
      .from("citas")
      .insert([
        {
          dia,
          tipo_servicio: tipoServicio,
          duracion,
          usuario_id: usuarioData.id,
          estado: "pendiente",
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Error al crear cita:", error);
    res.status(500).json({ error: "Error al crear la cita" });
  }
});

/**
 * @swagger
 * /citas/{id}:
 *   put:
 *     summary: Actualizar una cita existente
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la cita
 *         example: "a9b9c9d9-e9f9-49a9-b9c9-d9e9f9a9b9c9"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cita'
 *           example:
 *             dia: "2023-08-15T14:00:00Z"
 *             tipoServicio: "145310bb-f764-4d21-be4a-95a619d3a3d2"
 *             duracion: 60
 *             usuarioId: "fb4219e3-d141-4475-a3c3-6a9e94e2b133"
 *             estado: "confirmada"
 *     responses:
 *       200:
 *         description: Cita actualizada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id: "a9b9c9d9-e9f9-49a9-b9c9-d9e9f9a9b9c9"
 *               dia: "2023-08-15T14:00:00Z"
 *               tipo_servicio: "145310bb-f764-4d21-be4a-95a619d3a3d2"
 *               duracion: 60
 *               usuario_id: "fb4219e3-d141-4475-a3c3-6a9e94e2b133"
 *               estado: "confirmada"
 *               created_at: "2023-08-01T15:30:45Z"
 *               updated_at: "2023-08-01T16:45:22Z"
 *       404:
 *         description: Cita no encontrada
 *         content:
 *           application/json:
 *             example:
 *               error: "Cita no encontrada"
 */
app.put("/citas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { dia, tipoServicio, duracion, usuarioId, estado } = req.body;

    // Actualizar en Supabase
    const { data, error } = await supabase
      .from("citas")
      .update({
        dia,
        tipo_servicio: tipoServicio,
        duracion,
        usuario_id: usuarioId,
        estado,
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    res.status(200).json(data[0]);
  } catch (error) {
    console.error("Error al actualizar cita:", error);
    res.status(500).json({ error: "Error al actualizar la cita" });
  }
});

/**
 * @swagger
 * /citas/{id}:
 *   patch:
 *     summary: Actualizar parcialmente una cita
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dia:
 *                 type: string
 *                 format: date-time
 *               tipoServicio:
 *                 type: string
 *               duracion:
 *                 type: integer
 *               usuarioId:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cita actualizada parcialmente
 *       404:
 *         description: Cita no encontrada
 */
app.patch("/citas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Actualizar en Supabase
    const { data, error } = await supabase
      .from("citas")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    res.status(200).json(data[0]);
  } catch (error) {
    console.error("Error al actualizar parcialmente la cita:", error);
    res.status(500).json({ error: "Error al actualizar la cita" });
  }
});

/**
 * @swagger
 * /citas/{id}:
 *   delete:
 *     summary: Eliminar una cita
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la cita
 *     responses:
 *       200:
 *         description: Cita eliminada exitosamente
 *       404:
 *         description: Cita no encontrada
 */
app.delete("/citas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Eliminar de Supabase
    const { error } = await supabase.from("citas").delete().eq("id", id);

    if (error) throw error;

    res.status(200).json({ message: "Cita eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    res.status(500).json({ error: "Error al eliminar la cita" });
  }
});

/**
 * @swagger
 * /citas/hora/{fecha}:
 *   get:
 *     summary: Obtener todas las citas en una hora específica
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: fecha
 *         schema:
 *           type: string
 *         required: true
 *         description: Fecha y hora (ISO format)
 *     responses:
 *       200:
 *         description: Lista de citas en la hora especificada
 */
app.get("/citas/hora/:fecha", async (req, res) => {
  try {
    const fecha = new Date(req.params.fecha);
    const horaInicio = new Date(fecha);
    const horaFin = new Date(fecha);
    horaFin.setHours(horaFin.getHours() + 1);

    const { data, error } = await supabase
      .from("citas")
      .select("*")
      .gte("dia", horaInicio.toISOString())
      .lt("dia", horaFin.toISOString());

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener citas por hora:", error);
    res.status(500).json({ error: "Error al obtener las citas" });
  }
});

/**
 * @swagger
 * /citas/dia/{fecha}:
 *   get:
 *     summary: Obtener todas las citas en un día específico
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: fecha
 *         schema:
 *           type: string
 *         required: true
 *         description: Fecha (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de citas del día
 */
app.get("/citas/dia/:fecha", async (req, res) => {
  try {
    const fecha = req.params.fecha;
    const diaInicio = new Date(fecha);
    const diaFin = new Date(fecha);
    diaFin.setDate(diaFin.getDate() + 1);

    const { data, error } = await supabase
      .from("citas")
      .select("*")
      .gte("dia", diaInicio.toISOString())
      .lt("dia", diaFin.toISOString());

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener citas por día:", error);
    res.status(500).json({ error: "Error al obtener las citas" });
  }
});

/**
 * @swagger
 * /citas/semana/{fecha}:
 *   get:
 *     summary: Obtener todas las citas en una semana específica
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: fecha
 *         schema:
 *           type: string
 *         required: true
 *         description: Fecha dentro de la semana (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de citas de la semana
 */
app.get("/citas/semana/:fecha", async (req, res) => {
  try {
    const fecha = new Date(req.params.fecha);
    const diaSemana = fecha.getDay();
    const inicioSemana = new Date(fecha);
    inicioSemana.setDate(fecha.getDate() - diaSemana);
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 7);

    const { data, error } = await supabase
      .from("citas")
      .select("*")
      .gte("dia", inicioSemana.toISOString())
      .lt("dia", finSemana.toISOString());

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener citas por semana:", error);
    res.status(500).json({ error: "Error al obtener las citas" });
  }
});

/**
 * @swagger
 * /citas/mes/{fecha}:
 *   get:
 *     summary: Obtener todas las citas en un mes específico
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: fecha
 *         schema:
 *           type: string
 *         required: true
 *         description: Fecha dentro del mes (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de citas del mes
 */
app.get("/citas/mes/:fecha", async (req, res) => {
  try {
    const fecha = new Date(req.params.fecha);
    const inicioMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    const finMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 1);

    const { data, error } = await supabase
      .from("citas")
      .select("*")
      .gte("dia", inicioMes.toISOString())
      .lt("dia", finMes.toISOString());

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener citas por mes:", error);
    res.status(500).json({ error: "Error al obtener las citas" });
  }
});

/**
 * @swagger
 * /horarios-disponibles/dia/{fecha}:
 *   get:
 *     summary: Obtener horarios disponibles para un día específico
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: fecha
 *         schema:
 *           type: string
 *         required: true
 *         description: Fecha (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de horarios disponibles
 */
app.get("/horarios-disponibles/dia/:fecha", async (req, res) => {
  try {
    const fecha = req.params.fecha;
    const diaInicio = new Date(fecha);
    const diaFin = new Date(fecha);
    diaFin.setDate(diaFin.getDate() + 1);

    // Obtener citas existentes para ese día
    const { data: citas, error } = await supabase
      .from("citas")
      .select("*")
      .gte("dia", diaInicio.toISOString())
      .lt("dia", diaFin.toISOString());

    if (error) throw error;

    // Generar horarios disponibles (ejemplo de 9:00 a 17:00, cada 30 minutos)
    const horariosOcupados = citas.map((cita) => {
      const inicio = new Date(cita.dia);
      return {
        inicio,
        fin: new Date(inicio.getTime() + cita.duracion * 60000),
      };
    });

    const horariosDisponibles = [];
    const horaInicio = 9; // 9:00 AM
    const horaFin = 17; // 5:00 PM
    const intervalo = 30; // 30 minutos

    const fechaBase = new Date(fecha);

    for (let hora = horaInicio; hora < horaFin; hora++) {
      for (let minuto = 0; minuto < 60; minuto += intervalo) {
        const horarioPropuesto = new Date(fechaBase);
        horarioPropuesto.setHours(hora, minuto, 0, 0);

        // Verificar si el horario está ocupado
        const estaOcupado = horariosOcupados.some((horario) => {
          return (
            horarioPropuesto >= horario.inicio && horarioPropuesto < horario.fin
          );
        });

        if (!estaOcupado) {
          horariosDisponibles.push(horarioPropuesto);
        }
      }
    }

    res.status(200).json(horariosDisponibles);
  } catch (error) {
    console.error("Error al obtener horarios disponibles por día:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los horarios disponibles" });
  }
});

/**
 * @swagger
 * /horarios-disponibles/semana/{fecha}:
 *   get:
 *     summary: Obtener horarios disponibles para una semana específica
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: fecha
 *         schema:
 *           type: string
 *         required: true
 *         description: Fecha dentro de la semana (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de horarios disponibles agrupados por día
 */
app.get("/horarios-disponibles/semana/:fecha", async (req, res) => {
  try {
    const fecha = new Date(req.params.fecha);
    const diaSemana = fecha.getDay();
    const inicioSemana = new Date(fecha);
    inicioSemana.setDate(fecha.getDate() - diaSemana);

    // Generar respuesta para cada día de la semana
    const horariosSemana = {};

    for (let i = 0; i < 7; i++) {
      const fechaDia = new Date(inicioSemana);
      fechaDia.setDate(inicioSemana.getDate() + i);
      const fechaStr = fechaDia.toISOString().split("T")[0];

      // Llamada recursiva a la función de horarios por día
      // En un caso real, esto debería optimizarse para no hacer tantas llamadas a la BD
      const diaInicio = new Date(fechaDia);
      const diaFin = new Date(fechaDia);
      diaFin.setDate(diaFin.getDate() + 1);

      // Obtener citas existentes para ese día
      const { data: citas, error } = await supabase
        .from("citas")
        .select("*")
        .gte("dia", diaInicio.toISOString())
        .lt("dia", diaFin.toISOString());

      if (error) throw error;

      // Generar horarios disponibles (ejemplo de 9:00 a 17:00, cada 30 minutos)
      const horariosOcupados = citas.map((cita) => {
        const inicio = new Date(cita.dia);
        return {
          inicio,
          fin: new Date(inicio.getTime() + cita.duracion * 60000),
        };
      });

      const horariosDisponibles = [];
      const horaInicio = 9; // 9:00 AM
      const horaFin = 17; // 5:00 PM
      const intervalo = 30; // 30 minutos

      for (let hora = horaInicio; hora < horaFin; hora++) {
        for (let minuto = 0; minuto < 60; minuto += intervalo) {
          const horarioPropuesto = new Date(fechaDia);
          horarioPropuesto.setHours(hora, minuto, 0, 0);

          // Verificar si el horario está ocupado
          const estaOcupado = horariosOcupados.some((horario) => {
            return (
              horarioPropuesto >= horario.inicio &&
              horarioPropuesto < horario.fin
            );
          });

          if (!estaOcupado) {
            horariosDisponibles.push(horarioPropuesto);
          }
        }
      }

      horariosSemana[fechaStr] = horariosDisponibles;
    }

    res.status(200).json(horariosSemana);
  } catch (error) {
    console.error("Error al obtener horarios disponibles por semana:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los horarios disponibles" });
  }
});

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *           example:
 *             nombreCompleto: "Pedro José Ramírez"
 *             tipoDocumento: "CC"
 *             numeroDocumento: "80123456"
 *             telefono: "3158765432"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id: "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0"
 *               nombre_completo: "Pedro José Ramírez"
 *               tipo_documento: "CC"
 *               numero_documento: "80123456"
 *               telefono: "3158765432"
 *               created_at: "2023-08-10T09:15:30Z"
 *               updated_at: "2023-08-10T09:15:30Z"
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: "Faltan datos requeridos"
 */
app.post("/usuarios", async (req, res) => {
  try {
    const { nombreCompleto, tipoDocumento, numeroDocumento, telefono } =
      req.body;

    // Validación básica
    if (!nombreCompleto || !tipoDocumento || !numeroDocumento || !telefono) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    // Insertar en Supabase
    const { data, error } = await supabase
      .from("usuarios")
      .insert([
        {
          nombre_completo: nombreCompleto,
          tipo_documento: tipoDocumento,
          numero_documento: numeroDocumento,
          telefono,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error al crear el usuario" });
  }
});

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
app.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
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
 *   post:
 *     summary: Crear un nuevo servicio
 *     tags: [Servicios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Servicio'
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
app.post("/servicios", async (req, res) => {
  try {
    const { nombre, estado = "activo" } = req.body;

    // Validación básica
    if (!nombre) {
      return res.status(400).json({ error: "Falta el nombre del servicio" });
    }

    // Insertar en Supabase
    const { data, error } = await supabase
      .from("servicios")
      .insert([{ nombre, estado }])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Error al crear servicio:", error);
    res.status(500).json({ error: "Error al crear el servicio" });
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
 * /citas/completas:
 *   get:
 *     summary: Obtener todas las citas con información completa
 *     tags: [Citas]
 *     responses:
 *       200:
 *         description: Lista de todas las citas con detalles del usuario y servicio
 *         content:
 *           application/json:
 *             example:
 *               - id: "a9b9c9d9-e9f9-49a9-b9c9-d9e9f9a9b9c9"
 *                 dia: "2023-08-15T14:00:00Z"
 *                 tipo_servicio: "145310bb-f764-4d21-be4a-95a619d3a3d2"
 *                 duracion: 60
 *                 usuario_id: "fb4219e3-d141-4475-a3c3-6a9e94e2b133"
 *                 estado: "confirmada"
 *                 created_at: "2023-08-01T15:30:45Z"
 *                 updated_at: "2023-08-01T16:45:22Z"
 *                 usuario:
 *                   id: "fb4219e3-d141-4475-a3c3-6a9e94e2b133"
 *                   nombre_completo: "Juan Carlos Pérez"
 *                   tipo_documento: "CC"
 *                   numero_documento: "1020304050"
 *                   telefono: "3001234567"
 *                 servicio:
 *                   id: "145310bb-f764-4d21-be4a-95a619d3a3d2"
 *                   nombre: "Corte de cabello"
 *                   estado: "activo"
 *               - id: "b8c7d6e5-f4g3-h2i1-j0k9-l8m7n6o5p4q3"
 *                 dia: "2023-08-16T10:30:00Z"
 *                 tipo_servicio: "abcdef12-3456-7890-abcd-ef1234567890"
 *                 duracion: 45
 *                 usuario_id: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
 *                 estado: "pendiente"
 *                 created_at: "2023-08-02T09:15:30Z"
 *                 updated_at: "2023-08-02T09:15:30Z"
 *                 usuario:
 *                   id: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
 *                   nombre_completo: "María Fernanda Gómez"
 *                   tipo_documento: "CC"
 *                   numero_documento: "1098765432"
 *                   telefono: "3109876543"
 *                 servicio:
 *                   id: "abcdef12-3456-7890-abcd-ef1234567890"
 *                   nombre: "Manicure"
 *                   estado: "activo"
 */
app.get("/citas/completas", async (req, res) => {
  try {
    // Obtener todas las citas con join a usuarios y servicios
    const { data, error } = await supabase.from("citas").select(`
        *,
        usuario:usuario_id(id, nombre_completo, tipo_documento, numero_documento, telefono),
        servicio:tipo_servicio(id, nombre, estado)
      `);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener citas completas:", error);
    res.status(500).json({ error: "Error al obtener las citas" });
  }
});

/**
 * @swagger
 * /citas/usuario/{id}:
 *   get:
 *     summary: Obtener todas las citas de un usuario por su ID
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de citas del usuario
 *       404:
 *         description: Usuario no encontrado o sin citas
 */
app.get("/citas/usuario/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el usuario existe
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuarios")
      .select("id")
      .eq("id", id)
      .single();

    if (usuarioError || !usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Obtener todas las citas del usuario con información del servicio
    const { data, error } = await supabase
      .from("citas")
      .select(`
        *,
        servicio:tipo_servicio(id, nombre, estado)
      `)
      .eq("usuario_id", id)
      .order("dia", { ascending: true });

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ message: "El usuario no tiene citas registradas" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener citas por usuario:", error);
    res.status(500).json({ error: "Error al obtener las citas del usuario" });
  }
});

/**
 * @swagger
 * /citas/documento/{tipo}/{numero}:
 *   get:
 *     summary: Obtener todas las citas de un usuario por su tipo y número de documento
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [CC, Pasaporte, TI]
 *         required: true
 *         description: Tipo de documento del usuario
 *       - in: path
 *         name: numero
 *         schema:
 *           type: string
 *         required: true
 *         description: Número de documento del usuario
 *     responses:
 *       200:
 *         description: Lista de citas del usuario
 *       404:
 *         description: Usuario no encontrado o sin citas
 */
app.get("/citas/documento/:tipo/:numero", async (req, res) => {
  try {
    const { tipo, numero } = req.params;

    // Buscar el usuario por tipo y número de documento
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuarios")
      .select("id")
      .eq("tipo_documento", tipo)
      .eq("numero_documento", numero)
      .single();

    if (usuarioError || !usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Obtener todas las citas del usuario con información del servicio
    const { data, error } = await supabase
      .from("citas")
      .select(`
        *,
        servicio:tipo_servicio(id, nombre, estado)
      `)
      .eq("usuario_id", usuario.id)
      .order("dia", { ascending: true });

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ message: "El usuario no tiene citas registradas" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener citas por documento:", error);
    res.status(500).json({ error: "Error al obtener las citas" });
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
 *         schema:
 *           type: string
 *         required: true
 *         description: Número de documento del usuario
 *     responses:
 *       200:
 *         description: Lista de citas del usuario
 *       404:
 *         description: Usuario no encontrado o sin citas
 */
app.get("/citas/CC/:numero", async (req, res) => {
  try {
    const { numero } = req.params;

    // Buscar el usuario por tipo y número de documento
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuarios")
      .select("id")
      .eq("tipo_documento", "CC")
      .eq("numero_documento", numero)
      .single();

    if (usuarioError || !usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Obtener todas las citas del usuario con información del servicio
    const { data, error } = await supabase
      .from("citas")
      .select(`
        *,
        servicio:tipo_servicio(id, nombre, estado)
      `)
      .eq("usuario_id", usuario.id)
      .order("dia", { ascending: true });

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ message: "El usuario no tiene citas registradas" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener citas por documento:", error);
    res.status(500).json({ error: "Error al obtener las citas" });
  }
});

/**
 * @swagger
 * /citas/telefono/{telefono}:
 *   get:
 *     summary: Obtener todas las citas de un usuario por su número de teléfono
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: telefono
 *         schema:
 *           type: string
 *         required: true
 *         description: Número de teléfono del usuario
 *     responses:
 *       200:
 *         description: Lista de citas del usuario
 *       404:
 *         description: Usuario no encontrado o sin citas
 */
app.get("/citas/telefono/:telefono", async (req, res) => {
  try {
    const { telefono } = req.params;

    // Buscar el usuario por número de teléfono
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuarios")
      .select("id")
      .eq("telefono", telefono)
      .single();

    if (usuarioError || !usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Obtener todas las citas del usuario con información del servicio
    const { data, error } = await supabase
      .from("citas")
      .select(`
        *,
        servicio:tipo_servicio(id, nombre, estado)
      `)
      .eq("usuario_id", usuario.id)
      .order("dia", { ascending: true });

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ message: "El usuario no tiene citas registradas" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener citas por teléfono:", error);
    res.status(500).json({ error: "Error al obtener las citas" });
  }
});

/**
 * @swagger
 * /usuarios/CC/{numero}:
 *   get:
 *     summary: Obtener información de un usuario y sus citas por número de documento (CC)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: numero
 *         schema:
 *           type: string
 *           example: "1193246872"
 *         required: true
 *         description: Número de documento del usuario (CC)
 *     responses:
 *       200:
 *         description: Información del usuario y sus citas
 *         content:
 *           application/json:
 *             example:
 *               usuario:
 *                 id: "fb4219e3-d141-4475-a3c3-6a9e94e2b133"
 *                 nombre_completo: "Juan Pérez"
 *                 tipo_documento: "CC"
 *                 numero_documento: "1193246872"
 *                 telefono: "3001234567"
 *                 created_at: "2023-08-01T15:30:45Z"
 *                 updated_at: "2023-08-01T15:30:45Z"
 *               citas:
 *                 - id: "a9b9c9d9-e9f9-49a9-b9c9-d9e9f9a9b9c9"
 *                   dia: "2023-08-15T14:00:00Z"
 *                   duracion: 60
 *                   estado: "confirmada"
 *                   created_at: "2023-08-01T15:30:45Z"
 *                   updated_at: "2023-08-01T16:45:22Z"
 *                   servicio:
 *                     id: "145310bb-f764-4d21-be4a-95a619d3a3d2"
 *                     nombre: "Corte de cabello"
 *                     estado: "activo"
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
app.get("/usuarios/CC/:numero", async (req, res) => {
  try {
    const { numero } = req.params;

    // Buscar el usuario por tipo y número de documento
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("tipo_documento", "CC")
      .eq("numero_documento", numero)
      .single();

    if (usuarioError || !usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Obtener todas las citas del usuario con información del servicio
    const { data: citas, error: citasError } = await supabase
      .from("citas")
      .select(`
        *,
        servicio:tipo_servicio(id, nombre, estado)
      `)
      .eq("usuario_id", usuario.id)
      .order("dia", { ascending: true });

    if (citasError) throw citasError;

    // Devolver tanto la información del usuario como sus citas
    res.status(200).json({
      usuario,
      citas: citas.length > 0 ? citas : []
    });
  } catch (error) {
    console.error("Error al obtener usuario y citas:", error);
    res.status(500).json({ error: "Error al obtener la información del usuario y sus citas" });
  }
});

/**
 * @swagger
 * /horarios/todos:
 *   get:
 *     summary: Obtener todos los horarios disponibles para el próximo mes
 *     tags: [Horarios]
 *     responses:
 *       200:
 *         description: Horarios disponibles organizados por día
 *         content:
 *           application/json:
 *             example:
 *               "2023-08-15":
 *                 disponibles:
 *                   - "2023-08-15T09:00:00Z"
 *                   - "2023-08-15T09:30:00Z"
 *                   - "2023-08-15T10:00:00Z"
 *                   - "2023-08-15T10:30:00Z"
 *                   - "2023-08-15T11:00:00Z"
 *                 ocupados:
 *                   - hora: "2023-08-15T14:00:00Z"
 *                     cita_id: "a9b9c9d9-e9f9-49a9-b9c9-d9e9f9a9b9c9"
 *                   - hora: "2023-08-15T14:30:00Z"
 *                     cita_id: "a9b9c9d9-e9f9-49a9-b9c9-d9e9f9a9b9c9"
 *               "2023-08-16":
 *                 disponibles:
 *                   - "2023-08-16T09:00:00Z"
 *                   - "2023-08-16T09:30:00Z"
 *                   - "2023-08-16T11:00:00Z"
 *                   - "2023-08-16T11:30:00Z"
 *                 ocupados:
 *                   - hora: "2023-08-16T10:00:00Z"
 *                     cita_id: "b8c7d6e5-f4g3-h2i1-j0k9-l8m7n6o5p4q3"
 *                   - hora: "2023-08-16T10:30:00Z"
 *                     cita_id: "b8c7d6e5-f4g3-h2i1-j0k9-l8m7n6o5p4q3"
 */
app.get("/horarios/todos", async (req, res) => {
  try {
    // Configurar fechas para el próximo mes
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 2, 0); // Último día del próximo mes

    // Obtener todas las citas existentes para ese período
    const { data: citas, error } = await supabase
      .from("citas")
      .select("*")
      .gte("dia", inicioMes.toISOString())
      .lt("dia", finMes.toISOString());

    if (error) throw error;

    // Mapear citas a horarios ocupados
    const horariosOcupados = citas.map((cita) => {
      const inicio = new Date(cita.dia);
      return {
        id: cita.id,
        inicio,
        fin: new Date(inicio.getTime() + cita.duracion * 60000),
        usuario_id: cita.usuario_id,
        tipo_servicio: cita.tipo_servicio,
      };
    });

    // Generar todos los días del período
    const horariosTodos = {};
    const horaInicio = 9; // 9:00 AM
    const horaFin = 17; // 5:00 PM
    const intervalo = 30; // 30 minutos

    // Iterar por cada día del período
    for (let d = new Date(inicioMes); d <= finMes; d.setDate(d.getDate() + 1)) {
      const fechaStr = d.toISOString().split("T")[0];
      const fechaDia = new Date(fechaStr);

      // No incluir domingos (0 es domingo en JavaScript)
      if (fechaDia.getDay() === 0) continue;

      const horariosDisponibles = [];
      const horariosOcupadosDia = [];

      // Generar todos los horarios posibles para este día
      for (let hora = horaInicio; hora < horaFin; hora++) {
        for (let minuto = 0; minuto < 60; minuto += intervalo) {
          const horarioPropuesto = new Date(fechaDia);
          horarioPropuesto.setHours(hora, minuto, 0, 0);

          // Verificar si el horario está ocupado
          const citaOcupada = horariosOcupados.find((horario) => {
            return (
              horarioPropuesto >= horario.inicio &&
              horarioPropuesto < horario.fin
            );
          });

          if (citaOcupada) {
            horariosOcupadosDia.push({
              hora: horarioPropuesto,
              cita_id: citaOcupada.id,
            });
          } else {
            horariosDisponibles.push(horarioPropuesto);
          }
        }
      }

      horariosTodos[fechaStr] = {
        disponibles: horariosDisponibles,
        ocupados: horariosOcupadosDia,
      };
    }

    res.status(200).json(horariosTodos);
  } catch (error) {
    console.error("Error al obtener todos los horarios:", error);
    res.status(500).json({ error: "Error al obtener los horarios" });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
