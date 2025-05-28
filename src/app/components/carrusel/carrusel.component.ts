import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.css'],
})
export class CarruselComponent implements OnInit, OnDestroy {
  @Input() eventos: any[] = [];
  @Input() cargando: boolean = false;

  eventoSeleccionado: any = null;
  mostrarModal: boolean = false;
  centro = 0;
  intervaloCarrusel: any;
  pausado = false;

  ngOnInit(): void {
    if (this.eventos.length > 0) this.iniciarRotacion();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervaloCarrusel);
  }

  iniciarRotacion() {
    this.intervaloCarrusel = setInterval(() => {
      if (!this.pausado) {
        this.centro = (this.centro + 1) % this.eventos.length;
      }
    }, 4000);
  }

  obtenerClase(index: number): string {
    const total = this.eventos.length;
    const relativeIndex = (index - this.centro + total) % total;
    switch (relativeIndex) {
      case 0:
        return 'evento-centro';
      case 1:
        return 'evento-derecha';
      case 2:
        return 'evento-derecha-far';
      case total - 1:
        return 'evento-izquierda';
      case total - 2:
        return 'evento-izquierda-far';
      default:
        return 'evento-oculto';
    }
  }

  manejarClick(index: number) {
    const total = this.eventos.length;
    const relIndex = (index - this.centro + total) % total;

    if (relIndex === 1 || relIndex === 2) {
      this.centro = (this.centro + 1) % total;
    } else if (relIndex === total - 1 || relIndex === total - 2) {
      this.centro = (this.centro - 1 + total) % total;
    } else if (relIndex === 0) {
      this.abrirModal(this.eventos[index]);
    }
  }

  abrirModal(evento: any) {
    this.eventoSeleccionado = evento;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.eventoSeleccionado = null;
  }

  editarEvento(evento: any) {
    console.warn('Agregar lógica para editar', evento);
  }

  eliminarEvento(id: string) {
    console.warn('Agregar lógica para eliminar', id);
  }
}
