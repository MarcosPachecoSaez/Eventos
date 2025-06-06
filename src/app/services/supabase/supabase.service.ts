import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  public client: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    this.client = this.supabase;
  }

  // ========================
  // === AUTENTICACIÓN ===
  // ========================

async registrarUsuario(email: string, password: string, nombre: string) {
  const { data, error } = await this.supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: nombre
      }
    }
  });
  return { data, error };
}



  async loginUsuario(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async logoutUsuario() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getUser() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return data?.user ?? null;
  }

  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  // ==============================
  // === PERFILES Y ROLES ===
  // ==============================

  async insertarPerfilUsuario(datosUsuario: { id: string; nombre: string; correo: string; rol: string; edad?: number }) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .insert([datosUsuario]);

    if (error) throw error;
    return data;
  }

  async getPerfilUsuario(userId: string) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('nombre, correo, rol')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('❌ Error al obtener perfil:', error.message);
      return null;
    }

    return data;
  }

  async getRolUsuario(userId: string): Promise<'admin' | 'cliente' | null> {
    console.log('🔍 Buscando rol para userId:', userId);

    const { data, error } = await this.supabase
      .from('usuarios')
      .select('rol')
      .eq('id', userId)
      .maybeSingle(); // ✅ no lanza error si no encuentra

    if (error) {
      console.error('❌ Error al obtener el rol del usuario:', error.message);
      return null;
    }

    if (!data) {
      console.warn('⚠️ No se encontró un perfil para este usuario.');
      return null;
    }

    console.log('✅ Rol obtenido:', data.rol);
    return data.rol as 'admin' | 'cliente' | null;
  }

  async getRolActual(): Promise<'admin' | 'cliente' | null> {
    const { data, error } = await this.supabase.auth.getUser();

    if (error || !data?.user) {
      console.warn('⚠️ No hay usuario autenticado o hubo error al obtenerlo.');
      return null;
    }

    return this.getRolUsuario(data.user.id);
  }

  // ========================
  // === EVENTOS ===
  // ========================

  async getEventos() {
    const { data, error } = await this.supabase
      .from('eventos')
      .select('*')
      .order('fecha', { ascending: true });
    if (error) throw error;
    return data;
  }

  async getEventoById(id: string): Promise<any> {
    const { data } = await this.client
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single();
    return data;
  }

  // ========================
  // === TICKETS ===
  // ========================

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

    // 2. Obtener entradas vendidas
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

    // 3. Insertar ticket
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

  async getMisTickets(): Promise<any[]> {
    const session = await this.getSession();
    if (!session) return [];

    const usuario_id = session.user.id;

    const { data } = await this.client
      .from('tickets')
      .select(`
        id,
        cantidad,
        codigo_qr,
        created_at,
        eventos (
          id,
          nombre,
          fecha,
          precio
        )
      `)
      .eq('usuario_id', usuario_id);

    return data || [];
  }

  // ========================
  // === RECUPERACIÓN ===
  // ========================

  async reenviarCorreoConfirmacion(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resend({ type: 'signup', email });
    if (error) throw error;
  }

  async recuperarContrasena(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:4200/cambiar-contrasena'
    });
    if (error) throw error;
  }

  async resetPassword(newPassword: string) {
    const { data, error } = await this.supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return data;
  }

  // ========================
  // === VALIDACIÓN ===
  // ========================

  async verificarCorreoExistente(correo: string): Promise<{ existe: boolean; error: any }> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('correo')
      .eq('correo', correo)
      .maybeSingle();

    return { existe: !!data, error };
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
