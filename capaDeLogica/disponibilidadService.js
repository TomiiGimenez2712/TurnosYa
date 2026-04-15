import { supabaseClient } from '../capaDeDatos/supabaseClient.js';

export class DisponibilidadService {
    /**
     * Obtiene todas las canchas disponibles desde la base de datos
     */
    static async obtenerCanchas() {
        const { data, error } = await supabaseClient
            .from('canchas')
            .select('*')
            .order('creado_en', { ascending: true });
        
        if (error) {
            console.error("Error obteniendo canchas:", error);
            return [];
        }
        return data;
    }

    /**
     * Obtiene las reservas para una fecha específica
     */
    static async obtenerReservasPorFecha(fechaISO) {
        const { data, error } = await supabaseClient
            .from('reservas')
            .select('*')
            .eq('fecha', fechaISO);

        if (error) {
            console.error("Error obteniendo reservas:", error);
            return [];
        }
        return data;
    }

    /**
     * Confirma la reserva validando de nuevo la disponibilidad antes de insertar
     * para asegurar la transacción atómica
     */
    static async confirmarReserva({ cancha_id, fecha, hora, jugador_nombre, jugador_telefono, jugador_email, precio }) {
        try {
            // 1. Validar que la cancha y horario no estén ocupados es manejado en la base de datos
            // por la restricción UNIQUE(cancha_id, fecha, hora). Al intentar insertar, si existe, fallará.
            
            // 2. Si no hay tabla de jugadores real que mantenga sesión, creamos/buscamos al jugador por su email (simulado).
            let jugador_id;
            
            // Buscar jugador
            const { data: jugadorData, error: jugadorError } = await supabaseClient
                .from('jugadores')
                .select('id')
                .eq('email', jugador_email)
                .single();

            if (jugadorError && jugadorError.code !== 'PGRST116') { // PGRST116 es not found
                throw new Error("Error consultando al jugador");
            }

            if (jugadorData) {
                jugador_id = jugadorData.id;
            } else {
                // Crear jugador
                const { data: newJugador, error: newJugadorError } = await supabaseClient
                    .from('jugadores')
                    .insert([{ nombre: jugador_nombre, email: jugador_email, telefono: jugador_telefono }])
                    .select('id')
                    .single();
                
                if (newJugadorError) throw new Error("Error creando jugador: " + newJugadorError.message);
                jugador_id = newJugador.id;
            }

            // 3. Crear Reserva (RNF1: Transacción y Concurrencia en BD)
            const { data: reserva, error: reservaError } = await supabaseClient
                .from('reservas')
                .insert([{
                    cancha_id,
                    jugador_id,
                    fecha,
                    hora,
                    precio
                }])
                .select()
                .single();

            if (reservaError) {
                if (reservaError.code === '23505') { // Postgres Unique Violation
                    return { success: false, error: "¡Ups! Este turno acaba de ser reservado por alguien más." };
                }
                throw new Error(reservaError.message);
            }

            return { success: true };
        } catch (err) {
            console.error("Error en confirmarReserva:", err);
            return { success: false, error: err.message };
        }
    }

    /**
     * Obtiene las reservas de un jugador por su email
     */
    static async obtenerReservasPorEmail(emailStr) {
        try {
            const { data, error } = await supabaseClient
                .from('reservas')
                .select(`
                    id, fecha, hora, precio, estado,
                    canchas ( nombre ),
                    jugadores!inner ( email )
                `)
                .eq('jugadores.email', emailStr)
                .order('fecha', { ascending: false });

            if (error) throw error;
            return data;
        } catch (err) {
            console.error("Error obteniendo mis reservas:", err);
            return [];
        }
    }
}
