import EEmitter from 'events';
import TypedEmitter from 'typed-emitter';

export class EventEmitter<IEvents> {
  events: TypedEmitter<IEvents>;

  constructor() {
    this.events = (new EEmitter() as unknown) as TypedEmitter<IEvents>;
  }
}
