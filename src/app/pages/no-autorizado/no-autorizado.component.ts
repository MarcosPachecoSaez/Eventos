import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-no-autorizado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './no-autorizado.component.html',
  styleUrls: ['./no-autorizado.component.css'],
})
export class NoAutorizadoComponent {}

export default NoAutorizadoComponent;
