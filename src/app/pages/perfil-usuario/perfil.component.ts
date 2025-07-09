import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { NavbarComponent } from 'app/components/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  userId: string = '';
  nombre: string = '';
  correo: string = '';
  edad: number | null = null;
  rol: string = '';
  nuevoNombre: string = '';
  nuevaEdad: number | null = null;
  modoEdicion: boolean = false;
  showTooltip = false;

  entradas: any[] = [];

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit(): Promise<void> {
    const user = await this.supabaseService.getUser();
    if (!user) return;

    this.userId = user.id;

    const perfil = await this.supabaseService.getPerfilUsuario(this.userId);
    if (perfil) {
      this.nombre = perfil.nombre;
      this.nuevoNombre = perfil.nombre;
      this.correo = perfil.correo;
      this.rol = perfil.rol;
      this.edad = perfil.edad ?? null;
      this.nuevaEdad = perfil.edad ?? null;
    }

    this.entradas = await this.supabaseService.getMisTickets();
  }

  async guardarCambios(): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('usuarios')
      .update({
        nombre: this.nuevoNombre,
        edad: this.nuevaEdad,
      })
      .eq('id', this.userId);

    if (error) {
      alert('❌ No se pudo guardar los cambios.');
      console.error(error);
    } else {
      alert('✅ Datos actualizados.');
      this.nombre = this.nuevoNombre; //  esto asegura que se actualice lo mostrado
      this.edad = this.nuevaEdad;
      this.modoEdicion = false; //  ocultamos el campo editable después de guardar
    }
  }

  getDisplayName(): string {
    if (!this.nombre) return '';

    const maxLength = 10;
    if (this.nombre.length <= maxLength) {
      return this.nombre;
    }

    return `${this.nombre.substring(0, maxLength - 3)}...`;
  }

  getDisplayEmail(): string {
    if (!this.correo) return '';

    return this.truncateEmail(this.correo);
  }

  truncateEmail(email: string): string {
    const maxLength = 22;

    if (email.length <= maxLength) {
      return email;
    }

    const [localPart, domain] = email.split('@');
    const availableLength = maxLength - domain.length - 4;

    if (availableLength > 0) {
      return `${localPart.substring(0, availableLength)}...@${domain}`;
    } else {
      return `${email.substring(0, maxLength - 3)}...`;
    }
  }

  toggleTooltip(): void {
    this.showTooltip = !this.showTooltip;

    if (this.showTooltip) {
      setTimeout(() => {
        this.showTooltip = false;
      }, 3000);
    }
  }
}
