import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IEvent, IReservation } from '../../interfaces/reserva-me.interface';
import { IClient, User } from '../../../auth/interfaces';
import { ValidatorsService } from '../../../../shared/utils/services/validators.service';

@Component({
  selector: 'app-modal-confirm-reservation',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './modal-confirm-reservation.component.html',
  styleUrls: ['./modal-confirm-reservation.component.css']
})
export class ModalConfirmReservationComponent implements OnChanges {

  @Input() isModalReservationVisible: boolean = false;
  @Input() event: IEvent = this.initiatializedEvent();
  @Input() clients: IClient[] = [];
  @Input() isReservation: boolean = false;
  @Input() isAdmin: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() reserve = new EventEmitter<any>();

  disableInputs: boolean = true;
  public reservation: IReservation = this.initiatializedReservation();

  public reservationForm: FormGroup = this.fb.group({
      name: [{ value: '', disabled: true }, Validators.required],
      description: [{ value: '', disabled: true }, Validators.required],
      location: [{ value: '', disabled: true }, Validators.required],
      date: [{ value: '', disabled: true }, Validators.required],
      hour: [{ value: '', disabled: true }, Validators.required],
      reservedQuantity: [{ value: '', disabled: false }, Validators.required]
  });

  constructor(
    private validatorsService: ValidatorsService,
    private fb: FormBuilder,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event'] && this.event) {
      this.updateFormValues(this.event);
    }
  }

  updateFormValues(event: IEvent): void {
    this.reservationForm.patchValue({
      name: event.name,
      description: event.description,
      location: event.location,
      date: event.date,
      hour: event.hour
    });
  }

  close() {
    this.closeModal.emit();
    this.clearForm();
  }

  clearForm() {
    this.reservationForm.reset();
  }
  
  onSubmit(form: any) {
    if (form.valid) {
      const eventData = { ...this.reservationForm.value, id: this.event.id };
      this.reserve.emit(eventData);
    }
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.reservationForm, field);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.reservationForm, field);
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
