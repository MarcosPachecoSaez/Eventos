import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from 'app/components/navbar/navbar.component'; // ✅ Importar el navbar

@Component({
  selector: 'app-evento-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent // ✅ Agregar aquí
  ],
  templateUrl: './evento-detalle.component.html',
  styleUrls: ['./evento-detalle.component.css']
})
export class EventoDetalleComponent implements OnInit {
  evento: any = null;
  cargando = true;
  estaAutenticado = false;
  rol: 'admin' | 'cliente' | null = null;

  constructor(
    private route: ActivatedRoute,
    private supabase: SupabaseService,
    private location: Location
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    const { data, error } = await this.supabase.client
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single();

    if (!error) this.evento = data;
    this.cargando = false;

    const session = await this.supabase.getSession();
    this.estaAutenticado = !!session;

    if (session) {
      const perfil = await this.supabase.getPerfilUsuario(session.user.id);
      this.rol = perfil?.rol || null;
    }
  }

  volver() {
    this.location.back();
  }
}

export default EventoDetalleComponent;
