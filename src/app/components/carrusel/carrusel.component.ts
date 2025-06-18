// carrusel.component.ts
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

  centro = 0;
  intervaloCarrusel: any;
  pausado = false;

  ngOnInit() {
    if (this.eventos.length) this.iniciarRotacion();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['eventos'] && this.eventos.length) {
      this.centro = 0;
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
    this.centro = (this.centro + 1) % this.eventos.length;
  }

  prev() {
    this.centro = (this.centro - 1 + this.eventos.length) % this.eventos.length;
  }
}
