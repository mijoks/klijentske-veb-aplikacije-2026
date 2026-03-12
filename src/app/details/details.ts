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

@Component({
  selector: 'app-details',
  imports: [MatCardModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    Loading,
    ],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  toy = signal<ToyModel | null>(null)
  constructor(route: ActivatedRoute, public utils: Utils, private sanitizer: DomSanitizer) {
    route.params.subscribe(params => {
      const id = params['id']
      ToyService.getToyById(id)
        .then(rsp => this.toy.set(rsp.data))
    })
  }


}
