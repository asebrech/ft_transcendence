import { Component, OnInit } from '@angular/core';
import { StarsService } from 'src/app/services/stars-service/stars.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

	switch = true;

  constructor(private starsService: StarsService) { }

  ngOnInit(): void {
  }

  disableDiv() {
    this.starsService.setActive(false);
  }

  enableDiv() {
    this.starsService.setActive(true);
  }

  switchBack() {
	(this.switch) ? this.switch = false : this.switch = true;
    this.starsService.setEnable(this.switch);
  }

}
