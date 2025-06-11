
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lhbouidwnfzmtxsadyrh.supabase.co';
const supabaseAnonKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoYm91aWR3bmZ6bXR4c2FkeXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMDcyMjYsImV4cCI6MjA2NDY4MzIyNn0.tje1DQygs0-RCpHWhR9x_AVC9-CO3Q0x8yzRr8UgGZ0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);