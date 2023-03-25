import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class DashboardService {
	channel: boolean = true;
	create: boolean = false;
	members: boolean = false;
	addUsers: boolean = false;




	constructor() { }


}
