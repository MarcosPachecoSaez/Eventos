// src/app/pages/editar-evento/editar-evento.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase/supabase.service'; // Asegúrate que esta ruta esté correcta
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // <-- Agregamos ReactiveFormsModule aquí
  templateUrl: './editar-evento.component.html',
  styleUrls: ['./editar-evento.component.css'],
})
export class EditarEventoComponent implements OnInit {
  eventoForm!: FormGroup;
  eventoId: string = '';
  evento: any = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private supabaseService: SupabaseService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.eventoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required],
      lugar: ['', Validators.required],
      categoria: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      imagen_url: ['', Validators.required],
    });

    // Obtener ID del evento desde la URL
    this.eventoId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.cargarEvento();
  }

  async cargarEvento() {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('eventos')
        .select('*')
        .eq('id', this.eventoId)
        .single();

      if (error) {
        console.error('Error al cargar evento:', error.message);
        return;
      }

      this.evento = data;
      this.eventoForm.patchValue(this.evento); // Carga los valores en el formulario
    } catch (error) {
      console.error('Error desconocido al cargar evento:', error);
    }
  }

  async actualizarEvento() {
    if (this.eventoForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    const { nombre, descripcion, fecha, lugar, categoria, precio, imagen_url } = this.eventoForm.value;

    const { error } = await this.supabaseService.getClient()
      .from('eventos')
      .update({ nombre, descripcion, fecha, lugar, categoria, precio, imagen_url })
      .eq('id', this.eventoId);

    if (error) {
      console.error('Error al actualizar evento:', error.message);
      alert('Error al actualizar el evento.');
      return;
    }

    alert('Evento actualizado con éxito');
    this.router.navigate(['/eventos']); // Redirige al listado de eventos
  }
}
