// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAppInitializer, inject } from '@angular/core';
import { SupabaseService } from './app/services/supabase/supabase.service';

async function initializeApp(): Promise<void> {
  const supabase = inject(SupabaseService);
  const session = await supabase.getSession();

  if (session) {
    const { data: usuario, error } = await supabase.client
      .from('usuarios')
      .select('nombre')
      .eq('id', session.user.id)
      .single();

    if (usuario && !error) {
      (supabase as any).nombreUsuario = usuario.nombre;
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(initializeApp),
    SupabaseService,
  ],
}).catch((err) => console.error(err));
