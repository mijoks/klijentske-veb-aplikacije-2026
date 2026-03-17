import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from "@angular/router";
import { ToyModel } from '../models/toy.model';
import { ToyService } from '../services/toy.service';
import { MatCardModule } from '@angular/material/card';
import { Utils } from '../utils';
import { Loading } from '../loading/loading';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { MatFormField, MatLabel, MatSelect, MatOption } from "@angular/material/select";
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-home',
  imports: [MatButtonModule,
    RouterLink,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    Loading,
    FormsModule,
    MatIconModule, MatFormField, MatLabel, MatSelect, MatOption],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  search = '';
  selectedCategory = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  toys = signal<ToyModel[]>([]);
  filteredToys = signal<ToyModel[]>([]);

  constructor(public utils: Utils) {
    this.loadToys()
  }

  async loadToys() {
    try {
      const rsp = await ToyService.getToys();
      this.toys.set(rsp.data);
      this.filteredToys.set(rsp.data);
    } catch (error) {
      console.error('Greška pri učitavanju igračaka:', error);
    }
  }
  get isLoggedIn(): boolean {
    return !!AuthService.getActiveUser();
  }
  getCategories() {
    const set = new Set<string>();

    this.toys().forEach(t => {
      if (t.type && t.type.name) {
        set.add(t.type.name);
      }
    });
    return Array.from(set);
  }
  filter() {
    const filtered = this.toys().filter(toy => {

      const matchesSearch = this.search === '' ||
        toy.name.toLowerCase().includes(this.search.toLowerCase());


      const matchesCategory = this.selectedCategory === '' ||
        toy.type.name === this.selectedCategory;


      const matchesMinPrice = !this.minPrice || toy.price >= this.minPrice;
      const matchesMaxPrice = !this.maxPrice || toy.price <= this.maxPrice;

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;

    });

    this.filteredToys.set(filtered);
  }
}
