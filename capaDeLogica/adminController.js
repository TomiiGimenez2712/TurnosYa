import { supabaseClient } from '../capaDeDatos/supabaseClient.js';

export class AdminController {
    /**
     * Obtiene las reservas con información relacionada para la vista del administrador
     */
    static async obtenerReservasDelDia(fechaBase) {
        // En una consulta compleja, podríamos querer hacer join con la tabla 'canchas'
        // para obtener el nombre, y con 'jugadores' para obtener los datos.
        const { data, error } = await supabaseClient
            .from('reservas')
            .select(`
                id,
                fecha,
                hora,
                precio,
                estado,
                canchas ( nombre ),
                jugadores ( nombre, telefono, email )
            `)
            .eq('fecha', fechaBase)
            .order('hora', { ascending: true });

        if (error) {
            console.error("Error al traer reservas para admin:", error);
            return null;
        }
        return data; 
    }

    /**
     * Elimina una reserva de la base de datos
     * (El RLS requiere que el usuario esté autenticado para hacer esto)
     */
    static async eliminarReserva(id) {
        const { error } = await supabaseClient
            .from('reservas')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error eliminando reserva:", error);
            return { success: false, error: error.message };
        }
        return { success: true };
    }

    /**
     * Confirma el pago de una reserva pendiente
     */
    static async confirmarPago(id) {
        const { error } = await supabaseClient
            .from('reservas')
            .update({ estado: 'confirmada' })
            .eq('id', id);

        if (error) {
            console.error("Error confirmando pago:", error);
            return { success: false, error: error.message };
        }
        return { success: true };
    }
}
