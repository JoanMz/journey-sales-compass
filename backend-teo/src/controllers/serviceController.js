const supabase = require('../config/supabase');

// Get all services with optional type filter
const getServices = async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = supabase
      .from('service')
      .select('*');
    
    // Apply type filter if provided
    if (type) {
      query = query.eq('type', type);
    }
    
    // Get data
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get service by ID
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('service')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Service not found' });
      }
      throw error;
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getServices,
  getServiceById
}; 