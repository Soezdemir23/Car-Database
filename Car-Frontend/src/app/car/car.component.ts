import { Component, Injectable, Input } from '@angular/core';
import { CarInterface } from '../car-interface';
import { CarListComponent } from '../car-list/car-list.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [CarListComponent, DatePipe],
  templateUrl: './car.component.html',
  styleUrl: './car.component.css'
})

export class CarComponent {

 cars: Array<CarInterface> = [
    {
      id: 1,
      brand: "Toyota",
      model: "Casio",
      price: 9230,
      year: new Date("2022-03-25"),
      reserved: true
    },
    {
      id: 2,
      brand: "Ford",
      model: "Mustang Phoenix",
      price: 1200,
      year: new Date("2202-03-25"),
      reserved: true
    },{
      id: 3,
      brand: "VW",
      model: "Käfer",
      price: 1200,
      year: new Date("1990-03-25"),
      reserved: false
    },
  ]
  //fetch will be handled later when the api part is set up

  //create a new car object:
  handleCreate(createdCar: CarInterface){

    console.log("created Car object: "+ JSON.stringify(createdCar));
    if (this.cars.map(carsInList=> carsInList.id === createdCar.id)) {
      console.error("It already exists in the carlist");
      return;
    }
    this.cars.push(createdCar)
  }

  //handle update
  handleUpdate(updatedCar: CarInterface) {
    this.cars.map(carInList => carInList.id === updatedCar.id ? updatedCar: carInList)
  }

  // handle delete
  handleDelete(id:number) {
    this.cars.filter(carInList => carInList.id !== id)
  }
}
