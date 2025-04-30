import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { RegistroComponent } from './app/pages/registro/registro.component';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { authGuard } from './app/auth/auth.guard';
import { EventosComponent } from './app/pages/eventos/eventos.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./app/pages/login/login.component').then(m => m.LoginComponent)
  },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'recuperar',
    loadComponent: () => import('./app/auth/recuperar.component').then(m => m.RecuperarComponent)
  },
  {
    path: 'cambiar-contrasena',
    loadComponent: () => import('./app/auth/cambiar.component').then(m => m.CambiarComponent)
  },
  {
    path: 'eventos',
    loadComponent: () => import('./app/pages/eventos/eventos.component').then(m => m.EventosComponent)
  },
  {
    path: 'crear-evento',
    loadComponent: () => import('./app/pages/crear-evento/crear-evento.component').then(m => m.CrearEventoComponent)
  },
  {
    path: 'editar-evento/:id',
    loadComponent: () => import('./app/pages/editar-evento/editar-evento.component').then(m => m.EditarEventoComponent)
  },
  
  
  
  
  
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
}).catch((err) => console.error(err));
