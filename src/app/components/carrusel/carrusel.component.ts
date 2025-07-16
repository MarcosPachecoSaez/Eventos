import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.css'],
})
export class CarruselComponent implements OnInit, OnDestroy, OnChanges {
  @Input() eventos: any[] = [];
  @Input() cargando = false;
  slides: any[] = [];
  displayIndex = 1;
  transitioning = true;
  centro = 0;
  intervaloCarrusel: any;
  pausado = false;

  ngOnInit() {
    if (this.eventos.length) this.iniciarRotacion();
  }

  ngOnChanges(ch: SimpleChanges) {
    if (ch['eventos'] && this.eventos.length) {
      // Prepara array con clones
      this.slides = [
        this.eventos[this.eventos.length - 1],
        ...this.eventos,
        this.eventos[0],
      ];
      this.displayIndex = 1;
      this.transitioning = false;
      setTimeout(() => (this.transitioning = true), 0);
      this.iniciarRotacion();
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervaloCarrusel);
  }

  iniciarRotacion() {
    clearInterval(this.intervaloCarrusel);
    this.intervaloCarrusel = setInterval(() => {
      if (!this.pausado) {
        this.next();
      }
    }, 4000);
  }

  next() {
    this.displayIndex++;
  }

  prev() {
    this.centro = (this.centro - 1 + this.eventos.length) % this.eventos.length;
  }

  onTransitionEnd() {
    // Si llegamos al clone final
    if (this.displayIndex === this.slides.length - 1) {
      this.transitioning = false; // desactiva transición
      this.displayIndex = 1; // salta al primer slide real
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.transitioning = true; // reactiva transición
        });
      });
    }
  }
}
