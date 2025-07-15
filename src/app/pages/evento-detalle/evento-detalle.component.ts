import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from 'app/components/navbar/navbar.component';
import { FooterComponent } from 'app/components/footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evento-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './evento-detalle.component.html',
  styleUrls: ['./evento-detalle.component.css'],
})
export class EventoDetalleComponent implements OnInit {
  evento: any = null;
  navegando = false;
  cargando = true;
  estaAutenticado = false;
  rol: 'admin' | 'cliente' | null = null;

  tarifas: Array<{
    nombre: string;
    precio: number;
    cargo: number;
    total: number;
  }> = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private supabase: SupabaseService,
    private location: Location
  ) {}

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) return;

    const todos = await this.supabase.getEventos();
    this.evento = todos.find((e) => this.slugify(e.nombre) === slug) || null;
    this.cargando = false;

    if (this.evento) {
      const base = this.evento.precio;

      const factores = [
        { nombre: 'Preventa Fans', factor: 1 },
        { nombre: 'Preventa 1', factor: 12 / 9 },
        { nombre: 'Preventa 2', factor: 15 / 9 },
        { nombre: 'General', factor: 17 / 9 },
      ];

      this.tarifas = factores.map((f) => {
        const precio = base * f.factor;
        const cargo = precio * 0.15;
        const total = precio + cargo;
        return {
          nombre: f.nombre,
          precio,
          cargo,
          total,
        };
      });
    }

    const session = await this.supabase.getSession();
    this.estaAutenticado = !!session;
    if (session) {
      const perfil = await this.supabase.getPerfilUsuario(session.user.id);
      this.rol = perfil?.rol || null;
    }
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  volver() {
    this.location.back();
  }

  comprar() {
    this.navegando = true;
    this.router.navigate(['/compra', this.evento.id]).catch((err) => {
      console.error('Error navegando:', err);
      this.navegando = false;
    });
  }
}
