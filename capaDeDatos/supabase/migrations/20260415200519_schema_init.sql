-- Eliminamos tablas si existen para poder correrlo limpio (cuidado si ya tienes datos en producción)
DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS jugadores;
DROP TABLE IF EXISTS canchas;

-- 1. Tabla canchas
CREATE TABLE canchas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  tipo_deporte text NOT NULL,
  hora_apertura integer NOT NULL,
  hora_cierre integer NOT NULL,
  precio numeric NOT NULL,
  creado_en timestamp with time zone default now()
);

-- 2. Tabla jugadores
CREATE TABLE jugadores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text,
  creado_en timestamp with time zone default now()
);

-- 3. Tabla reservas
CREATE TABLE reservas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cancha_id uuid REFERENCES canchas (id) NOT NULL,
  jugador_id uuid REFERENCES jugadores (id) NOT NULL,
  fecha date NOT NULL,         -- Formato 'YYYY-MM-DD'
  hora text NOT NULL,          -- Formato '14:00'
  precio numeric NOT NULL,
  creado_en timestamp with time zone default now(),
  -- REQUERIMIENTO CRÍTICO RNF1: Control de solapamiento estricto
  UNIQUE(cancha_id, fecha, hora)
);

-- Habilitar Row Level Security (RLS) básico (RNF4 Seguridad)
ALTER TABLE canchas ENABLE ROW LEVEL SECURITY;
ALTER TABLE jugadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de canchas" ON canchas FOR SELECT USING (true);
CREATE POLICY "Inserción pública de canchas" ON canchas FOR INSERT WITH CHECK (true);

CREATE POLICY "Lectura pública de jugadores" ON jugadores FOR SELECT USING (true);
CREATE POLICY "Inserción pública de jugadores" ON jugadores FOR INSERT WITH CHECK (true);

CREATE POLICY "Lectura pública de reservas" ON reservas FOR SELECT USING (true);
CREATE POLICY "Inserción pública de reservas" ON reservas FOR INSERT WITH CHECK (true);
