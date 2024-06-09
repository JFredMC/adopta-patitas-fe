import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { User } from '../../auth/interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import { IAvailableQuantity, IEvent } from '../interfaces/reserva-me.interface';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private baseUrl: string = environments.baseUrl;
  public currentUser?: User   = this.authService.currentUser;
  private accessToken?: string = this.authService.getAuthToken();
  private headers: HttpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${ this.accessToken }`)

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }


  getEvent(eventId: number): Observable<IEvent> {
    return this.http.get<IEvent>(`${ this.baseUrl }/event/${ eventId }`, { headers: this.headers })
      .pipe(
        map(res => res),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'Error to get routesDetail' );
        })
      );
  }

  getEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${ this.baseUrl }/event`, { headers: this.headers })
      .pipe(
        map(res => res),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'Error to get events' );
        })
      );
  }

  createEvent(data: IEvent): Observable<boolean> {
    return this.http.post<IEvent>(`${ this.baseUrl }/event`, data, { headers: this.headers })
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

  updateEvent(eventId: number, data: IEvent): Observable<boolean> {
    return this.http.patch<IEvent>(`${ this.baseUrl }/event/${ eventId }`, data, { headers: this.headers })
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

  updateAvailableQuantity(id: number, data: IAvailableQuantity, type: string): Observable<boolean> {
    return this.http.patch<IEvent>(`${ this.baseUrl }/event/update_available_quantity/${ id }/${ type }`, data, { headers: this.headers })
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

  deleteEvent(eventId: number): Observable<boolean> {
    return this.http.delete<IEvent>(`${ this.baseUrl }/event/${ eventId }`, { headers: this.headers })
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
    if (error.message == 'Error al actualizar evento' || error.message == 'Error al actualizar evento') {
      switch (error.error) {
        case 'Ya existe un evento con este username':
          return 'EXISTS_USERNAME'
          break;
        case 'Ya existe un evento con esta identificación':
          return 'EXISTS_IDENTIFICATION'
          break;
        case 'Ya existe un evento con este email':
          return 'EXISTS_EMAIL'
          break;
        case 'Ya existe un evento con este teléfono':
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
