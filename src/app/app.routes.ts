import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { clienteGuard } from './guards/cliente.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.default)
  },
  {
    path: 'home',
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
      import('./pages/dashboard/dashboard.component').then(m => m.default)
  },
  {
    path: 'crear-evento',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/crear-evento/crear-evento.component').then(m => m.default)
  },
  {
    path: 'editar-evento/:id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/editar-evento/editar-evento.component').then(m => m.default)
  },
  {
    path: 'eventos',
    canActivate: [clienteGuard],
    loadComponent: () =>
      import('./pages/eventos/eventos.component').then(m => m.default)
  },
  {
    path: 'evento/:id',
    loadComponent: () =>
      import('./pages/evento-detalle/evento-detalle.component').then(m => m.default)
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
