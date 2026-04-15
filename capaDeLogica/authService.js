import { supabaseClient } from '../capaDeDatos/supabaseClient.js';

export class AuthService {
    /**
     * Inicia sesiÃ³n con correo y contraseÃ±a.
     */
    static async login(email, password) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true, data };
    }

    /**
     * Cierra la sesiÃ³n activa.
     */
    static async logout() {
        const { error } = await supabaseClient.auth.signOut();
        return { success: !error, error: error?.message };
    }

    /**
     * Comprueba si hay una sesiÃ³n activa, si no la hay redirige.
     */
    static async requireAuth(redirectTo = 'login.html') {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        if (error || !user) {
            window.location.href = redirectTo;
            return null;
        }
        return user;
    }

    /**
     * Chequea si el usuario estÃ¡ autenticado sin redirigir
     */
    static async isAuthenticated() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        return !!user;
    }
}

