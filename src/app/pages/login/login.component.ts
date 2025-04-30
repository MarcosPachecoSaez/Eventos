import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  mensaje: string = ''; // ✅ Para mostrar mensajes

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async login(form: NgForm) {
    if (form.invalid) {
      alert('Por favor ingresa tus datos correctamente');
      return;
    }

    try {
      const user = await this.supabaseService.loginUsuario(this.email, this.password);

      if (user) {
        console.log('✅ Usuario autenticado:', user);
        this.router.navigate(['/dashboard']);
      } else {
        alert('❌ Email o contraseña incorrectos');
      }
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión:', error.message || error);

      // Si el error es porque el email no está confirmado
      if (error?.message?.includes('Email not confirmed')) {
        this.mensaje = '❌ Tu correo no está confirmado. Revisa tu bandeja de entrada.';
      } else {
        this.mensaje = '❌ Error al iniciar sesión. Revisa tus credenciales.';
      }
    }
  }

  // ✅ Método para reenviar el correo de confirmación
  reenviarCorreo() {
    if (this.email) {
      this.supabaseService.reenviarCorreoConfirmacion(this.email).then(() => {
        this.mensaje = '📨 Correo de confirmación reenviado. Revisa tu bandeja de entrada.';
      }).catch((error: any) => {
        console.error('Error al reenviar el correo:', error);
        this.mensaje = '❌ Error al reenviar el correo de confirmación.';
      });
      
    }
  }

  irARecuperar() {
    this.router.navigate(['/recuperar']);
  }



}
