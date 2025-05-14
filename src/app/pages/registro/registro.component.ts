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
    edad: '',
    rol: 'cliente' // 👈 valor fijo por ahora
  };

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async registrar(form: NgForm) {
    if (form.invalid) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    try {
      const { data, error } = await this.supabaseService.registrarUsuario(
        this.usuario.email,
        this.usuario.contrasena
      );
      
      if (error || !data.user) {
        throw new Error(error?.message || 'Error al registrar usuario');
      }
      
      
      const usuarioConvertido = {
        id: data.user.id,
        nombre: this.usuario.nombre,
        correo: this.usuario.email,
        rol: 'cliente',
        edad: Number(this.usuario.edad) // 👈 solo si la tabla lo permite
      };
      
      

      await this.supabaseService.insertarPerfilUsuario(usuarioConvertido);
      console.log('✅ Usuario registrado con éxito');

      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('❌ Error al registrar usuario:', error.message || error);
      alert('Error al registrar usuario. Revisa los datos e intenta nuevamente.');
    }
  }
}
export default RegistroComponent;
