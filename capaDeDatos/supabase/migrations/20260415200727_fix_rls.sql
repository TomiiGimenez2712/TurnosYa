-- Eliminamos las tablas viejas que no tenían Row Level Security activado (alertadas por correo)
-- Estas tablas pertenecían a la versión anterior (Vanilla sin BaaS protegido)
DROP TABLE IF EXISTS reservas_turnosya;
DROP TABLE IF EXISTS club_config;
