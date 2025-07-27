const { createClient } = require('@supabase/supabase-js');
const config = require('./services');

const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

module.exports = { supabase }; 