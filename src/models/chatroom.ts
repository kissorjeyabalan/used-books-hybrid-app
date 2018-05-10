import {Message} from './message';

export class ChatRoom {
  constructor(
    public participants: {[key: string]: boolean},
    public messages: Message[],
    public lastMessage: string,
    public id?: string
  ) {}
}
