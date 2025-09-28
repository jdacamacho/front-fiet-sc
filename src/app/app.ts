import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  loading = true;
  token: string | null = null;

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage){
      this.token = localStorage.getItem('authToken');

      setTimeout(() => {
        this.loading = false;
      }, 200);
    }
  }
}
