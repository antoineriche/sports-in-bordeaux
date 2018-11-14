import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OpenBordeauxService {

  constructor(private http: HttpClient) {
    console.log('Hello OpenBordeauxService Provider');
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
        console.error(error.error);
    }
    // return an observable with a user-facing error message
    return throwError(error);
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getSportPoints(): Observable<any> {
    console.log('getSportPoints');
    var url = "https://jsonplaceholder.typicode.com/todos";
    url = "http://odata.bordeaux.fr/v1/databordeaux/poisport/?format=json";
    // url = "https://opendata.paris.fr/api/records/1.0/search/?dataset=nombre-de-beneficiaires-pass-paris-seniors-ou-access&facet=arrondissement&facet=exercice";

    url = "https://cors-anywhere.herokuapp.com/"+url;
    return this.http.get(url).pipe(
      map(this.extractData), catchError(this.handleError)
    );
  }
}
