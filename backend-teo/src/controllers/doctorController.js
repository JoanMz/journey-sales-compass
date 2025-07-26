const supabase = require('../config/supabase');

// Get all doctors with optional specialty filter
const getDoctors = async (req, res) => {
  try {
    const { specialtyId, limit = 100, offset = 0 } = req.query;
    
    let query = supabase
      .from('doctor')
      .select(`
        *,
        specialty1:specialty1(*),
        specialty2:specialty2(*),
        specialty3:specialty3(*)
      `, { count: 'exact' });
    
    // Apply specialty filter if provided
    if (specialtyId) {
      query = query.or(`specialty1.eq.${specialtyId},specialty2.eq.${specialtyId},specialty3.eq.${specialtyId}`);
    }
    
    // Apply pagination
    const { data, error, count } = await query
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)
      .order('name');
    
    if (error) throw error;
    
    res.status(200).json({
      data,
      count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('doctor')
      .select(`
        *,
        specialty1:specialty1(*),
        specialty2:specialty2(*),
        specialty3:specialty3(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      throw error;
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new doctor
const createDoctor = async (req, res) => {
  try {
    const { name, code, specialty1, specialty2, specialty3 } = req.body;
    
    // Validate specialty1 is provided
    if (!specialty1) {
      return res.status(400).json({ error: 'Primary specialty is required' });
    }
    
    // Map camelCase from API to snake_case in database
    const { data, error } = await supabase
      .from('doctor')
      .insert({
        name,
        code,
        specialty1,
        specialty2,
        specialty3
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor
}; 