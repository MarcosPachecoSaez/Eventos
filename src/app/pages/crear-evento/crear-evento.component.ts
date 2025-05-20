import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { NavbarComponent } from 'app/components/navbar/navbar.component';

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css']
})
export class CrearEventoComponent implements OnInit {
  formulario!: FormGroup;
  creando = false;
  mensaje = '';

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required],
      lugar: ['', Validators.required],
      categoria: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      imagen_url: ['', Validators.required],
      aforo: [100, [Validators.required, Validators.min(1)]] // valor por defecto aquí también

    });
  }

  async crearEvento() {
    if (this.formulario.invalid) {
      this.mensaje = '❌ Todos los campos son obligatorios.';
      return;
    }

    this.creando = true;
    this.mensaje = '';

    try {
      const session = await this.supabaseService.getSession();
      if (!session) {
        this.mensaje = '❌ Debes iniciar sesión.';
        this.creando = false;
        return;
      }

      const userId = session.user.id;

      const { error } = await this.supabaseService.client
        .from('eventos')
        .insert({
          ...this.formulario.value,
        });

      if (error) {
        throw error;
      }

      this.mensaje = '✅ Evento creado exitosamente';
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error al crear evento:', error);
      this.mensaje = '❌ Error al crear el evento.';
    } finally {
      this.creando = false;
    }
  }
}

export default CrearEventoComponent;
