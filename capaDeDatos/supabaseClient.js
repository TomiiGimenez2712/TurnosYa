export const SUPABASE_URL = 'https://xjkirhznqogrgcidkusj.supabase.co';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhqa2lyaHpucW9ncmdjaWRrdXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MDA4MTgsImV4cCI6MjA5MTI3NjgxOH0.qo1NEy02e1VTmBe7mqHmkTpd0p5RcoJALie1m26JUtU';

// Instancia única (Singleton) del cliente Supabase
export const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("¡Cliente Supabase (Módulo) Iniciado!");
