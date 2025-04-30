import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component'; 
import { RegistroComponent } from './pages/registro/registro.component'; 
import { DashboardComponent } from './pages/dashboard/dashboard.component'; 
import { authGuard } from './auth/auth.guard'; 

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirección inicial al login
  { path: 'login', component: LoginComponent },         // Página de login
  { path: 'registro', component: RegistroComponent },   // Página de registro
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard]                            // Protege la ruta con el guard
  },
  
  {  path: 'recuperar-contrasena',
    loadComponent: () => import('./auth/recuperar.component').then(m => m.RecuperarComponent)
  },
  {
    path: 'cambiar-contrasena',
    loadComponent: () => import('./auth/cambiar.component').then(m => m.CambiarComponent)
  }
  
];
