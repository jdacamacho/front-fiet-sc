import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-barra-busqueda-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './barra-busqueda-component.html',
  styleUrl: './barra-busqueda-component.css'
})
export class BarraBusquedaComponent {
  @Input() placeholder: string = 'Buscar...';
  @Input() value: string = ''; 
  @Output() valueChange = new EventEmitter<string>(); 

  onInputChange() {
    this.valueChange.emit(this.value);
  }
}
