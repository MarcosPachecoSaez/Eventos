import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase/supabase.service'; // Ojo con ruta correcta
import { Router } from '@angular/router'; // <-- Agregado para redirigir en editar

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  eventos: any[] = [];
  cargando: boolean = true;
  eventoSeleccionado: any = null;
  mostrarModal: boolean = false;

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerEventos();
  }

  async obtenerEventos() {
    this.cargando = true;
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('eventos')
        .select('*');
  
      console.log('Eventos obtenidos:', data);
  
      if (error) {
        console.error('❌ Error cargando eventos:', error.message);
        this.eventos = [];
        return;
      }
  
      this.eventos = data ?? [];
    } catch (error) {
      console.error('❌ Error desconocido cargando eventos:', (error as Error).message);
      this.eventos = [];
    } finally {
      this.cargando = false;
    }
  }
  
  abrirModal(evento: any) {
    this.eventoSeleccionado = evento;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.eventoSeleccionado = null;
  }

  editarEvento(evento: any) {
    this.router.navigate(['/editar-evento', evento.id]);
  }  
  
  
  async eliminarEvento(id: string) {
    if (confirm('¿Estás seguro de eliminar este evento?')) {
      const { error } = await this.supabaseService.getClient()
        .from('eventos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error al eliminar evento:', error.message);
        alert('Error eliminando el evento.');
      } else {
        alert('✅ Evento eliminado con éxito.');
        this.cerrarModal();
        this.obtenerEventos();
      }
    }
  }
}
