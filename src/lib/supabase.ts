
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client - use environment variables in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to invoke our proxy Edge Function
export async function invokeProxyFunction(path: string, options: any = {}) {
  try {
    const { data, error } = await supabase.functions.invoke('api-proxy', {
      body: {
        path,
        method: options.method || 'GET',
        body: options.body,
        params: options.params
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error invoking proxy function:', error);
    throw error;
  }
}

export default supabase;
