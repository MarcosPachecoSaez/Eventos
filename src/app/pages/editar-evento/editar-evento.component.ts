import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-evento.component.html',
  styleUrls: ['./editar-evento.component.css']
})
export class EditarEventoComponent implements OnInit {
  eventoId: string = '';
  cargando = true;
  mensaje = '';
  formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supabase: SupabaseService
  ) {}

  async ngOnInit() {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required],
      lugar: ['', Validators.required],
      categoria: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      imagen_url: ['']
    });

    this.eventoId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.eventoId) {
      this.mensaje = '❌ ID inválido';
      this.cargando = false;
      return;
    }

    const { data, error } = await this.supabase.client
      .from('eventos')
      .select('*')
      .eq('id', this.eventoId)
      .single();

    if (error || !data) {
      this.mensaje = '❌ Error al cargar evento';
      this.cargando = false;
      return;
    }

    this.formulario.patchValue(data);
    this.cargando = false;
  }

  async actualizarEvento() {
    if (this.formulario.invalid) return;

    const { error } = await this.supabase.client
      .from('eventos')
      .update(this.formulario.value)
      .eq('id', this.eventoId);

    if (error) {
      this.mensaje = '❌ Error al actualizar evento';
      console.error(error);
    } else {
      this.mensaje = '✅ Evento actualizado';
      this.router.navigate(['/dashboard']);
    }
  }
}
export default EditarEventoComponent ;
