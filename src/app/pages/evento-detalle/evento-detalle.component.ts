import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common'; // 👈 incluye *ngIf, date, currency

@Component({
  selector: 'app-evento-detalle',
  standalone: true,
  imports: [CommonModule], // 👈 habilita *ngIf, |date, |currency, etc.
  templateUrl: './evento-detalle.component.html',
  styleUrls: ['./evento-detalle.component.css']
})
export class EventoDetalleComponent implements OnInit {
  evento: any = null;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private supabase: SupabaseService,
    private location: Location
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    const { data, error } = await this.supabase.client
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single();

    if (!error) this.evento = data;
    this.cargando = false;
  }

  volver() {
    this.location.back();
  }
}

export default EventoDetalleComponent;
