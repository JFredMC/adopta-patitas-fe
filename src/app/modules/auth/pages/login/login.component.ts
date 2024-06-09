import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../interfaces';
import { AuthService } from '../../services/auth.service';
import { ValidatorsService } from '../../../../shared/utils/services/validators.service';
import { SweetAlertService } from '../../../../shared/utils/services/sweet-alert.service';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  darkMode: boolean = false;
  passwordFieldType: string = 'password';

  public loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(5)], []],
    password: ['', [Validators.required, Validators.minLength(6)], []],
    rememberMe: [false]
  });
  public currentUser?: User = undefined;
  public isLoadingBtnLogin: boolean = false;

  @ViewChild('btnCloseModal')
  public btnCloseModal!: ElementRef<HTMLButtonElement>;

  @Output()
  public isLoggedIn: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private validatorsService: ValidatorsService,
    private sweetAlertService: SweetAlertService,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.resetForm();
    this.loadRememberedUser();
  }

  ngOnDestroy(): void {
    this.resetForm();
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return
    }

    this.isLoadingBtnLogin = true;

    this.authService.login(this.loginForm.value)
      .subscribe({
        next: () => {
          this.isLoadingBtnLogin = false;
          this.currentUser = this.authService.currentUser;

          if (this.currentUser!.isActive && !this.currentUser!.secondAuthMode) {
            this.resetForm();
            this.router.navigate(['/reservame/dashboard']);
            this.isLoggedIn.emit(false);
            this.handleRememberMe();
          }
        },
        error: (errorMessage) => {
          console.log('errorMessage: ', errorMessage)
          this.isLoadingBtnLogin = false;
          this.sweetAlertService.alert('error', 'No es posible iniciar sesión', `Usuario o contraseña invalido`);
        }
      })
  }

  socialLogin(accessToken: string): void {
    const data = { TOKEN: accessToken };

    this.isLoadingBtnLogin = true;

    this.authService.socialLogin(data)
      .subscribe({
        next: () => {
          this.isLoadingBtnLogin = false;
          this.currentUser = this.authService.currentUser;

          if (this.currentUser!.isActive && !this.currentUser!.secondAuthMode) {
            
            this.router.navigate(['/home']);
            this.isLoggedIn.emit(false);
          }
        },
        error: (errorMessage) => {
          this.isLoadingBtnLogin = false;
          this.sweetAlertService.toast('error', 'AUTH.LOGIN.ALERT.TITLE.LOGIN', `AUTH.LOGIN.ALERT.MESSAGE.${ errorMessage }`);
        }
      })
  }

  forgotPassword(): void {
    
    this.router.navigate(['/forgot-password']);
  }

  resetForm(): void {
    this.loginForm.reset({
      username: '',
      password: ''
    });
  }

  togglePasswordVisibility(visible: boolean): void {
    this.passwordFieldType = visible ? 'text' : 'password';
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.loginForm, field);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.loginForm, field);
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  handleRememberMe(): void {
    if (this.loginForm.get('rememberMe')!.value) {
      this.localStorageService.setItem('username', this.loginForm.get('username')!.value);
      this.localStorageService.setItem('password', this.loginForm.get('password')!.value);
    } else {
      this.localStorageService.removeItem('username');
      this.localStorageService.removeItem('password');
    }
  }

  loadRememberedUser(): void {
    const rememberedUsername = this.localStorageService.getItem('username');
    const rememberedPassword = this.localStorageService.getItem('password');

    if (rememberedUsername && rememberedPassword) {
      this.loginForm.setValue({
        username: rememberedUsername,
        password: rememberedPassword,
        rememberMe: true
      });
    }
  }
}
