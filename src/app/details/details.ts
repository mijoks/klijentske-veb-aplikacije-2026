import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Loading } from '../loading/loading';
import { MatListModule } from '@angular/material/list';
import { ToyModel } from '../models/toy.model';
import { Utils } from '../utils';
import { DomSanitizer } from '@angular/platform-browser';
import { ToyService } from '../services/toy.service';
import { AuthService } from '../services/auth.service';
import { MatFormField, MatLabel } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Alerts } from '../alerts';
import { OrderModel } from '../models/order.model';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [MatCardModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    MatButtonModule,
    Loading,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  quantity = signal<number>(1);
  toy = signal<ToyModel | null>(null)

  get isLoggedIn(): boolean {
    return AuthService.getActiveUser() !== null;
  }

  constructor(
    route: ActivatedRoute,
    public utils: Utils,
    private sanitizer: DomSanitizer,
    
  ) {
    route.params.subscribe(params => {
      const id = params['id'];
      ToyService.getToyById(id)
        .then(rsp => this.toy.set(rsp.data));
    });
  }

  buyToy() {
    const user = AuthService.getActiveUser();
    const currentToy = this.toy();

    if (!user || !currentToy) return;

    const order: OrderModel = {
      toyId: currentToy.toyId,
      name: currentToy.name,
      price: currentToy.price,
      count: this.quantity(),
      typeId: currentToy.type.typeId,
      targetGroup: currentToy.targetGroup,
      createdAt: Date.now(),
      status: 'r'
    };

   
    if (!user.toys || !Array.isArray(user.toys)) {
      user.toys = [] as any;
    }

    
    (user.toys as any[]).push(order);

    
    AuthService.updateActiveUser(user);

    Alerts.success(`Dodato u korpu: ${this.quantity()} ${this.quantity() === 1 ? 'komad' : 'komada'}`);
  }
  getRating() {
    const currentToy = this.toy();
    if (!currentToy) return { average: null, count: 0 };
    return DataService.getToyRating(`${currentToy.toyId}`);
  }

}
