import { Routes } from '@angular/router';
import { adminGuard as AdminGuard } from './guards/admin.guard';
import { clienteGuard as ClienteGuard } from './guards/cliente.guard';
import { multiRoleGuard as MultiRoleGuard } from './guards/multi-role.guard';
import { authGuard as AuthGuard } from './auth/auth.guard'; // 👈 corregido aquí

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.default)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.default)
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro.component').then(m => m.default)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'crear-evento',
    loadComponent: () =>
      import('./pages/crear-evento/crear-evento.component').then(m => m.CrearEventoComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'editar-evento/:id',
    loadComponent: () =>
      import('./pages/editar-evento/editar-evento.component').then(m => m.default),
    canActivate: [AdminGuard]
  },
  {
    path: 'eventos',
    loadComponent: () =>
      import('./pages/eventos/eventos.component').then(m => m.default),
    canActivate: [ClienteGuard]
  },
  {
    path: 'evento/:id',
    loadComponent: () =>
      import('./pages/evento-detalle/evento-detalle.component').then(m => m.default),
    canActivate: [MultiRoleGuard]
  },
  {
    path: 'no-autorizado',
    loadComponent: () =>
      import('./pages/no-autorizado/no-autorizado.component').then(m => m.default)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
