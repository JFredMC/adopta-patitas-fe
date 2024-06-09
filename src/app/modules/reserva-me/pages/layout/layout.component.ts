import { HeaderComponent } from './../header/header.component';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './../dashboard/dashboard.component';
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReservationsComponent } from '../reservations/reservations.component';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MatSidenavModule, MatToolbarModule, MatIcon, CommonModule, ReservationsComponent, DashboardComponent, SidebarComponent, HeaderComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  isOpened = true;

  toggleSidebar(): void {
    this.isOpened = !this.isOpened;
  }

}
