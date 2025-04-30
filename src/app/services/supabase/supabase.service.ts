// supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  public client: SupabaseClient; // <-- 🔥 agregamos esta línea

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
    this.client = this.supabase; // 🔥 y aquí la inicializamos
  }

  async insertarUsuario(datosUsuario: { nombre: string; email: string; edad: number }) {
    const { data, error } = await this.supabase
      .from('usuario')
      .insert([datosUsuario]);

    if (error) throw error;
    return data;
  }

  async registrarUsuario(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
  
    if (error) {
      console.error('❌ Error al registrar usuario:', error.message);
      throw error;
    }
  
    console.log('Usuario registrado:', data.user);
    console.log('Sesión actual:', data.session);
  
    return data;
  }

  async loginUsuario(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Error al iniciar sesión:', error.message);
      return null;
    }

    return data;
  }

  async getUser() {
    const { data, error } = await this.supabase.auth.getUser();
  
    if (error) {
      console.error('❌ Error obteniendo usuario:', error.message);
      throw error;
    }
  
    return data?.user ?? null;
  }

  async reenviarCorreoConfirmacion(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resend({
      type: 'signup',
      email: email,
    });
  
    if (error) {
      throw error;
    }
  
    console.log('Correo de confirmación reenviado');
  }
  
  async recuperarContrasena(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:4200/cambiar-contrasena'
    });
  
    if (error) {
      console.error('❌ Error al enviar correo de recuperación:', error.message);
      throw error;
    }
  
    console.log('📧 Correo de recuperación enviado correctamente');
  }

  async resetPassword(newPassword: string) {
    const { data, error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });
  
    if (error) throw error;
    return data;
  }
  
  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getEventos() {
    const { data, error } = await this.supabase
      .from('eventos')
      .select('*')
      .order('fecha', { ascending: true });
  
    console.log('Eventos desde Supabase:', data); // Verifica los datos aquí
    return { data, error };
  }
  
  async obtenerUsuarioPorCorreo(correo: string) {
  const { data, error } = await this.supabase
    .from('usuario')
    .select('*')
    .eq('correo', correo)
    .single();

  if (error) {
    console.error('❌ Error al obtener usuario por correo:', error.message);
    return null;
  }

  return data;
}


   // 🆕 Esto es lo que debes agregar
   getClient(): SupabaseClient {
    return this.supabase;
  }
  
}
