import {Pipe} from '@angular/core';

@Pipe({
  name: 'stripEmail'
})
export class StripEmail {
  transform(value) {
    return value.substring(0, value.indexOf('@usedbooks.tds'));
  }
}
