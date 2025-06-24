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

  // Función para cambiar la contraseña
  async cambiar() {
    // Validación de la contraseña
    if (!this.nuevaContrasena || this.nuevaContrasena.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    // Verificar si la contraseña cumple con la política de seguridad (mayúscula, minúscula y número)
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(this.nuevaContrasena)) {
      alert('La contraseña debe contener al menos una mayúscula, una minúscula y un número.');
      return;
    }

    this.cargando = true;  // Mostrar el indicador de carga

    try {
      // Intentar cambiar la contraseña a través del servicio
      await this.supabaseService.resetPassword(this.nuevaContrasena);
      alert('✅ Contraseña actualizada correctamente.');

      // Redirigir al login luego de 2 segundos
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } catch (error: any) {
      // Manejo del error en caso de que ocurra un fallo
      alert('❌ Error: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      // Ocultar el indicador de carga al finalizar
      this.cargando = false;
    }
  }
}
