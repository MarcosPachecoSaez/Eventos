import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase/supabase.service';

export const clienteGuard: CanActivateFn = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  const session = await supabaseService.getSession();
  if (!session) {
    router.navigate(['/login']);
    return false;
  }

  const { data: usuario, error } = await supabaseService.client
    .from('usuarios')
    .select('rol')
    .eq('id', session.user.id)
    .single();

  if (error || usuario?.rol !== 'cliente') {
    router.navigate(['/no-autorizado']);
    return false;
  }

  return true;
};
