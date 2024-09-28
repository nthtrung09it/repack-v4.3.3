// app/services/database/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';
import Config from '../../config/config.base';

export const supabase = createClient(
  Config.supabaseUrl,
  Config.supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      storage: AsyncStorage,
    },
  },
);
