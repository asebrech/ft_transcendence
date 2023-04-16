import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class DashboardService {
	find: boolean = false;
	channel: boolean = true;
	create: boolean = false;
	members: boolean = false;
	addUsers: boolean = false;
	changePass: boolean = false;



	constructor() { }


}
