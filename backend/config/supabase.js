/**
 * Supabase Client Configuration
 * Initializes Supabase client with graceful fallback for development without env vars.
 */
const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key';

if (!process.env.SUPABASE_URL) {
  logger.warn('SUPABASE_URL is not set in environment. Using fallback credentials.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
