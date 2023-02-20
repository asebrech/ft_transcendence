import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StarsService {

	private active = true;
	private enable = true;

  setActive(active: boolean): void {
    this.active = active;
  }

  isActive(): boolean {
    return this.active;
  }

  setEnable(enable: boolean): void {
    this.enable = enable;
  }

  isEnable(): boolean {
	return this.enable;
  }
}
