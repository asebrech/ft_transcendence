import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class LiveService 
{

  constructor() { }

  private myVarSubject = new Subject<string>();
  public myVar$ = this.myVarSubject.asObservable();

  getMyVar()
  {
    return this.myVar$;
  }
  setMyVar(value: string) 
  {
    
  }
}
