import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css']
})
export class CrearEventoComponent implements OnInit {
  creando = false;
  mensaje = '';
  formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required],
      lugar: ['', Validators.required],
      categoria: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      imagen_url: ['']
    });
  }

  async crearEvento() {
    if (this.formulario.invalid) return;

    this.creando = true;
    const user = await this.supabase.getUser();

    const nuevoEvento = {
      ...this.formulario.value,
      creado_por: user?.id ?? null
    };

    try {
      const { error } = await this.supabase.client
        .from('eventos')
        .insert([nuevoEvento]);

      if (error) throw error;

      this.mensaje = '✅ Evento creado correctamente';
      this.formulario.reset();
      this.router.navigate(['/dashboard']);
    } catch (err) {
      this.mensaje = '❌ Error al crear el evento';
      console.error(err);
    } finally {
      this.creando = false;
    }
  }
}

export default CrearEventoComponent;
