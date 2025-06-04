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
    edad: null,
    rol: 'cliente'
  };

  correoExistente = false;
  registroExitoso = false;
  campoActivo: string | null = null;

  constructor(private supabaseService: SupabaseService, private router: Router) {}

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

    if (!this.contrasenaValida(this.usuario.contrasena)) {
      alert('❌ La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.');
      return;
    }

    // Verifica correo duplicado en la tabla "usuarios"
    const { existe } = await this.supabaseService.verificarCorreoExistente(this.usuario.email);
    if (existe) {
      this.correoExistente = true;
      return;
    }

    try {
      const { data, error } = await this.supabaseService.registrarUsuario(
        this.usuario.email,
        this.usuario.contrasena,
        this.usuario.nombre
      );

      if (error || !data.user) throw new Error(error?.message || 'Error al registrar');

      this.registroExitoso = true;
      console.log('✅ Usuario registrado. Esperando confirmación.');
    } catch (error) {
      console.error('❌ Error al registrar:', error);
      alert('Error al registrar usuario.');
    }
  }
}

export default RegistroComponent;
