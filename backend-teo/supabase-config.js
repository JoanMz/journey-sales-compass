const { createClient } = require('@supabase/supabase-js');

// Try to load dotenv configuration, but don't fail if .env file doesn't exist
try {
  require('dotenv').config();
} catch (error) {
  console.warn('Warning: .env file not found, using default or environment variables');
}

// Supabase configuration with fallback values for development
const supabaseUrl = process.env.SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example';

// Log a warning in development mode but don't stop the server
if (process.env.NODE_ENV !== 'production' && 
    (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY)) {
  console.warn('===================================================================');
  console.warn('WARNING: Using default Supabase credentials. For development only!');
  console.warn('Create a .env file with SUPABASE_URL and SUPABASE_KEY for production');
  console.warn('===================================================================');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

module.exports = supabase; 