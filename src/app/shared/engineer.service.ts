import { Observable ,throwError} from "rxjs";
import { Engineer } from "./engineer";
import { Injectable } from "@angular/core";
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { environment } from "src/environments/environment";


export class EngineerService{
    endpoint:string=environment.apiBaseUrl;
    header=new HttpHeaders().set('Content-Type', 'application/json').set('x-api-key',environment.apiKey);

    constructor(private http:HttpClient) { }

    //
    // Add engineer
  Add(data: Engineer): Observable<any> {
    let API_URL = `${this.endpoint}/engineers`;
    return this.http.post(API_URL, data,{headers:this.header}).pipe(catchError(this.errorMgmt));
  }

  // Get all engineers
  GetAll() {
    return this.http.get(`${this.endpoint}/engineers`,{headers:this.header,});
  }

  
  // Get engineer by id
  GetById(id): Observable<any> {
    let API_URL = `${this.endpoint}/engineers/${id}`;
    return this.http.get(API_URL, { headers: this.header }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }


  // Update engineer
  Update(id, data): Observable<any> {
    let API_URL = `${this.endpoint}/engineer/${id}`;
    return this.http
      .put(API_URL, data, { headers: this.header })
      .pipe(catchError(this.errorMgmt));
  }


  // Error handling
  errorMgmt(exception: HttpErrorResponse) {
    let errorMessage = '';
    if (exception.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = exception.error.message;
    } else {
      // Get server-side error
      let exceptionType =exception.error.type;
      if(
        exceptionType==="Exception"
      ){
        errorMessage=exception.error.message;
      }
      else{
        errorMessage = "Please try again";
      }
      
    }
   
   
    return throwError(errorMessage);
      
   
  }
}