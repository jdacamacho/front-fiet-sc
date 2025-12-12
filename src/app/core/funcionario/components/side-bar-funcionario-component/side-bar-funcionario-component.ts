import { Component } from '@angular/core';
import { SidebarComponent } from '../../../../shared/sidebars/sidebar-component/sidebar-component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar-funcionario-component',
  imports: [SidebarComponent],
  templateUrl: './side-bar-funcionario-component.html',
  styleUrl: './side-bar-funcionario-component.css'
})
export class SideBarFuncionarioComponent {
  constructor(private router: Router){}

  onSidebarButtonClick(route: string) {
    this.router.navigate([route]);
  }
}
