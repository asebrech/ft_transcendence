import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
