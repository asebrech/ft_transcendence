import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-member-option',
  templateUrl: './member-option.component.html',
  styleUrls: ['./member-option.component.scss']
})
export class MemberOptionComponent implements OnInit {

	@Output() valueChanged = new EventEmitter<boolean>();
	@Output() divHeight = new EventEmitter<number>();
	@ViewChild('maDiv') maDiv: ElementRef;

	isAdmin: boolean = true;


  constructor() { }

  ngOnInit(): void {
}

ngAfterViewInit() {
	  this.divHeight.emit(this.maDiv.nativeElement.offsetHeight);
  }

  onClick() {
	this.valueChanged.emit(false);
}

  changePass() {
	console.log('changePass');
}

leaveChannel() {
	console.log('leaveChannel');
}

deleteChannel() {
	console.log('deleteChannel');
}

}
