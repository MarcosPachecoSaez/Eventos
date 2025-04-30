import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase/supabase.service';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RecuperarComponent {
  email: string = '';

  constructor(private supabaseService: SupabaseService) {}

  async enviarRecuperacion() {
    try {
      await this.supabaseService.recuperarContrasena(this.email);
      alert('Se envió un correo para recuperar la contraseña');
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  }
}
