import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { NavbarComponent } from 'app/components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  eventos: any[] = [];
  usuario: any = {};
  estaAutenticado: boolean = false;
  rol: 'admin' | 'cliente' | null = null;

  intervalId: any;
  currentSlide: number = 0;

  get transform(): string {
    return `translateX(-${this.currentSlide * 100}%)`;
  }

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const session = await this.supabaseService.getSession();
      this.estaAutenticado = !!session;

      if (session) {
        const userId = session.user.id;

        // 👇 AHORA USANDO TABLA "usuarios"
        const { data: usuario, error } = await this.supabaseService.client
          .from('usuarios')
          .select('nombre, rol')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error al obtener usuario:', error);
          return;
        }

        this.usuario = usuario;
        this.rol = usuario.rol;
      }

      this.eventos = await this.supabaseService.getEventos();
      this.iniciarCarrusel();
    } catch (error) {
      console.error('❌ Error al cargar el home:', error);
    }
  }

  esAdmin(): boolean {
    return this.rol === 'admin';
  }

  irAEditar(id: string): void {
    this.router.navigate(['/editar-evento', id]);
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }

  async eliminarEvento(id: string): Promise<void> {
    const confirmar = confirm('¿Quieres eliminar este evento?');
    if (!confirmar) return;

    try {
      const { error } = await this.supabaseService.client
        .from('eventos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      this.eventos = this.eventos.filter((e) => e.id !== id);
      alert('✅ Evento eliminado.');
    } catch (error) {
      console.error('❌ Error al eliminar evento:', error);
      alert('❌ Error al eliminar evento.');
    }
  }

  iniciarCarrusel(): void {
    this.detenerCarrusel();
    this.intervalId = setInterval(() => {
      this.siguienteSlide();
    }, 4000);
  }

  detenerCarrusel(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  pausarCarrusel(): void {
    this.detenerCarrusel();
  }

  reanudarCarrusel(): void {
    this.iniciarCarrusel();
  }

  siguienteSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.eventos.length;
  }

  anteriorSlide(): void {
    this.currentSlide =
      this.currentSlide === 0 ? this.eventos.length - 1 : this.currentSlide - 1;
  }
}

export default HomeComponent;
