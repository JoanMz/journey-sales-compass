const supabase = require('../config/supabase');

// Get all users with pagination
const getUsers = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    const { data, error, count } = await supabase
      .from('users')
      .select('*, document_type(*), eps(*), headquarters(*)', { count: 'exact' })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    
    if (error) throw error;
    
    res.status(200).json({
      data,
      count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('users')
      .select('*, document_type(*), eps(*), headquarters(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'User not found' });
      }
      throw error;
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { 
      fullName, 
      documentTypeId, 
      documentNumber, 
      telephoneNumber, 
      epsId, 
      headquartersId, 
      birthday, 
      issueDate 
    } = req.body;
    
    // Map camelCase from API to snake_case in database
    const { data, error } = await supabase
      .from('users')
      .insert({
        full_name: fullName,
        document_type_id: documentTypeId,
        document_number: documentNumber,
        telephone_number: telephoneNumber,
        eps_id: epsId,
        headquarters_id: headquartersId,
        birthday,
        issue_date: issueDate
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      fullName, 
      documentTypeId, 
      documentNumber, 
      telephoneNumber, 
      epsId, 
      headquartersId, 
      birthday, 
      issueDate 
    } = req.body;
    
    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ error: 'User not found' });
      }
      throw checkError;
    }
    
    // Map camelCase from API to snake_case in database
    const { data, error } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        document_type_id: documentTypeId,
        document_number: documentNumber,
        telephone_number: telephoneNumber,
        eps_id: epsId,
        headquarters_id: headquartersId,
        birthday,
        issue_date: issueDate
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ error: 'User not found' });
      }
      throw checkError;
    }
    
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
}; 