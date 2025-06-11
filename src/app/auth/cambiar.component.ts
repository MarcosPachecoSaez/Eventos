import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase/supabase.service';

@Component({
  selector: 'app-cambiar',
  standalone: true,
  templateUrl: './cambiar.component.html',
  styleUrls: ['./cambiar.component.css'],
  imports: [CommonModule, FormsModule]
})
export class CambiarComponent {
  nuevaContrasena: string = '';
  cargando: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async cambiar() {
    if (!this.nuevaContrasena || this.nuevaContrasena.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    this.cargando = true;

    try {
      await this.supabaseService.resetPassword(this.nuevaContrasena);
      alert('✅ Contraseña actualizada correctamente.');

      // Redirigir al login luego de 2 segundos
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } catch (error: any) {
      alert('❌ Error: ' + error.message);
    } finally {
      this.cargando = false;
    }
  }
}
