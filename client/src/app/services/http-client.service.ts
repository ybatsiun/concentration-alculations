import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private beHost = '/api';
  private routes = {
    parseEquations: '/parseEquations',
    calculateConstants: '/calculateConstants',
  };
  constructor(private http: HttpClient) { }

  parseEquations(equations: any): Observable<any> {
    return this.parseEquationsReq(equations, this.routes.parseEquations);
  };
  calculateConstants(config: any): Observable<any> {
    return this.calculateConstantsReq(config, this.routes.calculateConstants);
  };

  private parseEquationsReq(equations: any, route: string): Observable<any> {
    return this.http.post<any>(this.beHost + route, {
      'equations': equations
    }).pipe(
      catchError(this.handleError<any>())
    )
  };

  private calculateConstantsReq(config: any, route: string): Observable<any> {
    return this.http.post<any>(this.beHost + route, config).pipe(
      catchError(this.handleError<any>())
    )
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Let the app keep running by returning an empty result.
      return of(error as T);
    };
  };
}
