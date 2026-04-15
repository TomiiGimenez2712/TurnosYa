import { supabaseClient } from '../capaDeDatos/supabaseClient.js';

export class ConfigController {
    /**
     * Obtiene la configuraciÃ³n pÃºblica global (1 fila)
     */
    static async getConfig() {
        const { data, error } = await supabaseClient
            .from('club_config')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) {
            console.error("Error obteniendo configuraciÃ³n del club:", error);
            return null;
        }
        return data;
    }

    /**
     * Actualiza la configuraciÃ³n global del club (sÃ³lo Admin validado por RLS)
     */
    static async updateConfig(datos) {
        const { error } = await supabaseClient
            .from('club_config')
            .update({
                nombre: datos.nombre,
                telefono_whatsapp: datos.telefono_whatsapp,
                detalles_bancarios: datos.detalles_bancarios
            })
            .eq('id', 1);

        if (error) {
            console.error("Error actualizando club_config:", error);
            return { success: false, error: error.message };
        }
        return { success: true };
    }
}

