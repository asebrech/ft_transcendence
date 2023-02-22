import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { StarsService } from './services/stars-service/stars.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public service: StarsService) {}

}
