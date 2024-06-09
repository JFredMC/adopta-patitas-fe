import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../../auth/interfaces';
import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { IReservation } from '../../interfaces/reserva-me.interface';
import { ReservationsService } from '../../services/reservations.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  public reservations: IReservation[] = [];
  filteredReservations: IReservation[] = [];
  noReservationsFound = true;
  public currentUser?: User = this.authService.currentUser;
  isAdmin: boolean = this.currentUser?.role.identifier === 'admin'

  constructor(
    private authService: AuthService,
    private reservationsService: ReservationsService,
  ) { }

  ngOnInit() {
    console.log('isAdmin: ', this.isAdmin)
    this.getReservations()
  }

  getReservations(): void {
    if(!this.isAdmin) {
      this.reservationsService.getReservationsByUser(this.currentUser!.id)
      .subscribe({
        next: (res) => {
          this.reservations = res;
          this.filteredReservations = [...this.reservations]
          this.noReservationsFound = res.length > 0 ? false : true;
        },
        error: (error) => {
          console.log( error );
        }
      })
    }else {
      this.reservationsService.getReservations()
      .subscribe({
        next: (res) => {
          this.reservations = res;
          this.filteredReservations = [...this.reservations]
          this.noReservationsFound = res.length > 0 ? false : true;
        },
        error: (error) => {
          console.log( error );
        }
      })
    }
    
  }

  createReservations(): void {

  }

  editReservation(id: number): void {

  }

  filterReservations(event: any): void {
    
    const searchTerm = event?.value?.toLowerCase(); // Verificación de nulidad y conversión a minúsculas
    

    if (!searchTerm) {
      this.filteredReservations = [...this.reservations];
    } else {
      this.filteredReservations = this.reservations.filter(reservation =>
        reservation.user.name.toLowerCase().includes(searchTerm) ||
        reservation.event.client.name.toLowerCase().includes(searchTerm) ||
        reservation.event.name.toLowerCase().includes(searchTerm) ||
        reservation.event.location.toLowerCase().includes(searchTerm) ||
        reservation.event.description.toLowerCase().includes(searchTerm)
      );
    }
    
    this.noReservationsFound = this.filteredReservations.length === 0;
  }

}
