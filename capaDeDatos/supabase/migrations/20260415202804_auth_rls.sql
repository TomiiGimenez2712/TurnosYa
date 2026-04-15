-- Eliminamos la política que permitía a cualquiera crear canchas
DROP POLICY IF EXISTS "Inserción pública de canchas" ON canchas;

-- 1. Políticas de Admin para Canchas:
-- Permite insertar, actualizar y borrar canchas solo si se tiene sesión iniciada (Admin)
CREATE POLICY "Admin All Canchas" ON canchas
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Políticas de Admin para Reservas:
-- Permite modificar o eliminar reservas solo si se tiene sesión iniciada
CREATE POLICY "Admin Update Delete Reservas" ON reservas
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- NOTA: La inserción y lectura de reservas sigue siendo pública ("Lectura pública de reservas" e "Inserción pública de reservas")
-- porque el modelo de negocio permite que cualquier usuario anónimo agende su turno.
-- Solo la GESTIÓN de canchas y ELIMINACIÓN de turnos queda restringida al Admin.
