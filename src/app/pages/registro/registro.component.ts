import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class RegistroComponent {
  public errores = {
    nombre: false,
    email: false,
    contrasena: false,
    edad: false,
  };

  public formData = {
    nombre: '',
    email: '',
    contrasena: '',
    edad: null as number | null,
    rol: 'cliente',
  };

  correoExistente = false;
  registroExitoso = false;
  campoActivo: string | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  setCampoActivo(nombre: string) {
    this.campoActivo = nombre;
  }

  limpiarCampoActivo() {
    this.campoActivo = null;
  }

  contrasenaValida(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  }

  async registrar(form: NgForm) {
    console.clear();
    if (form.invalid) return;

    // Validar contraseña fuerte
    if (!this.contrasenaValida(this.formData.contrasena)) {
      alert(
        '❌ La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.'
      );
      return;
    }

    // Verificar correo existente
    const { existe, error: verificarCorreoError } = await this.supabaseService.verificarCorreoExistente(
      this.formData.email
    );
    if (existe) {
      this.correoExistente = true;
      return;
    }

    if (Object.values(this.errores).some((e) => e)) return;

    try {
      // Paso 1: Registrar el usuario en Supabase
      const { data, error } = await this.supabaseService.registrarUsuario(
        this.formData.email,
        this.formData.contrasena,
        this.formData.nombre
      );

      if (error || !data.user)
        throw new Error(error?.message || 'Error al registrar');

      // Paso 2: Obtener el ID del usuario y registrar el perfil
      const usuarioId = data.user.id; // Obtenemos el ID del usuario registrado

      const perfilData = {
        id: usuarioId,  // El ID del usuario registrado
        nombre: this.formData.nombre,
        correo: this.formData.email,
        rol: 'cliente',  // Asignamos 'cliente' por defecto
        edad: this.formData.edad ?? undefined,  // Cambié null por undefined
      };

      // Insertamos el perfil en la tabla `usuarios`
      try {
        const { data, error: perfilError } = await this.supabaseService.insertarPerfilUsuario(
          perfilData
        );

        // Corregimos el tipo de perfilError y manejamos el error
        if (perfilError) {
          // Aseguramos que `perfilError` sea tratado correctamente como `Error`
          throw new Error((perfilError as any)?.message || 'Error al insertar perfil');
        }

        console.log('✅ Perfil creado correctamente:', data);
      } catch (error: any) {
        // Aquí manejamos el error correctamente y aseguramos que `error` sea de tipo `Error`
        console.error('❌ Error al insertar perfil:', error);
        throw new Error(error instanceof Error ? error.message : 'Error desconocido');
      }

      // Si todo salió bien, cambiamos el estado de registroExitoso
      this.registroExitoso = true;
      console.log('✅ Usuario registrado y perfil creado correctamente.');
      this.router.navigate(['/home']);  // Redirige a la página de inicio

    } catch (error: any) {
      console.error('❌ Error al registrar:', error);
      alert('Error al registrar usuario.');
    }
  }
}

export default RegistroComponent;
