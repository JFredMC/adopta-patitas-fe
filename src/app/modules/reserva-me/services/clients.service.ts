import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IClient, User } from '../../auth/interfaces';
import { AuthService } from '../../auth/services/auth.service';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
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

  getClient(clientId: number): Observable<IClient> {
    return this.http.get<IClient>(`${ this.baseUrl }/client/${ clientId }`, { headers: this.headers })
      .pipe(
        map(res => res),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'Error to get client' );
        })
      );
  }

  getClients(): Observable<IClient[]> {
    return this.http.get<IClient[]>(`${ this.baseUrl }/client`, { headers: this.headers })
      .pipe(
        map(res => res),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'Error to get clients' );
        })
      );
  }

}
