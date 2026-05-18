import { Component } from '@angular/core';
import { CategoriaComponent } from './pages/categoria/categoria.component';

@Component({
  selector: 'app-root',
  imports: [CategoriaComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}