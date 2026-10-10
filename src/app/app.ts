import { Component, signal } from '@angular/core';
import { RoleLibrary } from "./pages/role-library/role-library";
import { Header } from './components/header/header';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
