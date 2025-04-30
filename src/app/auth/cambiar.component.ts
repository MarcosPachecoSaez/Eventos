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
  cargando: boolean = false; // 🔥

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async cambiar() {
    this.cargando = true; // 🔥 Mostrar el loader

    try {
      await this.supabaseService.resetPassword(this.nuevaContrasena);
      alert('Contraseña actualizada ✅');

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);

    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      this.cargando = false; // 🔥 Ocultar el loader aunque haya error
    }
  }
}
