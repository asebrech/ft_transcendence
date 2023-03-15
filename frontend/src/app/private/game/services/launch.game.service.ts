import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LaunchGameService 
{
  hideW : number = 0;
  launch : number = 0;
  button_show : number = 0;
  found : number = 0;

  constructor() 
  {
  }

  showButtonOn(nbr : number)
  {
    this.button_show = nbr;
  }
  showButtonStats()
  {
    return this.button_show;
  }
  hideWRet()
  {
    return this.hideW;
  }

  hideWaiting(hideWaiting : number)
  {
    hideWaiting += 1;
    this.hideW = hideWaiting;
    return hideWaiting;
  }
  launchGame()
  {
    this.launch += 1;
  }
  launchGameRet()
  {
    return this.launch;
  }

  gameFound()
  {
    this.found = 1;
  }
  gameFoundRet()
  {
    return this.found
  }
}
