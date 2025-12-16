import { Component } from '@angular/core';
import { SidebarComponent } from '../../../../shared/sidebars/sidebar-component/sidebar-component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar-usuario-fiet-component',
  imports: [SidebarComponent],
  templateUrl: './side-bar-usuario-fiet-component.html',
  styleUrl: './side-bar-usuario-fiet-component.css'
})
export class SideBarUsuarioFietComponent {
  constructor(private router: Router){}

  onSidebarButtonClick(route: string) {
    this.router.navigate([route]);
  }
}
