import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css'],
  imports: [CommonModule, FormsModule],
})
export class RecuperarComponent {
  email: string = '';
  mensaje: string = '';
  isLoading: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async enviarRecuperacion() {
    if (!this.email) {
      this.mensaje = '❌ Por favor ingresa un correo electrónico.';
      return;
    }

    this.isLoading = true;
    this.mensaje = '';

    try {
      await this.supabaseService.recuperarContrasena(this.email);
      this.mensaje = '📨 Se envió un correo para recuperar la contraseña.';
    } catch (error: any) {
      console.error('❌ Error al enviar recuperación:', error);
      this.mensaje = '❌ Error al enviar el correo. Verifica el email.';
    } finally {
      this.isLoading = false;
    }
  }

  volverLogin() {
    this.router.navigate(['/login']);
  }
}
