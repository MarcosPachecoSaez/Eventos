import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-mis-entradas',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './mis-entradas.component.html',
  styleUrls: ['./mis-entradas.component.css']
})
export class MisEntradasComponent implements OnInit {
  tickets: any[] = [];
  mostrarExito: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.tickets = await this.supabaseService.getMisTickets();

    this.route.queryParams.subscribe(params => {
      this.mostrarExito = params['exito'] === 'true';
    });
  }

  generarPDF(ticket: any) {
    const doc = new jsPDF();
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${ticket.codigo_qr}&size=150x150`;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = qrUrl;

    img.onload = () => {
      // Fondo claro
      doc.setFillColor(240, 248, 255);
      doc.rect(0, 0, 210, 297, 'F'); // fondo A4

      doc.setFontSize(22);
      doc.setTextColor(33, 37, 41);
      doc.text('🎫 Entrada eVentos', 70, 20);

      doc.setFontSize(14);
      let y = 40;
      doc.text(`🎵 Evento: ${ticket.eventos.nombre}`, 20, y); y += 10;
      doc.text(`📍 Lugar: ${ticket.eventos.lugar}`, 20, y); y += 10;
      doc.text(`📅 Fecha: ${new Date(ticket.eventos.fecha).toLocaleDateString()}`, 20, y); y += 10;
      doc.text(`🎫 Cantidad: ${ticket.cantidad}`, 20, y); y += 10;
      doc.text(`🕒 Comprado el: ${new Date(ticket.created_at).toLocaleString()}`, 20, y); y += 10;
      doc.text(`🔐 Código: ${ticket.codigo_qr}`, 20, y); y += 10;

      // QR
      doc.addImage(img, 'PNG', 150, 40, 40, 40);

      // Descargar PDF
      doc.save(`entrada-${ticket.eventos.nombre}.pdf`);
    };

    img.onerror = () => {
      alert('❌ Error al generar el código QR');
    };
  }
}
