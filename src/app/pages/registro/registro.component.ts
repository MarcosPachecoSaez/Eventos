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
    const { existe } = await this.supabaseService.verificarCorreoExistente(
      this.formData.email
    );
    if (existe) {
      this.correoExistente = true;
      return;
    }

    if (Object.values(this.errores).some((e) => e)) return;

    try {
      const { data, error } = await this.supabaseService.registrarUsuario(
        this.formData.email,
        this.formData.contrasena,
        this.formData.nombre
      );

      if (error || !data.user)
        throw new Error(error?.message || 'Error al registrar');

      this.registroExitoso = true;
      console.log('✅ Usuario registrado. Esperando confirmación.');
    } catch (error) {
      console.error('❌ Error al registrar:', error);
      alert('Error al registrar usuario.');
    }
  }
}
export default RegistroComponent;
