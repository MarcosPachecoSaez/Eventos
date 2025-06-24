import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  public client: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
    this.client = this.supabase;
  }

  // ========================
  // === TICKETS ===
  // ========================
 /** Compra entradas para un evento y devuelve el código QR */
  async comprarEntradas(eventoId: string, cantidad: number): Promise<string | null> {
  const session = await this.getSession();
  if (!session) return null;

  const usuario_id = session.user.id;

  // 1. Obtener evento
  const { data: evento, error: errorEvento } = await this.client
    .from('eventos')
    .select('aforo')
    .eq('id', eventoId)
    .single();

  if (errorEvento || !evento) {
    console.error('❌ Error al obtener evento:', errorEvento);
    return null;
  }

  // 2. Obtener cantidad ya vendida
  const { data: ticketsVendidos, error: errorTickets } = await this.client
    .from('tickets')
    .select('cantidad')
    .eq('evento_id', eventoId);

  const totalVendidas = ticketsVendidos?.reduce((acc, t) => acc + t.cantidad, 0) || 0;
  const disponibles = evento.aforo - totalVendidas;

  if (cantidad > disponibles) {
    alert(`❌ Solo quedan ${disponibles} entradas disponibles.`);
    return null;
  }

  // 3. Insertar ticket si hay stock
  const codigo_qr = uuidv4();
  const { error } = await this.client.from('tickets').insert({
    evento_id: eventoId,
    usuario_id,
    cantidad,
    codigo_qr
  });

  if (error) {
    console.error('Error al crear ticket:', error);
    return null;
  }

  return codigo_qr;
}




  // Obtener los tickets del usuario
  async getMisTickets(): Promise<any[]> {
    try {
      const session = await this.getSession();
      if (!session) return [];

      const usuario_id = session.user.id;

      const { data, error } = await this.client
        .from('tickets')
        .select(
          `id, cantidad, codigo_qr, created_at, eventos(id, nombre, fecha, precio)`
        )
        .eq('usuario_id', usuario_id);

      if (error) {
        console.error('❌ Error al obtener mis tickets:', error.message);
        return [];
      }

      return data || [];
    } catch (error: any) {
      console.error('❌ Error al obtener tickets:', error.message);
      return [];
    }
  }

  // Obtener la lista de eventos
  async getEventos() {
    try {
      const { data, error } = await this.supabase
        .from('eventos')
        .select('*')
        .order('fecha', { ascending: true });

      if (error) {
        console.error('❌ Error al obtener eventos:', error.message);
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('❌ Error al obtener eventos:', error.message);
      return [];
    }
  }

  // ========================
  // === PERFILES Y ROLES ===
  // ========================

  // Método para insertar un nuevo perfil de usuario
  async insertarPerfilUsuario(datosUsuario: {
    id: string;
    nombre: string;
    correo: string;
    rol: string;
    edad?: number;
  }) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .insert([datosUsuario]);

    if (error) {
      console.error('❌ Error al insertar perfil:', error.message);
      throw error; // Lanza el error para que sea capturado en el componente
    }

    return { data, error };
  }

  // Obtener el perfil completo del usuario (incluye rol)
  async getPerfilUsuario(userId: string) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('nombre, correo, rol, edad')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('❌ Error al obtener perfil:', error.message);
      return null;
    }

    return data;  // Devuelve el objeto completo con rol incluido
  }

  // ========================
  // === SESIONES ===
  // ========================

  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async getUser() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return data?.user ?? null;
  }

  // ========================
  // === EVENTOS ===
  // ========================

  // Método para obtener un evento por su ID
  async getEventoById(id: string) {
    const { data, error } = await this.supabase
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single(); // Obtener un solo evento

    if (error) {
      console.error('❌ Error al obtener evento por ID:', error.message);
      throw error;
    }

    return data; // Devuelve el evento específico
  }

  // ========================
  // === AUTENTICACIÓN ===
  // ========================
  // Método para registrar un nuevo usuario
  async registrarUsuario(email: string, password: string, nombre: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nombre,
        },
      },
    });

    if (error || !data.user?.id) return { data, error };

    const usuarioId = data.user.id;

    const perfil = {
      id: usuarioId,
      nombre: nombre,
      correo: email,
      rol: 'cliente', // Asignamos 'cliente' por defecto
      edad: null,
    };

    const { error: insertError } = await this.supabase
      .from('usuarios')
      .insert([perfil]);

    if (insertError) {
      console.error('❌ Error al insertar perfil:', insertError.message);
    }

    return { data, error };
  }

  // Iniciar sesión de usuario
  async loginUsuario(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Error al iniciar sesión:', error);
      throw error;
    }

    return data;
  }
  // Método para cerrar sesión del usuario
async logoutUsuario() {
  const { error } = await this.supabase.auth.signOut(); // Cambié logoutUsuario por signOut
  if (error) {
    console.error('❌ Error al cerrar sesión:', error.message);
    throw error; // Lanza el error si ocurre
  }
}


  // ========================
  // === CONTRASEÑAS Y CORREOS ===
  // ========================

  async reenviarCorreoConfirmacion(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resend({
      type: 'signup',
      email,
    });
    if (error) throw error;
  }

  async recuperarContrasena(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:4200/cambiar-contrasena',
    });
    if (error) throw error;
  }

  // ========================
  // === VALIDACIÓN ===
  // ========================

  async verificarCorreoExistente(
    correo: string
  ): Promise<{ existe: boolean; error: any }> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('correo')
      .eq('correo', correo)
      .maybeSingle();

    return { existe: !!data, error };
  }

  // Método para resetear la contraseña del usuario
  async resetPassword(newPassword: string) {
    // Obtenemos el usuario actualmente autenticado
    const { data, error } = await this.supabase.auth.updateUser({
      password: newPassword,  // Cambiamos la contraseña
    });

    if (error) {
      console.error('Error al restablecer la contraseña:', error.message);
      throw new Error(error.message);  // Lanza un error si ocurre
    }

    return data;  // Devuelve los datos del usuario actualizado
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
