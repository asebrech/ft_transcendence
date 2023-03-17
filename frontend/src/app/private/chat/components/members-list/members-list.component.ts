import { Component, ElementRef, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard-service/dashboard-service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit {

	switchMenue: boolean = false;
	imagePath1 = "../../../../../../assets/images/close.png";
	imagePath2 = "../../../../../../assets/images/arrow-down-sign-to-navigate.png";

	selectedUser: any;
	isClicked = false;
	connected: boolean = true;

	users = [
		{ name: 'Mago' },
		{ name: 'Ramzi' },
		{ name: 'Wanis' },
		{ name: 'Mago' },
		{ name: 'Ramzi' },
		{ name: 'Wanis' },
		{ name: 'Mago' },
		{ name: 'Ramzi' },
		{ name: 'Wanis' },
		{ name: 'Mago' },
		{ name: 'Ramzi' },
		{ name: 'Wanis' },
		{ name: 'Mago' },
		{ name: 'Ramzi' },
		{ name: 'Wanis' }
	  ];

  constructor(private elementRef: ElementRef, public dashService: DashboardService) { }

  ngOnInit(): void {
  }

  test() {
	console.log('fonctionne');
  }

}
