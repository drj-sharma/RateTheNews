import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {
  private op = new BehaviorSubject(false);
  action = this.op.asObservable();

  constructor() { }
  
  sendAction(op: boolean) {
    this.op.next(op);
  }
}
