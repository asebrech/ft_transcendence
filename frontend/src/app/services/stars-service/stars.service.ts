import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StarsService {

	private active = true;
	private enable = true;

  
	setActive(active: boolean): void {
		setTimeout(() => {this.active = active, 0})
	  }
	
	  isActive(): boolean {
		return this.active;
	  }
	
	  setEnable(enable: boolean): void {
		setTimeout(() => {this.enable = enable, 0})
	  }
	

  isEnable(): boolean {
	return this.enable;
  }
}
