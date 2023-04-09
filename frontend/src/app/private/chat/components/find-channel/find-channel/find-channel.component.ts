import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, debounceTime } from 'rxjs';
import { ChatService } from '../../../services/chat-service/chat.service';
import { RoomI } from 'src/app/model/room.interface';
import { UserI } from 'src/app/model/user.interface';
import { DashboardService } from '../../../services/dashboard-service/dashboard-service';

@Component({
	selector: 'app-find-channel',
	templateUrl: './find-channel.component.html',
	styleUrls: ['./find-channel.component.scss']
})
export class FindChannelComponent implements OnInit {
	searchTerm: string;
	searchResults$: Observable<RoomI[]> = this.chatService.getAllChannels();
	filteredResults: RoomI[];

	private searchTerms = new Subject<string>();

	@ViewChild('searchInput') searchInput: ElementRef;

	constructor(private elementRef: ElementRef, private chatService: ChatService, private dashService: DashboardService) { }

	ngOnInit(): void {
		this.searchTerms.subscribe(() => this.search());
		setTimeout(() => {
			this.searchInput.nativeElement.focus();
		}, 0);
		this.searchTerms.next(null);
	}

	search() {
		this.chatService.listAllChannels();
		if (!this.searchTerm) {
			this.searchResults$.subscribe(result => this.filteredResults = result);
		} else {
			this.searchResults$.subscribe(result => this.filteredResults = result.filter(result =>
				result.name.toLowerCase().includes(this.searchTerm.toLowerCase())
			));
		}
	}

	searchOnKeyUp(event: Event): void {
		const term = (event.target as HTMLInputElement).value;
		this.searchTerms.next(term);
	}

	onClick(room: RoomI) {
		this.dashService.find = false;
		this.chatService.addUserToRoom(room);
	}

}
