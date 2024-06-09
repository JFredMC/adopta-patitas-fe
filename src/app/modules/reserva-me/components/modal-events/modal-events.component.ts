import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IEvent } from '../../interfaces/reserva-me.interface';
import { IClient } from '../../../auth/interfaces';
import { ValidatorsService } from '../../../../shared/utils/services/validators.service';

@Component({
  selector: 'app-modal-events',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './modal-events.component.html',
  styleUrls: ['./modal-events.component.css']
})
export class ModalEventsComponent {

  @Input() isVisible: boolean = false;
  @Input() event: IEvent = this.initiatializedEvent();
  @Input() clients: IClient[] = [];
  @Input() isEditing: boolean = false;
  @Input() isAdmin: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  public eventForm: FormGroup = this.fb.group({
    clientId:          ['', [Validators.required], []],
    name: ['', [Validators.required], []],
    description:      ['', [Validators.required, Validators.minLength(5)], []],
    location:      ['', [Validators.required, Validators.minLength(5)], []],
    totalGuest:      ['', [Validators.required, Validators.minLength(5)], []],
    availableQuantity:      ['', [Validators.required, Validators.minLength(5)], []],
    date:      ['', [Validators.required], []],
    hour:      ['', [Validators.required], []],
  });

  constructor(
    private validatorsService: ValidatorsService,
    private fb: FormBuilder,
  ) {}


  close() {
    this.closeModal.emit();
    this.clearForm();
  }

  clearForm() {
    this.eventForm.reset();
  }
  
  onSubmit(form: any) {
    if (form.valid) {
      const eventData = { ...this.eventForm.value, id: this.event.id };
      this.save.emit(eventData);
    }
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.eventForm, field);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.eventForm, field);
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

}
