import { Component, signal } from '@angular/core';
import { RoleLibrary } from "./pages/role-library/role-library";

@Component({
  selector: 'app-root',
  imports: [RoleLibrary],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
