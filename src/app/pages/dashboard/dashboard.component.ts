// src/app/pages/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  usuario: string | null = null;
  rol: 'admin' | 'cliente' | null = null;
  cargando = false;
  showTooltip = false;

  eventos: any[] = [];
  todosLosEventos: any[] = [];
  filtroCategoria: string = '';
  filtroFecha: string = '';

  mensaje: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    const user = await this.supabaseService.getUser();
    this.usuario = user?.email ?? 'Usuario';

    // Obtener el perfil del usuario y solo asignar el rol
    const perfil = await this.supabaseService.getPerfilUsuario(user.id);
    this.rol = perfil?.rol ?? null; // Asignar solo el rol

    if (this.esAdmin() || this.esCliente()) {
      this.todosLosEventos = await this.supabaseService.getEventos();
      this.eventos = [...this.todosLosEventos];
    }

    this.route.queryParams.subscribe(params => {
      if (params['creado'] === 'true') {
        this.mensaje = '✅ Evento creado correctamente';
      } else if (params['editado'] === 'true') {
        this.mensaje = '✅ Evento actualizado correctamente';
      }

      // Ocultar el mensaje automáticamente después de 5 segundos
      if (this.mensaje) {
        setTimeout(() => this.mensaje = '', 5000);
      }
    });
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

  irAEntradas() {
    this.router.navigate(['/mis-entradas']);
  }

  irAPerfil() {
    this.router.navigate(['/perfil']);
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

  getDisplayName(): string {
    if (!this.usuario) return 'Usuario';
    
    // Si es un email, truncarlo
    if (this.usuario.includes('@')) {
      return this.truncateEmail(this.usuario);
    }
    
    // Si no es email, mostrar como está
    return this.usuario;
  }

  truncateEmail(email: string): string {
    const maxLength = 22;
    
    if (email.length <= maxLength) {
      return email;
    }
    
    const [localPart, domain] = email.split('@');
    const availableLength = maxLength - domain.length - 4; // 4 para "...@"
    
    if (availableLength > 0) {
      return `${localPart.substring(0, availableLength)}...@${domain}`;
    } else {
      // Si el dominio es muy largo, truncar todo
      return `${email.substring(0, maxLength - 3)}...`;
    }
  }

  toggleTooltip(): void {
    this.showTooltip = !this.showTooltip;
    
    // Auto-hide después de 3 segundos
    if (this.showTooltip) {
      setTimeout(() => {
        this.showTooltip = false;
      }, 3000);
    }
  }
}

export default DashboardComponent;
