
// const { createClient } = require("@supabase/supabase-js");

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error("Supabase environment variables are missing");
// }

// const supabase = createClient(supabaseUrl, supabaseKey);

// module.exports = supabase;



const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);

module.exports = supabase;
