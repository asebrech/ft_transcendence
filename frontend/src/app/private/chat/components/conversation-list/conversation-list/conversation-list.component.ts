import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard-service/dashboard-service';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss']
})
export class ConversationListComponent implements OnInit {

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

  constructor(public dashService: DashboardService) { }

  ngOnInit(): void {
  }

  test() {
	console.log('fonctionne');
  }

}
