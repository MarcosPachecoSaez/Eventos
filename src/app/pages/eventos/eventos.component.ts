import { SupabaseClient } from '@supabase/supabase-js';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { Router } from '@angular/router';

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

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.obtenerEventos();
  }

  async obtenerEventos() {
    this.cargando = true;
    try {
      // ✅ Usamos el método público del servicio (getClient o supabaseClient)
      const { data, error } = await this.supabaseService.client
        .from('eventos')
        .select('*')
        .order('fecha', { ascending: true });

      if (error) throw error;

      this.eventos = data || [];
    } catch (error: any) {
      console.error('Error al obtener eventos:', error.message);
      this.eventos = [];
      alert('Error al cargar eventos');
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
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;

    try {
      // ✅ Usamos el método público del servicio
      const { error } = await this.supabaseService.client
        .from('eventos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('✅ Evento eliminado con éxito');
      this.obtenerEventos(); // Refrescar la lista
      this.cerrarModal();
    } catch (error: any) {
      console.error('Error al eliminar evento:', error.message);
      alert('Error al eliminar evento');
    }
  }
}
export default EventosComponent ;
