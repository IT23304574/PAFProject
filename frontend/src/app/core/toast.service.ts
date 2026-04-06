import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message = '';

  show(msg: string) {
    this.message = msg;
    setTimeout(() => {
      if (this.message === msg) this.message = '';
    }, 4000);
  }
}

