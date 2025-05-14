// src/app/pages/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule], // 👈 ¡Agrega esto!
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  usuario: string | null = null;
  rol: 'admin' | 'cliente' | null = null;
  cargando = false;

  eventos: any[] = [];
  todosLosEventos: any[] = [];
  filtroCategoria: string = '';
  filtroFecha: string = '';

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async ngOnInit() {
    const user = await this.supabaseService.getUser();
    this.usuario = user?.email ?? 'Usuario';
    this.rol = await this.supabaseService.getRolUsuario(user.id);

    if (this.esAdmin() || this.esCliente()) {
      this.todosLosEventos = await this.supabaseService.getEventos();
      this.eventos = [...this.todosLosEventos];
    }
  }

  cerrarSesion() {
    this.cargando = true;
    this.supabaseService.logoutUsuario().then(() => {
      this.router.navigate(['/login']);
    });
  }

  irACrearEvento() {
    this.router.navigate(['/crear-evento']);
  }

  irABuscarEventos() {
    this.router.navigate(['/eventos']);
  }

  irAEditar(id: string) {
    this.router.navigate(['/editar-evento', id]);
  }

  esAdmin(): boolean {
    return this.rol === 'admin';
  }

  esCliente(): boolean {
    return this.rol === 'cliente';
  }

  async eliminarEvento(id: string) {
    const confirmar = confirm('¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.');
    if (!confirmar) return;

    const { error } = await this.supabaseService.client
      .from('eventos')
      .delete()
      .eq('id', id);

    if (error) {
      alert('❌ Error al eliminar el evento.');
      console.error(error);
      return;
    }

    this.eventos = this.eventos.filter(e => e.id !== id);
    this.todosLosEventos = this.todosLosEventos.filter(e => e.id !== id);
    alert('✅ Evento eliminado correctamente.');
  }

  filtrarEventos() {
    this.eventos = this.todosLosEventos.filter(e => {
      const coincideCategoria = this.filtroCategoria
        ? e.categoria?.toLowerCase().includes(this.filtroCategoria.toLowerCase())
        : true;

      const coincideFecha = this.filtroFecha
        ? new Date(e.fecha) >= new Date(this.filtroFecha)
        : true;

      return coincideCategoria && coincideFecha;
    });
  }

  limpiarFiltros() {
    this.filtroCategoria = '';
    this.filtroFecha = '';
    this.eventos = [...this.todosLosEventos];
  }
}
export default DashboardComponent;
