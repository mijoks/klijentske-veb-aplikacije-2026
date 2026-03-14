import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { Loading } from '../loading/loading';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Alerts } from '../alerts';
import { ToyModel } from '../models/toy.model';
import { AuthService } from '../services/auth.service';
import { ToyService } from '../services/toy.service';
import { Utils } from '../utils';

@Component({
  selector: 'app-user',
  imports: [
     MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatListModule,
    MatSelectModule,
    Loading,
    RouterLink
  ],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  
  public activeUser = AuthService.getActiveUser();
  toys = signal<ToyModel[]>([]); // Svi nazivi za select listu
  recommended = signal<ToyModel[]>([]); // Preporučene igračke
  oldPassword = '';
  newPassword = '';
  passRepeat = '';

  constructor(private router: Router, public utils: Utils) {
    if (!this.activeUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Učitaj sve igračke za dropdown
    ToyService.getToys().then(rsp => {
      this.toys.set(rsp.data);
      
      // Filtriraj preporuke: igračke koje su istog tipa kao korisnikova omiljena
      const favoriteToyName = this.activeUser?.toy;
      const favToy = rsp.data.find(t => t.name === favoriteToyName);
      
      if (favToy) {
        const recs = rsp.data.filter(t => t.type.typeId === favToy.type.typeId && t.name !== favToy.name);
        this.recommended.set(recs.slice(0, 3)); // Uzmi top 3 preporuke
      }
    });
  }

  getAvatarUrl() {
    return `https://ui-avatars.com/api/?name=${this.activeUser?.firstName}+${this.activeUser?.lastName}&background=3f51b5&color=fff`;
  }

  updateUser() {
    Alerts.confirm('Da li ste sigurni da želite da ažurirate podatke?', () => {
      // Ovde bi trebalo da imaš metodu u AuthService koja ažurira localStorage
      AuthService.updateActiveUser(this.activeUser!);
      Alerts.success('Podaci su uspešno ažurirani');
    });
  }

  updatePassword() {
    Alerts.confirm('Promena lozinke?', () => {
      if (this.oldPassword !== this.activeUser?.password) {
        Alerts.error('Stara lozinka nije ispravna');
        return;
      }
      if (this.newPassword.length < 6) {
        Alerts.error('Lozinka mora imati bar 6 karaktera');
        return;
      }
      if (this.newPassword !== this.passRepeat) {
        Alerts.error('Lozinke se ne podudaraju');
        return;
      }

      AuthService.updateActiveUserPassword(this.newPassword);
      Alerts.success('Lozinka promenjena. Molimo prijavite se ponovo.');
      AuthService.logout();
      this.router.navigate(['/login']);
    });
  }
}

