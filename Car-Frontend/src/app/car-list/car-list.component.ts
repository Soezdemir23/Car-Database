import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarInterface } from '../car-interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.css'
})
export class CarListComponent {
  car:CarInterface = {
    id: -1,
    brand: "",
    model: "",
    year: this.formatDateToYYYMMDD(new Date()),
    price: 0,
    reserved: undefined
  };
  @Input() carlist: Array<CarInterface> = [];
  @Input() listTitle: string="";
  @Output() submittedCar = new EventEmitter<any>();
  @Output() deleteCar = new EventEmitter<number>();


  formatDateToYYYMMDD(date:Date) {
    const d = new Date(date);
    let month = ''+ (d.getMonth()+1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2 ) month = '0' + month;
    if (day.length < 2) day = '0'+ day;

    return [year, month, day].join('-')
  }
  handleFormChange($event: Event): void {
    const { name, value } = $event.target as HTMLInputElement;
    // Rest of the code...
    switch (name) {
      case "model":
          this.car.model = value;
        break;
      case "brand":
          this.car.brand = value;
        break;
        case "price":
          this.car.price = parseInt(value);
        break;
        case "year":
        
          this.car.year = this.formatDateToYYYMMDD(new Date(value));
        break;
        case "reserved":
          this.car.reserved = value === "true" ? true : false;
          break;
      default:
        console.error("Fallthrough: "+ name + ":"+ value);
        break;
    }
  }


  handleSubmit($event:Event){
    $event.preventDefault();

    this.submittedCar.emit(this.car);

    // if (this.car.id >0){
    //   this.carlist = this.carlist.map(item => item.id === this.car.id ? this.car: item);
    //   this.selectedCar.emit(this.car);
    // }else {
    //   this.car.id = this.carlist.length+1;
    //   this.carlist.push(this.car);
    //   this.selectedCar.emit(this.car);
    //   console.log("Car created: "+ JSON.stringify(this.car))
    // }
    this.car = {id: -1, brand: "", model: "", year: this.formatDateToYYYMMDD(new Date()), price: 0, reserved: undefined};
  }

  onEdit(id: number) {
    const result = this.carlist.find(car => car.id === id);
    if (result === undefined) this.car = {id: -1,brand: "", model: "", year: new Date(), price: 0, reserved: undefined};
    else this.car = {...result}; //always forget about the referencial. Always create a shallow copy else you also reference the array.
    if (typeof this.car.year !== "string" ) this.car.year= this.formatDateToYYYMMDD(this.car.year);

  }

  onDelete(id: number) {
    this.deleteCar.emit(id);
  //  this.carlist= this.carlist.filter(car => car.id !== id);
  //  this.selectedCar.emit(this.car);
  }

  onCancel($event: Event): void {
    $event.preventDefault();
    this.car = {
      brand: "", model: "", id: -1, year: new Date(), price: 0, reserved: undefined
    }
  }
}
