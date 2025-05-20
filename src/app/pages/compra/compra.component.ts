import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {
  evento: any;
  cantidad = 1;
  codigoQr: string | null = null;
  comprando = false;
  mensaje = '';

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.evento = await this.supabaseService.getEventoById(id);
  }

  async comprar() {
    this.comprando = true;
    this.mensaje = '';

    try {
      const qr = await this.supabaseService.comprarEntradas(this.evento.id, this.cantidad);
      if (qr) {
        this.codigoQr = qr;
        this.mensaje = '✅ Compra realizada correctamente. Redirigiendo...';
        setTimeout(() => {
          this.router.navigate(['/mis-entradas'], { queryParams: { exito: 'true' } });
        }, 3000); // espera 3 segundos para que vea el QR
      } else {
        this.mensaje = '❌ Hubo un problema al procesar la compra.';
      }
    } catch (error) {
      this.mensaje = '❌ Error al realizar la compra.';
    } finally {
      this.comprando = false;
    }
  }
}
