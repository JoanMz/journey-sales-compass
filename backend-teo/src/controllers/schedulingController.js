const supabase = require('../config/supabase');

// Get all appointments with filters
const getAppointments = async (req, res) => {
  try {
    const { userId, date, doctorId, status, limit = 20, offset = 0 } = req.query;
    
    let query = supabase
      .from('scheduling')
      .select('*, service:service_type(*), users!scheduling_user_id_fkey(*), doctor:responsible_physician_id(*)', { count: 'exact' });
    
    // Apply filters if provided
    if (userId) query = query.eq('user_id', userId);
    if (date) query = query.eq('appointment_date', date);
    if (doctorId) query = query.eq('responsible_physician_id', doctorId);
    if (status) query = query.eq('status', status);
    
    // Apply pagination
    const { data, error, count } = await query
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });
    
    if (error) throw error;
    
    res.status(200).json({
      data,
      count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('scheduling')
      .select('*, service:service_type(*), users!scheduling_user_id_fkey(*), doctor:responsible_physician_id(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      throw error;
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const { 
      parameterization, 
      serviceType, 
      userId, 
      appointmentDate, 
      appointmentTime, 
      responsiblePhysicianId,
      status = 'asignado'
    } = req.body;
    
    // Check if there's a conflicting appointment for the doctor
    const { data: conflictingDoctorAppointment, error: conflictCheckError } = await supabase
      .from('scheduling')
      .select('id')
      .eq('responsible_physician_id', responsiblePhysicianId)
      .eq('appointment_date', appointmentDate)
      .eq('appointment_time', appointmentTime)
      .maybeSingle();
    
    if (conflictCheckError) throw conflictCheckError;
    
    if (conflictingDoctorAppointment) {
      return res.status(409).json({ 
        error: 'Doctor already has an appointment at this time' 
      });
    }
    
    // Map camelCase from API to snake_case in database
    const { data, error } = await supabase
      .from('scheduling')
      .insert({
        parameterization,
        service_type: serviceType,
        user_id: userId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        responsible_physician_id: responsiblePhysicianId,
        status
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update appointment
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      parameterization, 
      serviceType, 
      userId, 
      appointmentDate, 
      appointmentTime, 
      responsiblePhysicianId,
      status
    } = req.body;
    
    // Check if appointment exists
    const { data: existingAppointment, error: checkError } = await supabase
      .from('scheduling')
      .select('id')
      .eq('id', id)
      .single();
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      throw checkError;
    }
    
    // Check for conflicts if date/time/doctor is being changed
    if (appointmentDate && appointmentTime && responsiblePhysicianId) {
      const { data: conflictingAppointment, error: conflictError } = await supabase
        .from('scheduling')
        .select('id')
        .eq('responsible_physician_id', responsiblePhysicianId)
        .eq('appointment_date', appointmentDate)
        .eq('appointment_time', appointmentTime)
        .neq('id', id) // Exclude current appointment
        .maybeSingle();
      
      if (conflictError) throw conflictError;
      
      if (conflictingAppointment) {
        return res.status(409).json({ 
          error: 'Doctor already has an appointment at this time' 
        });
      }
    }
    
    // Prepare update object with only provided fields
    const updateData = {};
    if (parameterization) updateData.parameterization = parameterization;
    if (serviceType) updateData.service_type = serviceType;
    if (userId) updateData.user_id = userId;
    if (appointmentDate) updateData.appointment_date = appointmentDate;
    if (appointmentTime) updateData.appointment_time = appointmentTime;
    if (responsiblePhysicianId) updateData.responsible_physician_id = responsiblePhysicianId;
    if (status) updateData.status = status;
    
    const { data, error } = await supabase
      .from('scheduling')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if appointment exists
    const { data: existingAppointment, error: checkError } = await supabase
      .from('scheduling')
      .select('id')
      .eq('id', id)
      .single();
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      throw checkError;
    }
    
    const { error } = await supabase
      .from('scheduling')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
}; 