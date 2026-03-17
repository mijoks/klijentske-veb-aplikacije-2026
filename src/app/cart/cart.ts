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
    Alerts.confirm(`Da li ste sigurni da zelite da uklonite ${order.count} ${unit} igracke ${order.name}?`, () => {
      AuthService.cancelOrder(order.createdAt);
      this.reloadComponent();
    });
  }

  payAll() {
    Alerts.confirm(`Ukupan iznos za placanje je ${this.calculateTotal()} RSD. Da li zelite da potvrdite kupovinu?`, () => {
      AuthService.payOrders();
      this.reloadComponent();
    });
  }
  modifyOrder(order: OrderModel) {
    Swal.fire({
      title: `Izmena za ${order.name}`,
      input: 'number',
      inputLabel: 'Unesite novu kolicinu',
      inputValue: order.count,
      showCancelButton: true,
      confirmButtonText: 'Sačuvaj',
      cancelButtonText: 'Odustani',
      inputValidator: (value) => {
        if (!value || parseInt(value) < 1) {
          return 'Kolicina mora biti barem 1!';
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
            Alerts.success('Količina je izmenjena!');
          }
        }
      }
    });
  }

  calculateTotal() {
    return this.getOrders().reduce((acc, order) => acc + (order.price * order.count), 0);
  }


  getOrders() {
    return AuthService.getOrdersByState('r'); 
  }

  getPaidOrders() {
    return AuthService.getOrdersByState('p'); 
  }

  getCanceledOrders() {
    return AuthService.getOrdersByState('o'); 
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
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Odustani',
      didOpen: () => {

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


  private saveRating(order: OrderModel, rating: number) {
    const user = AuthService.getActiveUser();
    if (user && user.toys) {
      const toys = user.toys as OrderModel[];
      const target = toys.find(t => t.createdAt === order.createdAt);
      if (target) {
        target.rating = rating;
        AuthService.updateActiveUser(user);
        Alerts.success(`Ocenili ste igračku sa ${rating}!`);

        window.location.reload();
      }
    }
  }
}