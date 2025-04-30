// src/app/pages/dashboard/dashboard.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule]
})
export class DashboardComponent {
  usuario: string = 'Usuario';
  cargando: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    const user = await this.supabaseService.getUser();
    this.usuario = user?.email || 'Usuario';
  }

  async cerrarSesion() {
    try {
      this.cargando = true;
      await this.supabaseService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      this.cargando = false;
    }
  }

  irABuscarEventos() {
    this.router.navigate(['/eventos']);
  }

  irACrearEvento() {
    this.router.navigate(['/crear-evento']);
  }
}
