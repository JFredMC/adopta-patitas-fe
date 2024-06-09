import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../../reserva-me/services/user.service';
import { RoleService } from '../../../reserva-me/services/role.service';
import { IdentificationType, Role, User } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SweetAlertService } from '../../../../shared/utils/services/sweet-alert.service';
import { ValidatorsService } from '../../../../shared/utils/services/validators.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public roles: Role[] = []
  public identificationTypes: IdentificationType[] = []
  public user: User = this.initiatializedUser();
  public isLoadingBtnRegister: boolean = false;
  public registerForm: FormGroup = this.fb.group({
    roleId:          ['', [Validators.required], []],
    firstName:          ['', [Validators.required], []],
    lastName: ['', [Validators.required], []],
    email:      ['', [Validators.required, Validators.minLength(5)], []],
    phone:      ['', [Validators.required, Validators.minLength(5)], []],
    username:      ['', [Validators.required, Validators.minLength(5)], []],
    password:      ['', [Validators.required, Validators.minLength(5)], []],
    confirmPassword:      ['', [Validators.required, Validators.minLength(5)], []],
    identificationTypeId:      ['', [Validators.required], []],
    identification:      ['', [Validators.required, Validators.minLength(5)], []],
    birthday:      ['', [Validators.required], []],
  });

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private roleService: RoleService,
    private sweetAlertService: SweetAlertService,
    private validatorsService: ValidatorsService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.getRoles()
    this.getIdentificationTypes()
  }

  getIdentificationTypes(): void {
    this.userService.getIdentificationTypes()
      .subscribe({
        next: (res) => {
          this.identificationTypes = res;
        },
        error: (error) => {
          console.log( error );
        }
      })
  }

  getRoles(): void {
    this.roleService.getRoles()
      .subscribe({
        next: (res) => {
          this.roles = res;
        },
        error: (error) => {
          console.log( error );
        }
      })
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return
    }

    if (this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value) {
      this.sweetAlertService.confirm('warning', 'AUTH.REGISTER.ALERT.TITLE.VALIDATION', 'AUTH.REGISTER.ALERT.MESSAGE.PASSWORDS_NO_MATCH');
      return
    }

    this.isLoadingBtnRegister = true;
    const data = {
      firstName:             this.registerForm.get('firstName')?.value,
      lastName:              this.registerForm.get('lastName')?.value,
      identification:         this.registerForm.get('identification')?.value,
      identificationTypeId: this.registerForm.get('identificationTypeId')?.value,
      email:          this.registerForm.get('email')?.value,
      phone:           this.registerForm.get('phone')?.value,
      birthday:          this.registerForm.get('birthday')?.value,
      username:               this.registerForm.get('username')?.value,
      password:               this.registerForm.get('password')?.value,
      roleId:              3,
    }

    this.authService.register(data)
      .subscribe({
        next: () => {
          this.isLoadingBtnRegister = false;
            this.sweetAlertService.confirm('success', '¡Registro!', '¡Usuario registrado exitosamente!');
        },
        error: (errorMessage) => {
          this.isLoadingBtnRegister = false;
          this.sweetAlertService.confirm('error', '¡Registro!', `¡Error al registrar el usuario!`);
        }
      })
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.registerForm, field);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.registerForm, field);
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
