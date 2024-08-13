import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarInterface } from './car-interface';
import { catchError } from 'rxjs/operators';
import {throwError} from 'rxjs'; 
@Injectable({
  providedIn: 'root'
  
})


export class CarServiceService {

  constructor(private http: HttpClient) {}
  
  getCars() {//https://cars-database.tryasp.net
    return this.http.get<CarInterface[]>("https://localhost:7157/cars").pipe(
      catchError(this.handleError)
    );
  }

  getCarById(id:number){
    return this.http.get<CarInterface>(`https://localhost:7157/cars/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateCar(newCar: CarInterface, id: number){
    return this.http.put<CarInterface>(`https://localhost:7157/cars/${id}`, newCar).pipe(
      catchError(this.handleError)
    );
  }

  createCar(newCar:CarInterface) {
    return this.http.post<CarInterface>("https://localhost:7157/cars", newCar).pipe(
      catchError(this.handleError)
    );
  }

  removeCar(id: number){
    return this.http.delete<CarInterface>(`https://localhost:7157/cars/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    //handle error
    console.error('An error occurred getting or using cars', error.message);
    return throwError(
      'Something bad happened; please try again later.'
    )
  }
}
