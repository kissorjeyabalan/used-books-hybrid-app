import {Book} from '../common/types';

export class SalesItem {
  constructor(
    public title: string,
    public book: Book,
    public location: string,
    public imgUrl: string,
    public seller: string,
    public uid: string,
    public id?: string
  ) {}
}
