import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { SweetAlertService } from '../../../../shared/utils/services/sweet-alert.service';
import { User } from '../../../auth/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  public currentUser?: User = this.authService.currentUser;
  isAdmin: boolean = this.currentUser?.role.identifier === 'admin'
  isOpened = true;

  constructor(
    private authService: AuthService,
    private sweetAlertService: SweetAlertService,
  ) {}

  async logout(): Promise<void> {
    const confirm = await this.sweetAlertService.confirm('question', '¿Estas seguro de cerrar la sesión?', `La sesión se cerrara`);
    if (confirm) {
      this.authService.logout();
    }
    
  }

  toggleSidebar() {
    this.isOpened = !this.isOpened;
  }

}
