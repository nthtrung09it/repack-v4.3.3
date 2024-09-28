// `app/config/config.base.ts`:

// update the interface to include the new properties
export interface ConfigBaseProps {
  // Existing config properties

  supabaseUrl: string;
  supabaseAnonKey: string;
}

// Add the new properties to the config object
const BaseConfig: ConfigBaseProps = {
  supabaseUrl: 'https://supabase.chibi.vn/',
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE',
};

export default BaseConfig;
