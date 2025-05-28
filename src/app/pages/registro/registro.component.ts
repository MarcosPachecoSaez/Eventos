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
  imports: [CommonModule, FormsModule],
})
export class RegistroComponent {
  public errores = {
    nombre: false,
    email: false,
    contrasena: false,
    edad: false,
  };

  // Modelo de datos enlazado al formulario
  public formData = {
    nombre: '',
    email: '',
    contrasena: '',
    edad: '',
  };

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async registrar(form: NgForm) {
    // Resetear errores
    this.errores = {
      nombre: false,
      email: false,
      contrasena: false,
      edad: false,
    };

    const { nombre, email, contrasena, edad } = this.formData;

    const nombreLimpio = typeof nombre === 'string' ? nombre.trim() : '';
    const emailLimpio = typeof email === 'string' ? email.trim() : '';
    const contrasenaValida =
      typeof contrasena === 'string' && contrasena.length > 0;
    const edadNumerica = parseInt(edad, 10);

    const nombreValido = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s-]{2,}$/.test(nombreLimpio);
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio);
    const edadValida = !isNaN(edadNumerica) && edadNumerica >= 1;

    // Marcar errores si hay
    if (!nombreValido) this.errores.nombre = true;
    if (!emailValido) this.errores.email = true;
    if (!contrasenaValida) this.errores.contrasena = true;
    if (!edadValida) this.errores.edad = true;

    if (Object.values(this.errores).some((e) => e)) return;

    // Todo válido, seguir con registro
    try {
      const { data, error } = await this.supabaseService.registrarUsuario(
        emailLimpio,
        contrasena
      );

      if (error || !data.user) {
        throw new Error(error?.message || 'Error al registrar usuario');
      }

      const usuarioConvertido = {
        id: data.user.id,
        nombre: nombreLimpio,
        correo: emailLimpio,
        rol: 'cliente',
        edad: edadNumerica,
      };

      await this.supabaseService.insertarPerfilUsuario(usuarioConvertido);
      console.log('✅ Usuario registrado con éxito');
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('❌ Error al registrar usuario:', error.message || error);
    }
  }
}
