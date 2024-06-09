import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../../auth/interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetAlertService } from '../../../../shared/utils/services/sweet-alert.service';
import { ValidatorsService } from '../../../../shared/utils/services/validators.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {
  public user: User = this.initiatializedUser()
  public userForm!: FormGroup;
  constructor(
    private userService: UserService,
    private sweetAlertService: SweetAlertService,
    private validatorsService: ValidatorsService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.getCurrentUser()
    this.initializeForm();
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      phone: [this.user.phone, [Validators.required]],
      username: [this.user.username, [Validators.required]],
      password: [this.user.password, [Validators.required]],
      identificationTypeId: [this.user.identificationTypeId, [Validators.required]],
      identification: [this.user.identification, [Validators.required]],
      birthday: [this.user.birthday, [Validators.required]],
    });
  }

  getCurrentUser(): void {
    this.userService.getCurrentUser()
      .subscribe({
        next: (res) => {
          this.user = res;
        },
        error: (error) => {
          console.log( error );
        }
      })
  }

  previewImage(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.user.profilePicture = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  updateUser(id: number): void {
    console.log('this.userForm:', id, this.userForm)
    const data = { ...this.userForm.value };
    console.log(data)
    this.userService.updateUser(id, data).subscribe({
      next: (res) => {
        console.log('User updated successfully: ', res);
        // Aquí puedes realizar cualquier acción adicional después de actualizar el usuario
      },
      error: (error) => {
        console.log('Error updating user: ', error);
      }
    });
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
