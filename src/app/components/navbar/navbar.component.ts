import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase/supabase.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  estaAutenticado: boolean = false;
  nombreUsuario: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    const session = await this.supabaseService.getSession();
    this.estaAutenticado = !!session;

    if (session) {
      const userId = session.user.id;

      const { data: usuario, error } = await this.supabaseService.client
        .from('usuarios')
        .select('nombre')
        .eq('id', userId)
        .single();

      if (!error && usuario) {
        this.nombreUsuario = usuario.nombre;
      }
    }
  }

  async cerrarSesion() {
    await this.supabaseService.client.auth.signOut();
    this.estaAutenticado = false;
    this.nombreUsuario = '';
    this.router.navigate(['/']);
  }

  irAInicio(): void {
    this.router.navigate(['/']);
  }
}
