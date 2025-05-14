import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { SupabaseService } from '../services/supabase/supabase.service';
import { Router } from '@angular/router';

export const clienteGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  const user = await supabase.getUser();
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const rol = await supabase.getRolUsuario(user.id);
  if (rol === 'cliente') {
    return true;
  }

  router.navigate(['/no-autorizado']);
  return false;
};
