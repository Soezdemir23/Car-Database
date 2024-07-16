import { Component, Injectable, Input, OnInit } from '@angular/core';
import { CarInterface } from '../car-interface';
import { CarListComponent } from '../car-list/car-list.component';
import { DatePipe } from '@angular/common';
import { CarServiceService } from '../car-service.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
@Component({
  selector: 'app-car',
  standalone: true,
  imports: [CarListComponent, DatePipe],
  templateUrl: './car.component.html',
  styleUrl: './car.component.css'
})
export class CarComponent implements OnInit {
  title = "Cars"

  cars: Array<CarInterface> = []

  constructor(private carService: CarServiceService) { }

  ngOnInit(): void {
    this.carService.getCars().subscribe({
      next: (data) => {
        console.log(data)
        const middle = data.map(car =>{
          return {
            ...car,
            year: new Date(car.year).toISOString()
          }
        })
        console.log("Cars on init: ", middle)
        this.cars = middle; 
        },
      error: (e) => console.error("an error trying to get cars: ", e),
      complete: () => console.log("complete")
    });
  }


  //fetch will be handled later when the api part is set up

  handleSubmitCar($event: CarInterface) {
    console.log("Befor update date: ", $event.year);
    $event.year = new Date($event.year);
    console.log("After update date: ", $event.year)
    if ($event.id > 0) {
      this.carService.updateCar($event, $event.id).subscribe({
        next: (updatedCar) => {
          console.log("Car updated: " + JSON.stringify(updatedCar))
          const index = this.cars.findIndex(car => car.id === updatedCar.id);
          console.log("index of car that is updated: ", updatedCar)
          this.cars = this.cars.map(car => car.id === index? updatedCar: car)
          if (index !== -1) {
         
          }
        },
        error: (e) => console.error("An error during update: ", e),
        complete: () => "update finished"
      })
    } else {
      $event.id = this.cars.length + 1;
      this.carService.createCar($event).subscribe({
        next: (newCar) => {
          console.log("Car created: ", newCar)
          //adding a new car, making angular re-render the new entry
          this.cars = [...this.cars, newCar];
        }
        ,
        error: (e) => console.error("Error creating car: ", e),
        complete: () => console.log("car creation finished")
      })
    }

  }
     // handle delete
     handleDelete(id: number) {
      this.carService.removeCar(id).subscribe({
        next: (n) => {
          this.cars = this.cars.filter(car => car.id !== id);
          console.log("removal succesful")
        },
        error: (e) => console.error("removal unsuccesful: ", e),
        complete: () => console.log("removal complete")
      })
    }
}

