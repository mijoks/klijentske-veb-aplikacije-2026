import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from "@angular/router";
import { ToyModel } from '../models/toy.model';
import { ToyService } from '../services/toy.service';
import { MatCardModule } from '@angular/material/card';
import { Utils } from '../utils';
import { Loading } from '../loading/loading';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-home',
  imports: [MatButtonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    Loading,
  MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  toys = signal<ToyModel[]>([])

  constructor(public utils: Utils) {
    this.loadToys()
  }

  async loadToys() {
    try {
      const rsp = await ToyService.getToys();
      this.toys.set(rsp.data);
    } catch (error) {
      console.error('Greška pri učitavanju igračaka:', error);
    }
  }
}
