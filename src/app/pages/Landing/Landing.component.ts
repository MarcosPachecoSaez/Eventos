import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './Landing.component.html',
  styleUrl: './Landing.component.css',
  imports: [CommonModule, RouterModule],
})
export class LandingComponent {
  constructor(private router: Router) {}

  irALogin() {
    this.router.navigate(['/login']);
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }
}
