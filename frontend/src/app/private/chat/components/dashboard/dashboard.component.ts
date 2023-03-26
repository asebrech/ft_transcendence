import { AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat.service';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { RoomPaginateI } from 'src/app/model/room.interface';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { DashboardService } from '../../services/dashboard-service/dashboard-service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {//implements OnInit, AfterViewInit {

	find: boolean = false;


	findChannel() {
		this.find = true;
	}

	HideChannel() {
		this.find = false;
	}

	createChannel() {
		this.dashService.create = true;
	}

	createHide() {
		this.dashService.create = false;
	}
	// rooms$: Observable<RoomPaginateI>= this.chatService.getMyRooms();
	// selectedRoom = null;
	// user: UserI = this.authService.getLoggedInUser();
	constructor(public dashService: DashboardService, private elementRef: ElementRef, private chatService: ChatService) { }

	//constructor(private chatService: ChatService, private authService: AuthService) { }

	@HostListener('document:click', ['$event'])
	onClick(event: MouseEvent) {
		if (!this.find && this.elementRef.nativeElement.querySelector('.search-container') && this.elementRef.nativeElement.querySelector('.search-container').contains(event.target)) {
			this.findChannel();
		}
		else if (this.find && this.elementRef.nativeElement.querySelector('.search-container') && !this.elementRef.nativeElement.querySelector('.findChannel').contains(event.target)) {
			this.HideChannel();
		}
		if (!this.dashService.create && this.elementRef.nativeElement.querySelector('.add') && this.elementRef.nativeElement.querySelector('.add').contains(event.target)) {
			this.createChannel();
		}
		else if (this.dashService.create && this.elementRef.nativeElement.querySelector('.add') && !this.elementRef.nativeElement.querySelector('.createChannel').contains(event.target)) {
			this.createHide();
		}
	}

	// ngOnInit() {
	// 	this.chatService.emitPaginateRooms(10, 0);

	// }

	// ngAfterViewInit() {
	// 	this.chatService.emitPaginateRooms(10, 0);
	// }

	// onSelectRoom(event: MatSelectionListChange) {
	// 	this.selectedRoom = event.source.selectedOptions.selected[0].value;
	// }

	// onPaginateRooms(pageEvent : PageEvent) {
	// 	this.chatService.emitPaginateRooms(pageEvent.pageSize, pageEvent.pageIndex);
	// }

}
