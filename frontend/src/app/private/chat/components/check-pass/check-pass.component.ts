import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-check-pass',
  templateUrl: './check-pass.component.html',
  styleUrls: ['./check-pass.component.scss']
})
export class CheckPassComponent implements OnInit {

	message: string = '';


  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
	if (this.message) {
		console.log(this.message);
		this.message = '';
	}
  }
}
