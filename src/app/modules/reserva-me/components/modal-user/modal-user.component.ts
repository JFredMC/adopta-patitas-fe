import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IdentificationType, Role, User } from '../../../auth/interfaces';
import { ValidatorsService } from '../../../../shared/utils/services/validators.service';


@Component({
  selector: 'app-modal-user',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.css']
})
export class ModalUserComponent {
  @Input() isVisible: boolean = false;
  @Input() user: User = this.initiatializedUser();
  @Input() roles: Role[] = [];
  @Input() identificationTypes: IdentificationType[] = [];
  @Input() isEditing: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  public userForm: FormGroup = this.fb.group({
    firstName:          ['', [Validators.required], []],
    lastName: ['', [Validators.required], []],
    email:      ['', [Validators.required, Validators.minLength(5)], []],
    phone:      ['', [Validators.required, Validators.minLength(5)], []],
    username:      ['', [Validators.required, Validators.minLength(5)], []],
    password:      ['', [Validators.required, Validators.minLength(5)], []],
    identificationTypeId:      ['', [Validators.required, Validators.minLength(5)], []],
    identification:      ['', [Validators.required, Validators.minLength(5)], []],
    dateOfBirth:      ['', [Validators.required], []],
  });

  constructor(
    private validatorsService: ValidatorsService,
    private fb: FormBuilder,
  ) {}
  close() {
    this.closeModal.emit();
  }

  saveModal() {
    console.log(this.isEditing)
    this.save.emit(this.user);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.userForm, field);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.userForm, field);
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
