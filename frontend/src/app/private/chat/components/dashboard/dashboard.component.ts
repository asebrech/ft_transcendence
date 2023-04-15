import { AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat.service';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { DashboardService } from '../../services/dashboard-service/dashboard-service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

	constructor(public dashService: DashboardService, private elementRef: ElementRef, private chatService: ChatService) { }

	@HostListener('document:click', ['$event'])
	onClick(event: MouseEvent) {
		if (!this.dashService.find && this.elementRef.nativeElement.querySelector('.search-container') && this.elementRef.nativeElement.querySelector('.search-container').contains(event.target)) {
			this.dashService.find = true;
		}
		else if (this.dashService.find && this.elementRef.nativeElement.querySelector('.search-container') && !this.elementRef.nativeElement.querySelector('.findChannel').contains(event.target)) {
			this.dashService.find = false;
		}
		if (!this.dashService.create && this.elementRef.nativeElement.querySelector('.add') && this.elementRef.nativeElement.querySelector('.add').contains(event.target)) {
			this.dashService.create = true;
		}
		else if (this.dashService.create && this.elementRef.nativeElement.querySelector('.add') && !this.elementRef.nativeElement.querySelector('.createChannel').contains(event.target)) {
			this.dashService.create = false;
		}
	}

	ngOnInit(): void {
		const storedData = localStorage.getItem('members');
		if (storedData) {
			const myData = JSON.parse(storedData);
			this.dashService.members = myData;
		}
	}

}
