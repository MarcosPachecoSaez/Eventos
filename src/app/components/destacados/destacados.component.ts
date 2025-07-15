import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-destacados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './destacados.component.html',
  styleUrls: ['./destacados.component.css'],
})
export class DestacadosComponent implements OnInit {
  images: string[] = [];

  ngOnInit(): void {
    this.images = [
      'assets/lugares/1.jpg',
      'assets/lugares/2.jpg',
      'assets/lugares/3.jpg',
      'assets/lugares/4.jpg',
    ];
  }
}
