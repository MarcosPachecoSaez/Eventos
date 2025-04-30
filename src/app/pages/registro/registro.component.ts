// registro.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RegistroComponent {
  usuario = {
    nombre: '',
    email: '',
    contrasena: '',
    edad: ''
  };

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async registrar(form: NgForm) {
    if (form.invalid) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    try {
      // Crear usuario en Supabase Auth
      const result = await this.supabaseService.registrarUsuario(
        this.usuario.email,
        this.usuario.contrasena
      );
      
      if (!result.user) {
        throw new Error('Error al registrar usuario');
      }
      
      // Insertar los datos del usuario en la tabla 'usuario'
      const usuarioConvertido = {
        nombre: this.usuario.nombre,
        email: this.usuario.email,
        edad: Number(this.usuario.edad)
      };

      const insertResult = await this.supabaseService.insertarUsuario(usuarioConvertido);
      console.log('✅ Usuario registrado con éxito:', insertResult);

      // Redirigir al login
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('❌ Error al registrar usuario:', error.message || error);
      alert('Error al registrar usuario. Revisa los datos e intenta nuevamente.');
    }
  }
}
