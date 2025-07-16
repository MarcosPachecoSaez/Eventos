import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Destacado {
  src: string;
  pinLink: string;
  instagramLink: string;
}

@Component({
  selector: 'app-destacados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './destacados.component.html',
  styleUrls: ['./destacados.component.css'],
})
export class DestacadosComponent implements OnInit {
  images: Destacado[] = [];

  ngOnInit(): void {
    this.images = [
      {
        src: 'assets/lugares/1.jpg',
        pinLink: 'https://maps.app.goo.gl/WK9jzve2PN12EFVb9',
        instagramLink: 'https://www.instagram.com/wooclub_/?hl=es',
      },
      {
        src: 'assets/lugares/4.jpg',
        pinLink: 'https://maps.app.goo.gl/WK9jzve2PN12EFVb9',
        instagramLink: 'https://www.instagram.com/wooclub_/?hl=es',
      },
      {
        src: 'assets/lugares/3.jpg',
        pinLink: 'https://maps.app.goo.gl/AXhcXQzpsSeHTMHq8',
        instagramLink: 'https://www.instagram.com/valparaiso_sporting/?hl=es',
      },
      {
        src: 'assets/lugares/2.jpg',
        pinLink: 'https://maps.app.goo.gl/AXhcXQzpsSeHTMHq8',
        instagramLink: 'https://www.instagram.com/valparaiso_sporting/?hl=es',
      },
    ];
  }
}
