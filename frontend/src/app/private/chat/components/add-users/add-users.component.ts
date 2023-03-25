import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DashboardService } from '../../services/dashboard-service/dashboard-service';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {

  searchTerm: string;
	searchResults: any[] = [
		{ name: 'John', age: 30 },
		{ name: 'Jane', age: 25 },
		{ name: 'Bob', age: 40 },
		{ name: 'Alice', age: 20 },
		{ name: 'Dave', age: 45 },
		{ name: 'Maria', age: 35 },
		{ name: 'Peter', age: 27 },
		{ name: 'Lucy', age: 32 },
		{ name: 'Mike', age: 38 },
		{ name: 'Sara', age: 42 },
		{ name: 'Alex', age: 23 },
		{ name: 'Chris', age: 31 },
		{ name: 'Diana', age: 29 },
		{ name: 'Eric', age: 34 },
		{ name: 'Fiona', age: 22 },
		{ name: 'Greg', age: 37 },
		{ name: 'Hannah', age: 26 },
		{ name: 'Isaac', age: 39 },
		{ name: 'Julia', age: 28 },
		{ name: 'Kevin', age: 33 }

	];
	filteredResults: any[];

	private searchTerms = new Subject<string>();

	@ViewChild('searchInput') searchInput: ElementRef;

	constructor(private elementRef: ElementRef, private dashService: DashboardService) { }

	ngOnInit(): void {
		this.searchTerms.subscribe(() => this.search());
		setTimeout(() => {
			this.searchInput.nativeElement.focus();
		}, 0);
		this.searchTerms.next(null);
	}

	search() {
		if (!this.searchTerm) {
			this.filteredResults = this.searchResults;
		} else {
			this.filteredResults = this.searchResults.filter(result =>
				result.name.toLowerCase().includes(this.searchTerm.toLowerCase())
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
    console.log('Selected users:', selectedUsers);
	this.dashService.addUsers = false;
  }
}
