import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { RouterModule, Router } from '@angular/router';
import { FooterComponent } from 'app/components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, FooterComponent, NavbarComponent],
})
export class LoginComponent {
  email = '';
  password = '';
  mensaje = '';
  isLoading = false;
  correoNoConfirmado = false;

  emailError = false;
  passwordError = false;

  showRecuperar = false;
  recEmail = '';
  recMensaje = '';
  recIsLoading = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async login(form: NgForm) {
    if (form.invalid) {
      this.mensaje = 'Por favor ingresa tus datos correctamente';
      Object.values(form.controls).forEach((c) => c.markAsTouched());
      return;
    }

    this.isLoading = true;
    this.mensaje = '';
    this.correoNoConfirmado = false;

    try {
      const loginResult = await this.supabaseService.loginUsuario(
        this.email,
        this.password
      );
      if (!loginResult) {
        this.mensaje = '❌ Email o contraseña incorrectos';
        this.isLoading = false;
        return;
      }

      const { data: userData, error: userError } = await this.supabaseService
        .getClient()
        .auth.getUser();
      if (userError || !userData?.user) {
        this.mensaje = '❌ Error al obtener usuario';
        this.isLoading = false;
        return;
      }

      const user = userData.user;

      if (!user.email_confirmed_at) {
        this.mensaje = '❌ Debes confirmar tu correo antes de iniciar sesión.';
        this.correoNoConfirmado = true;
        this.isLoading = false;
        return;
      }

      const session = await this.supabaseService.getSession();
      if (!session) {
        this.mensaje = '❌ Error al obtener sesión';
        this.isLoading = false;
        return;
      }

      const userId = session.user.id;

      // Usamos getPerfilUsuario para obtener el perfil completo, incluyendo el rol
      const perfil = await this.supabaseService.getPerfilUsuario(userId);
      if (!perfil) {
        const nuevoPerfil = {
          id: user.id,
          nombre: user.user_metadata?.['full_name'] || 'Sin nombre',
          correo: user.email!,
          rol: 'cliente',
          edad: 18,
        };

        try {
          await this.supabaseService.insertarPerfilUsuario(nuevoPerfil);
          console.log('✅ Perfil creado automáticamente en tabla usuarios.');
        } catch (insertError) {
          console.warn('⚠️ Error al insertar perfil:', insertError);
        }
      }

      // Obtener el rol del perfil correctamente (accedemos al valor 'rol' del objeto)
      const rol = perfil?.rol; // Accedemos directamente al rol del perfil
      if (!rol) {
        this.mensaje = '❌ No se pudo obtener el rol del usuario';
        this.isLoading = false;
        return;
      }

      switch (rol) {
        case 'admin':
          this.router.navigate(['/dashboard']);
          break;
        case 'cliente':
          this.router.navigate(['/home']);
          break;
        default:
          this.router.navigate(['/']);
          break;
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      this.mensaje = this.getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  private getErrorMessage(error: any): string {
    if (error.message.includes('Invalid login credentials')) {
      return '❌ Credenciales incorrectas';
    }
    if (error.message.includes('Email not confirmed')) {
      this.correoNoConfirmado = true;
      return '❌ Confirma tu email primero.';
    }
    return '❌ Error al iniciar sesión. Intenta nuevamente.';
  }

  async reenviarCorreo() {
    if (!this.email) {
      this.mensaje = '❌ Ingresa tu email primero';
      return;
    }

    this.isLoading = true;
    try {
      await this.supabaseService.reenviarCorreoConfirmacion(this.email);
      this.mensaje =
        '📨 Correo de confirmación reenviado. Revisa tu bandeja de entrada.';
      this.correoNoConfirmado = false;
    } catch (error) {
      console.error('Error al reenviar correo:', error);
      this.mensaje = '❌ Error al reenviar el correo. Verifica tu email.';
    } finally {
      this.isLoading = false;
    }
  }

  abrirRecuperar() {
    this.recEmail = '';
    this.recMensaje = '';
    this.recIsLoading = false;
    this.showRecuperar = true;
  }

  cerrarRecuperar() {
    this.showRecuperar = false;
  }

  // ——— Método de recuperación ———
  async enviarRecuperacion() {
    if (!this.recEmail) {
      this.recMensaje = '❌ Por favor ingresa un correo electrónico.';
      return;
    }
    this.recIsLoading = true;
    this.recMensaje = '';
    try {
      await this.supabaseService.recuperarContrasena(this.recEmail);
      this.recMensaje = '📨 Se envió un correo para recuperar la contraseña.';
    } catch {
      this.recMensaje = '❌ Error al enviar el correo. Verifica el email.';
    } finally {
      this.recIsLoading = false;
    }
  }
}

export default LoginComponent;
