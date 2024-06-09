import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { SweetAlertService } from '../../../../shared/utils/services/sweet-alert.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

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

}
