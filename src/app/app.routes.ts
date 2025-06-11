import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { ClienteGuard } from './guards/cliente.guard';
import { MultiRoleGuard } from './guards/multi-role.guard';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.default) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.default) },
  { path: 'registro', loadComponent: () => import('./pages/registro/registro.component').then(m => m.default) },

  // ADMIN CRUD
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'crear-evento',
    loadComponent: () => import('./pages/crear-evento/crear-evento.component').then(m => m.CrearEventoComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'editar-evento/:id',
    loadComponent: () => import('./pages/editar-evento/editar-evento.component').then(m => m.default),
    canActivate: [adminGuard]
  },

  // CLIENTE
  {
    path: 'eventos',
    loadComponent: () => import('./pages/eventos/eventos.component').then(m => m.EventosComponent)
,
    canActivate: [ClienteGuard]
  },
  {
    path: 'compra/:id',
    loadComponent: () => import('./pages/compra/compra.component').then(m => m.CompraComponent),
    canActivate: [ClienteGuard]
  },

  // USUARIO LOGUEADO
  {
    path: 'mis-entradas',
    loadComponent: () => import('./pages/mis-entradas/mis-entradas.component').then(m => m.MisEntradasComponent),
    canActivate: [AuthGuard]
  },

  // ADMIN o CLIENTE
  {
    path: 'evento/:id',
    loadComponent: () => import('./pages/evento-detalle/evento-detalle.component').then(m => m.default),
    canActivate: [MultiRoleGuard]
  },

  { path: 'no-autorizado', loadComponent: () => import('./pages/no-autorizado/no-autorizado.component').then(m => m.default) },

    {
  path: 'recuperar',
  loadComponent: () =>
    import('./auth/recuperar.component').then(m => m.RecuperarComponent)
  },
  {
  path: 'cambiar-contrasena',
  loadComponent: () =>
    import('./auth/cambiar.component').then(m => m.CambiarComponent)
},
{
  path: 'perfil',
  loadComponent: () => import('./pages/perfil-usuario/perfil.component').then(m => m.PerfilComponent),
  canActivate: [AuthGuard]
},
  { path: '**', redirectTo: '' },




  
];
