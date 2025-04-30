import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { SupabaseService } from '../services/supabase/supabase.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  const usuario = await supabaseService.getUser();
  if (usuario) {
    console.log('✅ Usuario autenticado');
    return true; // Permite acceso
  } else {
    console.log('❌ Usuario no autenticado, redirigiendo a login');
    router.navigate(['/login']);
    return false; // Bloquea acceso
  }
};
