import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

import { CarInterface } from '../car-interface';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';


interface CarFormGroup{
  brand:string,
  model:string,
  price:number,
  year: string,
  reserved:boolean,

}

@Component({
  selector: 'app-car-list',
  standalone: true,
  providers:[provideNativeDateAdapter(), {provide: MAT_DATE_LOCALE, useValue: 'de'}],
  imports: [
    DatePipe, MatFormFieldModule, MatInputModule, MatDatepickerModule, 
    ReactiveFormsModule,MatSelectModule, MatButtonModule,MatTableModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.css'
})
export class CarListComponent {
  
  displayedColumns: string[] = ['brand', 'model','price', 'year', 'reserved', 'operations']

  carForm = new FormGroup({
    brand: new FormControl('', [Validators.minLength(1), Validators.maxLength(20)]),
    model: new FormControl('', [Validators.minLength(1), Validators.maxLength(20)]),
    price: new FormControl(0, [Validators.min(0)]),
    year: new FormControl(new Date().toISOString()),
    reserved: new FormControl<string>("", Validators.required),
  }, {updateOn: 'change'})
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
  
  handleFormChange($event: Event) {
    console.log($event)
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
    console.log(`this.car: ${this.car.reserved}, this.carForm: ${this.carForm.value.reserved}`)
    this.car = {
      id: this.car.id,
      brand: this.carForm.value.brand!,
      model: this.carForm.value.model!,
      price: this.carForm.value.price!,
      year: this.carForm.value.year!,
      reserved: this.carForm.value.reserved === "true"? true: false
    }
    console.log(`this.car: ${this.car.reserved}, this.carForm: ${this.carForm.value.reserved}`)

    this.submittedCar.emit(this.car);
    
    this.car = {id: -1, brand: "", model: "", year: this.formatDateToYYYMMDD(new Date()), price: 0, reserved: undefined};
    this.carForm.reset();
  
  }

  onEdit(id: number) {
    const result = this.carlist.find(car => car.id === id);
    console.log(result)
    if (result === undefined) {
      this.car = {id: -1,brand: "", model: "", year: new Date(), price: 0, reserved: undefined};
      this.carForm.reset();
    }
    else{
        this.car = {...result};
        this.carForm.setValue({
          brand: result.brand,
          model:result.model,
          price:result.price,
          reserved: result.reserved ? "true": "false",
          year:typeof result.year === "string"? result.year: new Date(result.year).toISOString() 
        });
      } //always forget about the referencial. Always create a shallow copy else you also reference the array.
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
