import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { environments } from '../../../../environments/environments';
import { User } from '../../auth/interfaces';
import { ICreateReservation, IReservation } from '../interfaces/reserva-me.interface';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
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

  getReservation(reservationId: number): Observable<IReservation> {
    return this.http.get<IReservation>(`${ this.baseUrl }/reservation/${ reservationId }`, { headers: this.headers })
      .pipe(
        map(res => res),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'Error to get reservation' );
        })
      );
  }

  getReservationsByUser(userId: number): Observable<IReservation[]> {
    return this.http.get<IReservation[]>(`${ this.baseUrl }/reservation/by_user/${ userId }`, { headers: this.headers })
      .pipe(
        map(res => res),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'Error to get reservation by user' );
        })
      );
  }

  getOneReservationByUserAndEvent(userId: number, eventId: number): Observable<IReservation> {
    return this.http.get<IReservation>(`${ this.baseUrl }/reservation/by_one_user_and_event/${userId}/${ eventId }`, { headers: this.headers })
      .pipe(
        map(res => res),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'Error to get reservation by user and event' );
        })
      );
  }

  getReservationByUserAndEvent(userId: number, eventId: number): Observable<IReservation[]> {
    return this.http.get<IReservation[]>(`${ this.baseUrl }/reservation/by_user_and_event/${userId}/${ eventId }`, { headers: this.headers })
      .pipe(
        map(res => res),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'Error to get reservation by user and event' );
        })
      );
  }

  getReservations(): Observable<IReservation[]> {
    return this.http.get<IReservation[]>(`${ this.baseUrl }/reservation`, { headers: this.headers })
      .pipe(
        map(res => res),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'Error to get reservations' );
        })
      );
  }

  createReservation(data: ICreateReservation): Observable<boolean> {
    return this.http.post<ICreateReservation>(`${ this.baseUrl }/reservation`, data, { headers: this.headers })
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

  deleteReservation(reservationId: number): Observable<boolean> {
    return this.http.delete<IReservation>(`${ this.baseUrl }/reservation/${reservationId}`, { headers: this.headers })
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
