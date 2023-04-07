import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DashboardService } from '../../services/dashboard-service/dashboard-service';
import { UserService } from 'src/app/public/services/user-service/user.service';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {

  searchTerm: string;
	searchResults$: Observable<UserI[]>= this.chatService.getUsers();


	filteredResults: any[] = [];
 	user: UserI = this.authService.getLoggedInUser();


	private searchTerms = new Subject<string>();

	@ViewChild('searchInput') searchInput: ElementRef;

	constructor(private elementRef: ElementRef, private dashService: DashboardService, private userService: UserService, private authService: AuthService, private chatService: ChatService) { }

	ngOnInit(): void {
		this.searchTerms.subscribe(() => this.search());
		setTimeout(() => {
			this.searchInput.nativeElement.focus();
		}, 0);
		this.searchTerms.next(null);
	}

	search() {
		this.chatService.listUsers();
		if (!this.searchTerm) {
			this.searchResults$.subscribe(user => this.filteredResults = user);
		} else {
			this.searchResults$.subscribe(users => this.filteredResults = users.filter(result =>
				result.username.toLowerCase().includes(this.searchTerm.toLowerCase()))
			);
		}
	}

	searchOnKeyUp(event: Event): void {
		const term = (event.target as HTMLInputElement).value;
		this.searchTerms.next(term);
	}

	selectedUsers: any[] = [];

	atLeastOneSelected(): boolean {
		return this.filteredResults.some(result => result.selected);
	  }

  onSubmit() {
    const selectedUsers = this.filteredResults.filter(result => result.selected);
	for(let selectedUser of selectedUsers) {
		delete selectedUser.selected;
	}
	this.chatService.addUsers(selectedUsers);
	this.dashService.addUsers = false;
	this.chatService.listMember();
  }
}
