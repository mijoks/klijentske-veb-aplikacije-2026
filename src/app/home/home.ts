import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from "@angular/router";
import { ToyModel } from '../models/toy.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink,MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  toys = signal<ToyModel[]>([])
}
