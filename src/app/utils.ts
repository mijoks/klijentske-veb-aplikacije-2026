import { ToyModel } from "./models/toy.model";
import { ToyService } from "./services/toy.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class Utils{
    getImageUrl(toy:ToyModel){
        return `https://toy.pequla.com${toy.imageUrl}`;
    }
}