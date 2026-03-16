import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { OrderModel } from '../models/order.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Utils } from '../utils';
import { Alerts, matCustomClass } from '../alerts';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatCardModule, MatTableModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  // Kolone koje prikazujemo u tabeli
  displayedColumns = ['name', 'type', 'targetGroup', 'count', 'price', 'total', 'options'];

  constructor(public router: Router, public utils: Utils) {
    if (!AuthService.getActiveUser()) {
      router.navigate(['/login']);
      return;
    }
  }

  reloadComponent() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/cart']);
    });
  }

  removeOrder(order: OrderModel) {
    const unit = order.count === 1 ? 'komad' : 'komada';
    Alerts.confirm(`Da li ste sigurni da želite da uklonite ${order.count} ${unit} igračke ${order.name}?`, () => {
      AuthService.cancelOrder(order.createdAt);
      this.reloadComponent();
    });
  }

  payAll() {
    Alerts.confirm(`Ukupan iznos za plaćanje je ${this.calculateTotal()} RSD. Da li želite da potvrdite kupovinu?`, () => {
      AuthService.payOrders(); // Menja status iz 'r' u 'p'
      this.reloadComponent();
    });
  }
  modifyOrder(order: OrderModel) {
  Swal.fire({
    title: `Izmjena za ${order.name}`,
    input: 'number',
    inputLabel: 'Unesite novu količinu',
    inputValue: order.count,
    showCancelButton: true,
    confirmButtonText: 'Sačuvaj',
    cancelButtonText: 'Odustani',
    inputValidator: (value) => {
      if (!value || parseInt(value) < 1) {
        return 'Količina mora biti barem 1!';
      }
      return null;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const newCount = parseInt(result.value);
      const user = AuthService.getActiveUser();
      
      if (user && user.toys) {
        const target = (user.toys as OrderModel[]).find(t => t.createdAt === order.createdAt);
        if (target) {
          target.count = newCount;
          AuthService.updateActiveUser(user);
          this.reloadComponent();
          Alerts.success('Količina je izmijenjena!');
        }
      }
    }
  });
}

  calculateTotal() {
    return this.getOrders().reduce((acc, order) => acc + (order.price * order.count), 0);
  }

  // Pomoćne metode za prikaz podataka u tabeli
  getOrders() {
    return AuthService.getOrdersByState('r'); // Rezervisano
  }

  getPaidOrders() {
    return AuthService.getOrdersByState('p'); // Pristiglo
  }

  getCanceledOrders() {
    return AuthService.getOrdersByState('o'); // Otkazano
  }

  getTypeName(order: OrderModel) {
    return DataService.getToyTypeById(order.typeId).name;
  }
  rateOrder(order: OrderModel) {
  Swal.fire({
    title: 'Ocenite igračku',
    html: `
      <div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px;">
        <button id="rate-1" class="swal2-confirm swal2-styled" style="background-color: #ffd700; color: black;">1</button>
        <button id="rate-2" class="swal2-confirm swal2-styled" style="background-color: #ffd700; color: black;">2</button>
        <button id="rate-3" class="swal2-confirm swal2-styled" style="background-color: #ffd700; color: black;">3</button>
        <button id="rate-4" class="swal2-confirm swal2-styled" style="background-color: #ffd700; color: black;">4</button>
        <button id="rate-5" class="swal2-confirm swal2-styled" style="background-color: #ffd700; color: black;">5</button>
      </div>
    `,
    showConfirmButton: false, // Sakrivamo glavno dugme jer koristimo svoja
    showCancelButton: true,
    cancelButtonText: 'Odustani',
    didOpen: () => {
      // Dodajemo klik event na svako dugme nakon što se Swal otvori
      [1, 2, 3, 4, 5].forEach(num => {
        const btn = document.getElementById(`rate-${num}`);
        btn?.addEventListener('click', () => {
          this.saveRating(order, num);
          Swal.close();
        });
      });
    }
  });
}

// Pomoćna funkcija za čuvanje (da ne ponavljamo kod)
private saveRating(order: OrderModel, rating: number) {
  const user = AuthService.getActiveUser();
  if (user && user.toys) {
    const toys = user.toys as OrderModel[];
    const target = toys.find(t => t.createdAt === order.createdAt);
    if (target) {
      target.rating = rating;
      AuthService.updateActiveUser(user);
      Alerts.success(`Ocenili ste igračku sa ${rating}!`);
      // Osvežavamo tabelu
      window.location.reload(); 
    }
  }
}
}