import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { IdentificationType, LoginResponse, RecoverPasswordErrorResponse, RecoverPasswordRequest, RequestGenerateVerificationCode, RequestValidateOtp, ResetPasswordRequest, ResetPasswordResponse, ResponseRegister, User, UserRegister, updateTokenWebPushRequest } from '../interfaces';
import { environments } from '../../../../environments/environments';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private baseUrl: string = environments.baseUrl;
  private user?: User;
  private userId?: number;
  private authTokenKey: string = 'accessToken';
  private userIdKey: string = 'userId';
  public userSubject: BehaviorSubject<User|undefined> = new BehaviorSubject<User|undefined>(undefined);
  private headers: HttpHeaders;

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const accessToken = localStorage.getItem(this.authTokenKey);
      if (accessToken) {
        this.headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${accessToken}`);
      } else {
        this.headers = new HttpHeaders().set('Content-Type', 'application/json');
      }
    } else {
      this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    }
  }

  get currentUser(): User|undefined {
    if ( !this.user ) return undefined;
    return {...this.user};
  }

  // get headers(): HttpHeaders {
  //   const headers = new HttpHeaders().set('Content-Type', 'application/json');

  //   if (isPlatformBrowser(this.platformId)) {
  //     const accessToken = localStorage.getItem(this.authTokenKey);
  //     if (accessToken) {
  //       headers.set('Authorization', `Bearer ${accessToken}`);
  //     }
  //   }

  //   return headers;
  // }

  login(data: any): Observable<boolean> {
    return this.http.post<LoginResponse>(`${ this.baseUrl }/auth/login`, data)
      .pipe(
        tap(({ user, accessToken }) => {
          this.user = user;
          this.userId = user.id;
          this.userSubject.next(user);
          if (user.isActive) {
            localStorage.setItem(this.authTokenKey, accessToken);
            localStorage.setItem(this.userIdKey, `${ this.userId }`);
          }
          this.isLoggedInSubject.next(true);
        }),
        map(() => true),
        catchError((err) => {
          console.log(err);
          if (err.error.message) {
            return throwError( () => this.errorHandlerLogin(err.error) );
          } else {
            //err.error.errors.[0].msg
            return throwError( () => 'AN_ERROR_OCURRED' );
          }
        })
      );
  }

  socialLogin(data: any): Observable<boolean> {
    return this.http.post<LoginResponse>(`${ this.baseUrl }/auth/social_login`, data)
      .pipe(
        tap(({ user, accessToken }) => {
          this.user = user;
          this.userId = user.id;
          this.userSubject.next(user);
          if (user.isActive) {
            localStorage.setItem(this.authTokenKey, accessToken);
            localStorage.setItem(this.userIdKey, `${ this.userId }`);
          }
        }),
        map(() => true),
        catchError((err) => {
          console.log(err);
          if (err.error.message) {
            return throwError( () => this.errorHandlerLogin(err.error) );
          } else {
            //err.error.errors.[0].msg
            return throwError( () => 'AN_ERROR_OCURRED' );
          }
        })
      );
  }

  register(data: UserRegister): Observable<boolean> {
    return this.http.post<ResponseRegister>(`${ this.baseUrl }/user/register`, data)
      .pipe(
        tap((res) => {
          this.user = res.user;
        }),
        map(() => true),
        catchError((err) => {
          console.log(err);
          if (err.error.message) {
            return throwError( () => this.errorHandlerRegister(err.error) );
          } else {
            return throwError( () => 'AN_ERROR_OCURRED' );
          }
        })
      );
  }

  checkAuthentication(): Observable<boolean> {

    if (typeof localStorage === 'undefined' || localStorage === null) {
      return of(false); // Devuelve un Observable con valor false si localStorage no está definido
    }

    if (!localStorage.getItem(this.authTokenKey)) {
        return of(false);
    }

    const accessToken = localStorage.getItem(this.authTokenKey);
    const userId      = localStorage.getItem(this.userIdKey);
    const headers     = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${ accessToken }`)

    return this.http.get<User>(`${ this.baseUrl }/user/${ userId }`, { headers: headers })
      .pipe(
        tap((res) => {
          this.user = res;
          this.userSubject.next(res);
        }),
        map(() => true),
        catchError( (err) => {
          console.log({err});
          return of(false)
        })
      );

  }

  logout(): void {
    this.user = undefined;
    this.userSubject.next(undefined);
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.userIdKey);
    this.isLoggedInSubject.next(false);
    this.router.navigateByUrl('/auth/login');
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  getAuthToken() : string|undefined {
    const accessToken = localStorage.getItem(this.authTokenKey);
    if (!accessToken) return undefined;
    return accessToken;
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${ this.baseUrl }/user/${ id }`, { headers: this.headers })
      .pipe(
        tap((res) => this.user = res),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'Error to get userById' );
        })
      );
  }

  getIdentificationTypes(): Observable<IdentificationType[]> {
    console.log(this.baseUrl)
    return this.http.get<IdentificationType[]>(`${ this.baseUrl }/identification_type`)
      .pipe(
        catchError((err) => {
          console.log(err);
          return throwError( () => 'Error to get identificationTypes' );
        })
      );
  }

  verifyAccount(data: any): Observable<boolean> {
    return this.http.post<LoginResponse>(`${ this.baseUrl }/user/validate_otp`, data)
      .pipe(
        tap(({ user, accessToken }) => {
          this.user = user;
          this.userId = user.id;
          this.userSubject.next(user);
          localStorage.setItem(this.authTokenKey, accessToken);
          localStorage.setItem(this.userIdKey, `${ this.userId }`);
        }),
        map(() => true),
        catchError((err) => {
          console.log(err);
          if (err.error.message) {
            return throwError( () => this.errorHandlerVerifyAccount(err.error) );
          } else {
            return throwError( () => 'AN_ERROR_OCURRED' );
          }
        })
      );
  }

  generateAccountVerificationCode(data: RequestGenerateVerificationCode): Observable<boolean> {
    return this.http.post<any>(`${ this.baseUrl }/user/generate_otp`, data)
      .pipe(
        map(() => true),
        catchError((err) => {
          console.log(err);
          if (err.error.message) {
            return throwError( () => err.error.message );
          } else {
            return throwError( () => 'AN_ERROR_OCURRED2' );
          }
        })
      );
  }

  updateTokenWebPush(data: updateTokenWebPushRequest): Observable<boolean> {
    return this.http.patch<any>(`${ this.baseUrl }/user/update_webpush`, data, { headers: this.headers })
      .pipe(
        map(() => true),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'Error to update token_webpush' );
        })
      );
  }

  recoverPassword(data: RecoverPasswordRequest): Observable<boolean> {
    return this.http.post<User|RecoverPasswordErrorResponse>(`${ this.baseUrl }/auth/forgot_password`, data)
      .pipe(
        map(() => true),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'AN_ERROR_OCURRED' );
        })
      );
  }

  resetPassword(data: ResetPasswordRequest): Observable<boolean> {
    return this.http.post<ResetPasswordResponse>(`${ this.baseUrl }/auth/reset_password`, data)
      .pipe(
        map(() => true),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'AN_ERROR_OCURRED' );
        })
      );
  }

  errorHandlerLogin(error: any): string {
    if (error.message == 'Error al iniciar sesión') {
      switch (error.error) {
        case 'Usuario o contraseña invalido':
          return 'ERROR_USERNAME_PASSWORD'
          break;
        case 'Usuario no encontrado por email':
          return 'USER_NOT_FOUND_BY_EMAIL'
          break;  
      
        default:
          return 'AN_ERROR_OCURRED'
          break;
      }
    } else {
      return 'AN_ERROR_OCURRED'
    }
  }

  errorHandlerRegister(error: any): string {
    if (error.message == 'Error al crear usuario') {
      switch (error.error) {
        case 'Ya existe un usuario con este username':
          return 'EXISTS_USERNAME'
          break;
        case 'Ya existe un usuario con esta identificación':
          return 'EXISTS_IDENTIFICATION'
          break;
        case 'Ya existe un usuario con este email':
          return 'EXISTS_EMAIL'
          break;
        case 'Ya existe un usuario con este teléfono':
          return 'EXISTS_PHONE'
          break;
      
        default:
          return 'AN_ERROR_OCURRED'
          break;
      }
    } else {
      switch (error.message[0]) {
        case 'password is not strong enough':
          return 'INSECURE_PASSWORD'
          break;
      
        default:
          return 'AN_ERROR_OCURRED';
          break;
      }
    }
  }

  errorHandlerVerifyAccount(error: any): string {
    if (error.message == 'Error al validar OTP') {
      switch (error.error) {
        case 'Código inválido':
          return 'INVALID_CODE'
          break;
        case 'Tiempo expirado':
          return 'EXPIRED_CODE'
          break;  
      
        default:
          return 'AN_ERROR_OCURRED'
          break;
      }
    } else {
      return 'AN_ERROR_OCURRED'
    }
  }
}
