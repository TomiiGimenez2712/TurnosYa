-- 1. Crear tabla de configuración global del club (Singleton)
CREATE TABLE club_config (
    id integer PRIMARY KEY DEFAULT 1,
    nombre text NOT NULL DEFAULT 'Club Deportivo Central',
    telefono_whatsapp text NOT NULL DEFAULT '',
    detalles_bancarios text NOT NULL DEFAULT '',
    -- Constraint para asegurar que solo exista 1 fila de configuración
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insertar valores iniciales por defecto pidiendo al administrador que los modifique
INSERT INTO club_config (id, nombre, telefono_whatsapp, detalles_bancarios) 
VALUES (1, 'Turnos YA Club', '5491100000000', 'ALIAS: turnos.mp\nCBU: 0000000000000000000000\nTITULAR: Administrador');

-- Habilitar RLS en club_config
ALTER TABLE club_config ENABLE ROW LEVEL SECURITY;

-- Lectura de la configuración para cualquier persona (anon o usuario)
CREATE POLICY "Lectura pública info club" ON club_config FOR SELECT USING (true);
-- Escritura / Modificación restringida al Administrador autenticado
CREATE POLICY "Admin Update Club Config" ON club_config 
FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
-- Inserciones iniciales bloqueadas desde cliente
CREATE POLICY "Admin Insert Club Config" ON club_config 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- Borrados bloqueados
CREATE POLICY "Bloqueo Borrado Club Config" ON club_config 
FOR DELETE USING (false);

-- 2. Expandir el modelo de reservas
ALTER TABLE reservas ADD COLUMN estado text DEFAULT 'pendiente_pago' NOT NULL;
