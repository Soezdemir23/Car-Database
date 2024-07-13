import { Component, Injectable, Input, OnInit } from '@angular/core';
import { CarInterface } from '../car-interface';
import { CarListComponent } from '../car-list/car-list.component';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CarServiceService } from '../car-service.service';

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
      next: (data) => this.cars = data,
      error: (e) => console.error("an error trying to get cars: ", e),
      complete: () => console.log("complete")
    });
  }


  //fetch will be handled later when the api part is set up

  handleSubmitCar($event: CarInterface) {
    if ($event.id > 0) {
      this.carService.updateCar($event, $event.id).subscribe({
        next: (updatedCar) => {
          console.log("Car updated: " + JSON.stringify(updatedCar))
          const index = this.cars.findIndex(car => car.id === updatedCar.id);
          if (index !== -1) this.cars[index] = updatedCar;
        },
        error: (e) => console.error("An error during update: ", e),
        complete: () => "update finished"
      })
    } else {
      this.carService.createCar($event).subscribe({
        next: (newCar) => {
          newCar.id = this.cars.length + 1
          console.log("Car created: ", newCar)
          this.cars.push(newCar)
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

