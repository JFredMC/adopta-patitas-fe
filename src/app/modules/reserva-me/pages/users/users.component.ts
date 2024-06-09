import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/user.service';
import { IdentificationType, Role, User } from '../../../auth/interfaces';
import { SweetAlertService } from '../../../../shared/utils/services/sweet-alert.service';
import { ModalUserComponent } from '../../components/modal-user/modal-user.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ModalUserComponent, RouterLink, RouterLinkActive],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public users: User[] = []
  filteredUsers: User[] = []
  public roles: Role[] = []
  public identificationTypes: IdentificationType[] = []
  public user: User = this.initiatializedUser();
  public currentUser?: User = this.authService.currentUser;
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
  isModalVisible = false;
  isEditing = false;
  isLoadingBtnUpdate = false;
  noUsersFound = false;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
    private sweetAlertService: SweetAlertService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.getUsers()
    this.getRoles()
    this.getIdentificationTypes()
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe({
        next: (res) => {
          this.users = res;
          this.filteredUsers = [...this.users]
        },
        error: (error) => {
          console.log( error );
        }
      })
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

  save(): void {
    console.log('user: ', this.isEditing)
    if (this.isEditing) {
      this.createUser()
    }else {
      this.updateUser()
    }
  }

  editUser(userId: number | undefined): void {
    this.userService.getUser(userId!)
    .subscribe({
      next: (res) => {
        console.log('user edit: ', res)
        this.user = res;
        this.isEditing = true;
        this.isModalVisible = true;
      },
      error: (error) => {
        console.log( error );
      }
    })
  }

  async deleteUser(userId: number): Promise<void> {
    const confirm = await this.sweetAlertService.confirm('question', '¿Estas seguro de eliminar el usuario?', `El usuario será eliminado`);
    if (confirm) {
      this.userService.deleteUser(userId)
      .subscribe({
        next: (res) => {
          this.closeModal();
            this.sweetAlertService.alert('success', 'Eliminar', 'Usuario eliminado exitosamente!');
            this.getUsers() 
        },
        error: (error) => {
          console.log( error );
          this.sweetAlertService.confirm('error', 'Eliminar', 'No fue posible eliminar el usuario');
        }
      })
    }
  }

  closeModal() {
    this.isModalVisible = false;
  }

  createUser(): void {
    console.log(this.user);
    this.isEditing = false;
    this.isModalVisible = true;
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return
    }

    this.isLoadingBtnUpdate = true;
    const data     = this.userForm.value;
    const formData = new FormData();

    formData.append('firstName',             data.firstname );
    formData.append('lastName',              data.lastname );
    formData.append('identificationTypeId', data.identificationTypeId );
    formData.append('identification',         data.identification );
    formData.append('phone',           data.phone );
    formData.append('dateOfBirth',          data.dateOfBirth );
    formData.append('name',          `${data.firstname} ${data.lastname}`);
    if (data.profilePictureFile) {
      formData.append('profilePictureFile',   data.profilePictureFileSource );
    }
    this.userService.createUser(formData)
      .subscribe({
        next: (res) => {
          this.sweetAlertService.confirm('success', 'Creado', '¡Usuario creado exitosamente!');
        },
        error: (error) => {
          this.sweetAlertService.confirm('error', 'Error', 'No fue posible crear el usuario');
        }
      })
  }

  updateUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return
    }

    this.isLoadingBtnUpdate = true;
    const userId = this.currentUser!.id;
    const data     = this.userForm.value;
    const formData = new FormData();

    formData.append('firstName',             data.firstname );
    formData.append('lastName',              data.lastname );
    formData.append('identificationTypeId', data.identificationTypeId );
    formData.append('identification',         data.identification );
    formData.append('phone',           data.phone );
    formData.append('dateOfBirth',          data.dateOfBirth );
    formData.append('name',          `${data.firstname} ${data.lastname}`);
    if (data.profilePictureFile) {
      formData.append('profilePictureFile',   data.profilePictureFileSource );
    }
    this.userService.updateUser(userId!, formData)
      .subscribe({
        next: (res) => {
          this.sweetAlertService.confirm('success', 'Actualizado', '¡Usuario actualizar exitosamente!');
        },
        error: (error) => {
          this.sweetAlertService.confirm('error', 'Error', 'No fue posible actualizar el usuario');
        }
      })
  }

  filterUsers(event: any): void {
    
    const searchTerm = event?.value?.toLowerCase(); // Verificación de nulidad y conversión a minúsculas
    

    if (!searchTerm) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.identificationType.abbreviation.toLowerCase().includes(searchTerm) ||
        user.identification.toLowerCase().includes(searchTerm) ||
        user.role.name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.phone.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    this.noUsersFound = this.filteredUsers.length === 0;
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
