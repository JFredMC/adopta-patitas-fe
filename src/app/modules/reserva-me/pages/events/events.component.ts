import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IAvailableQuantity, IEvent, IReservation } from '../../interfaces/reserva-me.interface';
import { IClient, User } from '../../../auth/interfaces';
import { AuthService } from '../../../auth/services/auth.service';
import { EventsService } from '../../services/events.service';
import { ModalEventsComponent } from '../../components/modal-events/modal-events.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from '../../../../shared/utils/services/sweet-alert.service';
import { ClientsService } from '../../services/clients.service';
import { ModalConfirmReservationComponent } from '../../components/modal-confirm-reservation/modal-confirm-reservation.component';
import { ReservationsService } from '../../services/reservations.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, ModalEventsComponent, ModalConfirmReservationComponent, RouterLink, RouterLinkActive],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  public events: IEvent[] = [];
  public event: IEvent = this.initiatializedEvent()
  public reservation: IReservation = this.initiatializedReservation();
  public clients: IClient[] = [];
  public currentUser?: User = this.authService.currentUser;
  filteredEvents: IEvent[] = [];
  noEventsFound: boolean = true;
  isModalVisible: boolean = false;
  isModalReservationVisible: boolean = false;
  isEditing: boolean = false;
  isReservation: boolean = false;
  isLoadingBtnUpdate: boolean = false;
  userAlreadyReserved: boolean = false;
  isAdmin: boolean = this.currentUser?.role.identifier === 'admin'
 
  public eventForm: FormGroup = this.fb.group({
    clientId:          ['', [Validators.required], []],
    name: ['', [Validators.required], []],
    description:      ['', [Validators.required, Validators.minLength(5)], []],
    location:      ['', [Validators.required, Validators.minLength(5)], []],
    totalGuest:      ['', [Validators.required, Validators.minLength(5)], []],
    availableQuantity:      ['', [Validators.required, Validators.minLength(5)], []],
    date:      ['', [Validators.required], []],
  });

  constructor(
    private authService: AuthService,
    private eventsService: EventsService,
    private reservationsService: ReservationsService,
    private clientsService: ClientsService,
    private sweetAlertService: SweetAlertService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    console.log('isAdmin: ', this.isAdmin)
    this.getEvents()
    this.getClients()
    this.clearForm()
  }

  getEvents(): void {
    if (!this.isAdmin) {
      // Primero obtenemos todos los eventos
      this.eventsService.getEvents().subscribe({
        next: (events) => {
          this.events = events;
          this.filteredEvents = [...this.events];
          this.noEventsFound = events.length === 0;
  
          // Luego obtenemos todas las reservas del usuario actual
          this.reservationsService.getReservationsByUser(this.currentUser!.id).subscribe({
            next: (reserves) => {
              // Creamos un set con los ids de los eventos reservados por el usuario
              const reservedEventIds = new Set(reserves.map(reserve => reserve.eventId));
  
              // Marcamos los eventos que ya han sido reservados por el usuario
              for (const event of this.events) {
                if (reservedEventIds.has(event.id)) {
                  event.userAlreadyReserve = true;
                }
              }
            },
            error: (error) => {
              console.log(error);
            }
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
    } else {
      // Para los admins, solo obtenemos los eventos
      this.eventsService.getEvents().subscribe({
        next: (res) => {
          console.log('events: ', res);
          this.events = res;
          this.filteredEvents = [...this.events];
          this.noEventsFound = res.length === 0;
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }
  

  getClients(): void {
    this.clientsService.getClients()
      .subscribe({
        next: (res) => {
          this.clients = res
        },
        error: (error) => {
          console.log( error );
        }
      })
  }

  saveEvent(eventData: IEvent) {
    eventData.clientId = Number(eventData.clientId);
    if (this.isEditing) {
      this.eventsService.updateEvent(eventData.id, eventData).subscribe({
        next: (res) => {
          this.closeModal();
          this.sweetAlertService.alert('success', 'Actualizar', 'Evento actualizado exitosamente!');
          this.getEvents()
        },
        error: (error) => {
          this.closeModal();
          this.sweetAlertService.confirm('error', 'Actualizar', 'No fue posible actualizar el evento');
        }
      })
    } else {
      this.eventsService.createEvent(eventData).subscribe({
        next: (res) => {
          this.closeModal();
          this.sweetAlertService.alert('success', 'Crear', 'Evento creado exitosamente!');
          this.getEvents()
        },
        error: (error) => {
          this.sweetAlertService.confirm('error', 'Crear', 'No fue posible crear el evento');
        }
      })
    }
  }

  createEvent(): void {
    this.isEditing = false;
    this.isModalVisible = true;
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return
    }
  }

  editEvent(eventId: number): void {
    this.eventsService.getEvent(eventId)
    .subscribe({
      next: (res) => {
        console.log('user edit: ', res)
        this.event = res;
        this.isEditing = true;
        this.isModalVisible = true;
      },
      error: (error) => {
        console.log( error );
      }
    })
  }

  //Abri modal de reservacion
  reservationConfirmEvent(eventId: number): void {
    this.eventsService.getEvent(eventId)
    .subscribe({
      next: (res) => {
        this.event = res;
        this.isReservation = true;
        this.isModalReservationVisible = true;
      },
      error: (error) => {
        console.log( error );
      }
    })
  }

  //Cancelar evento
  async reservationCancelEvent(eventId: number): Promise<void> {
    const userId = this.currentUser!.id;
    try {
      // Confirmar cancelación
      const confirm = await this.sweetAlertService.confirm(
        'question',
        '¿Estas seguro de cancelar la reserva?',
        'La reserva será eliminada'
      );

      if (!confirm) {
        return; // Si no se confirma, salir de la función
      }

      // Obtener la reservación del usuario para el evento
      const reservation = await firstValueFrom(this.reservationsService.getOneReservationByUserAndEvent(userId, eventId));
      if (!reservation) {
        throw new Error('Reserva no encontrada');
      }

      // Crear objeto para actualizar la cantidad disponible
      const availableQuantity: IAvailableQuantity = {
        availableQuantity: reservation.reservedQuantity
      };

      // Actualizar la disponibilidad de cupos del evento
      await firstValueFrom(this.eventsService.updateAvailableQuantity(eventId, availableQuantity, 'cancel'));
      // Eliminar la reserva
      await firstValueFrom(this.reservationsService.deleteReservation(reservation.id));


      // Cerrar el modal y mostrar mensaje de éxito
      this.closeModal();
      await this.sweetAlertService.alert('success', 'Cancelar', 'Reserva cancelada exitosamente!');
      
      // Actualizar la lista de eventos
      this.getEvents();
    } catch (error) {
      console.error(error);
      await this.sweetAlertService.confirm('error', 'Cancelar', 'No fue posible cancelar la reserva');
    }
  }


  //Crear registro de reservación
  reserveEvent(eventData: any) {
    const reservationData = {
      eventId: this.event.id,
      userId: this.currentUser!.id,
      reservedQuantity: eventData.reservedQuantity
    };


    if (this.isReservation) {
      this.reservationsService.createReservation(reservationData).subscribe({
        next: (res) => {
          this.closeModal();
          this.sweetAlertService.alert('success', 'Crear', 'Reserva creada exitosamente!');
          this.getEvents()
        },
        error: (error) => {
          this.closeModal();
          this.sweetAlertService.confirm('error', 'Crear', 'No fue posible actualizar la reserva');
        }
      })
    }
  }

  async deleteEvent(eventId: number): Promise<void> {
    const confirm = await this.sweetAlertService.confirm('question', '¿Estas seguro de eliminar el evento?', `El evento será eliminado`);
    if (confirm) {
      this.eventsService.deleteEvent(eventId)
      .subscribe({
        next: (res) => {
          this.closeModal();
            this.sweetAlertService.alert('success', 'Eliminar', 'Evento eliminado exitosamente!');
            this.getEvents() 
        },
        error: (error) => {
          console.log( error );
          this.sweetAlertService.confirm('error', 'Eliminar', 'No fue posible eliminar el evento');
        }
      })
    }
  }



  filterEvents(event: any): void {
    
    const searchTerm = event?.value?.toLowerCase(); // Verificación de nulidad y conversión a minúsculas
    

    if (!searchTerm) {
      this.filteredEvents = [...this.events];
    } else {
      this.filteredEvents = this.events.filter(event =>
        event.name.toLowerCase().includes(searchTerm) ||
        event.client.name.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm)
      );
    }

    this.noEventsFound = this.filteredEvents.length === 0;
  }

  closeModal() {
    this.isModalVisible = false;
    this.isModalReservationVisible = false;
  }

  clearForm() {
    this.eventForm.reset(); // Resetea el formulario para limpiar los campos
  }

  initiatializedEvent(): IEvent {
    return {
      id: 0,
      clientId: 0,
      name: '',
      description: '',
      location: '',
      totalGuest: 0,
      availableQuantity: 0,
      date: new Date(),
      hour: new Date(),
      status: 0,
      client: {
        id: 0,
        name: '',
        address: '',
        email: '',
        phone: '',
        events: []
      }
    }
  }

  initiatializedReservation(): IReservation {
    return {
      id: 0,
      userId: 0,
      eventId: 0,
      reservedQuantity: 0,
      status: 0,
      user: this.initiatializedUser(),
      event: this.initiatializedEvent(),
    }
  }

  initiatializedUser(): User {
    return {
      id: 0,
      roleId: 0,
      name: '',
      firstName: '',
      lastName: '',
      identification: '',
      identificationTypeId: 0,
      email: '',
      phone: '',
      birthday: '',
      username: '',
      role: {
        id: 0,
        name: '',
        identifier: '',
        description: '',
      },
      identificationType: {
        id: 0,
        name: '',
        abbreviation: '',
        createdAt: '',
        updatedAt: '',
      }
    }
  }

}
