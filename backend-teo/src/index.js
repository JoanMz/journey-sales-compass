const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const schedulingRoutes = require('./routes/schedulingRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const supabase = require('./config/supabase');


// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Load Swagger document
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/users', userRoutes);
// app.use('/scheduling', schedulingRoutes);
// app.use('/doctors', doctorRoutes);
// app.use('/services', serviceRoutes);


app.get('/v1/eps', async (req, res) => {
    const { data, error } = await supabase
      .from('eps')
      .select('*');

    console.log("GET EPS");

    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json(data);
    }
  });

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Medical Appointments API',
    documentation: '/api-docs'
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
}); 