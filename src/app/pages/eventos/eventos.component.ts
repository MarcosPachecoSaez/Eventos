import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  eventos: any[] = [];
  eventoSeleccionado: any = null;
  mostrarModal: boolean = false;
  cargando: boolean = true;
  rol: 'admin' | 'cliente' | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.cargando = true;

    try {
      const session = await this.supabaseService.getSession();
      if (session) {
        // Obtenemos el perfil del usuario, que contiene el rol
        const perfil = await this.supabaseService.getPerfilUsuario(session.user.id);
        // Asignamos el rol extraído del perfil
        if (perfil) {
          this.rol = perfil.rol; // Aquí asignamos solo el valor de 'rol'
        }
      }

      this.eventos = await this.supabaseService.getEventos();
    } catch (error) {
      console.error('Error al cargar eventos:', error);
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
    const confirmar = confirm('¿Deseas eliminar este evento?');
    if (!confirmar) return;

    const { error } = await this.supabaseService.client
      .from('eventos')
      .delete()
      .eq('id', id);

    if (!error) {
      this.eventos = this.eventos.filter(e => e.id !== id);
      this.cerrarModal();
      alert('✅ Evento eliminado.');
    } else {
      alert('❌ Error al eliminar.');
    }
  }

  esAdmin(): boolean {
    return this.rol === 'admin';
  }

  esCliente(): boolean {
    return this.rol === 'cliente';
  }
}
