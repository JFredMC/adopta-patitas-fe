import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environments } from '../../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IdentificationType, User } from '../../auth/interfaces';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string = environments.baseUrl;
  public currentUser?: User   = this.authService.currentUser;
  private token?: string = this.authService.getAuthToken();
  private headers: HttpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${ this.token }`)

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(`${ this.baseUrl }/user/${ userId }`, { headers: this.headers })
      .pipe(
        map(res => res),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'Error to get routesDetail' );
        })
      );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${ this.baseUrl }/user/${ this.currentUser?.id }`, { headers: this.headers })
      .pipe(
        map(res => res),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'Error to get routesDetail' );
        })
      );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${ this.baseUrl }/user`, { headers: this.headers })
      .pipe(
        map(res => res),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'Error to get routesDetail' );
        })
      );
  }

  createUser(data: FormData): Observable<boolean> {
    return this.http.post<User>(`${ this.baseUrl }/user`, data, { headers: this.headers })
      .pipe(
        map(() => true),
        catchError((err) => {
          console.log(err);
          if (err.error.message) {
            return throwError( () => this.errorHandlerAccount(err.error) );
          } else {
            return throwError( () => 'AN_ERROR_OCURRED' );
          }
        })
      );
  }

  updateUser(userId: number, data: FormData): Observable<boolean> {
    return this.http.patch<User>(`${ this.baseUrl }/user/${ userId }`, data, { headers: this.headers })
      .pipe(
        map(() => true),
        catchError((err) => {
          console.log(err);
          if (err.error.message) {
            return throwError( () => this.errorHandlerAccount(err.error) );
          } else {
            return throwError( () => 'AN_ERROR_OCURRED' );
          }
        })
      );
  }

  deleteUser(userId: number): Observable<boolean> {
    return this.http.delete<User>(`${ this.baseUrl }/user/${ userId }`, { headers: this.headers })
      .pipe(
        map(() => true),
        catchError((err) => {
          console.log(err);
          if (err.error.message) {
            return throwError( () => this.errorHandlerAccount(err.error) );
          } else {
            return throwError( () => 'AN_ERROR_OCURRED' );
          }
        })
      );
  }

  getIdentificationTypes(): Observable<IdentificationType[]> {
    return this.http.get<IdentificationType[]>(`${ this.baseUrl }/identification_type`, { headers: this.headers })
      .pipe(
        map(res => res),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'Error to get routesDetail' );
        })
      );
  }
  

  errorHandlerAccount(error: any): string {
    if (error.message == 'Error al actualizar usuario' || error.message == 'Error al actualizar Usuario') {
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
        case 'Ocurrió un error en el servidor: BadRequestException: NAME is already in use':
          return 'EXISTS_NAME'
          break;
        case 'Ocurrió un error en el servidor: BadRequestException: ID_NUMBER is already in use':
          return 'EXISTS_IDENTIFICATION'
          break;
        case 'Ocurrió un error en el servidor: BadRequestException: PHONE NUMBER is already in use':
          return 'EXISTS_PHONE'
          break;
      
        default:
          return 'AN_ERROR_OCURRED'
          break;
      }
    } else {
      return 'AN_ERROR_OCURRED';
    }
  }

}
