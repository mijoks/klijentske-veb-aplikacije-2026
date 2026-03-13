import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { UserModel } from '../models/user.model';
import { ToyService } from '../services/toy.service';
import { ToyModel } from '../models/toy.model';
import { AuthService } from '../services/auth.service';
import { Alerts } from '../alerts';

@Component({
  selector: 'app-signup',
  imports: [MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    RouterLink,
    MatSelectModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  user: Partial<UserModel> = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    password: '',
    toy: ''
  }
  repeat: string = ''
  toys = signal<ToyModel[]>([]);

  constructor(public router: Router) {
    ToyService.getToys()
      .then(rsp => this.toys.set(rsp.data))
  }

  doSignup() {
    if (AuthService.existsByEmail(this.user.email!)) {
      Alerts.error('Email already registred!')
      return
    }

    if (this.user.firstName == '' || this.user.lastName == '' || this.user.address == '' || this.user.toy == '' || this.user.phone == '') {
      Alerts.error('All fields should have a value!')
      return
    }

    if (this.user.password!.length < 6) {
      Alerts.error('Password must be at least 6 chars long!')
      return
    }

    if (this.user.password !== this.repeat) {
      Alerts.error('Passwords dont match!')
      return
    }

    console.log(this.user)
    AuthService.createUser(this.user)
    this.router.navigate(['/login'])
  }

}
