import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css']
})
export class CrearEventoComponent {
  evento = {
    nombre: '',
    descripcion: '',
    fecha: '',
    lugar: '',
    categoria: '',
    precio: 0,
    imagen_url: ''
  };

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async crearEvento() {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('eventos')
        .insert([this.evento]);

      if (error) {
        console.error('❌ Error al crear evento:', error.message);
        return;
      }

      console.log('✅ Evento creado:', data);
      alert('Evento creado exitosamente');
      this.router.navigate(['/eventos']); // Redirige a ver los eventos
    } catch (error) {
      console.error('❌ Error inesperado:', (error as Error).message);
    }
  }
}
