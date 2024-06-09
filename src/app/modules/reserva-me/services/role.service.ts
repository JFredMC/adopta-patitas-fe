import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Role, User } from '../../auth/interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

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

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${ this.baseUrl }/role`, { headers: this.headers })
      .pipe(
        map(res => res),
        catchError((err) => {
          console.log(err);
          return throwError( () => 'Error to get roles' );
        })
      );
  }

}
