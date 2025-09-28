import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-usuario-content-component',
  templateUrl: './info-usuario-content-component.html',
  styleUrl: './info-usuario-content-component.css',
  imports: [CommonModule]
})
export class InfoUsuarioContentComponent implements OnInit {
  usuario: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.usuario$.subscribe(user => {
      this.usuario = user;
    });
  }
}
