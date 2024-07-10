import { Component, Input } from '@angular/core';
import { CarInterface } from '../car-interface';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [],
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.css'
})
export class CarListComponent {
  @Input() carlist: Array<CarInterface> = [];
}
