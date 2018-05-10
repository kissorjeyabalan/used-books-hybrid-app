import {Message} from './message';

export class ChatRoom {
  constructor(
    public participant1: string,
    public participant2: string,
    public messages: Message[],
    public lastMessage: string,
    public id?: string
  ) {}
}
