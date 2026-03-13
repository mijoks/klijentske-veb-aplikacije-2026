import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterOutlet,
    RouterLinkWithHref,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public authService = AuthService

  constructor(private router: Router) {}

  doLogout() {
    AuthService.logout()
    this.router.navigate(['/login'])
  }
}
