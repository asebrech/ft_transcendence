import { Component, OnInit } from '@angular/core';
import { StarsService } from 'src/app/services/stars-service/stars.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private starsService: StarsService) { }

  ngOnInit(): void {
  }

  disableDiv() {
    this.starsService.setActive(false);
  }

  enableDiv() {
    this.starsService.setActive(true);
  }

  switchBack1() {
    this.starsService.setEnable(true);
  }

  switchBack2() {
    this.starsService.setEnable(false);
  }

}
