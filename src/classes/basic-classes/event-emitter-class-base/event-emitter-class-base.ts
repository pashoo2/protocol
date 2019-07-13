import EEmitter from 'events';
import './events';
import {
  TypedEventEmitter,
  TEventsList,
} from './event-emitter-class-base.types';

export class EventEmitter<IEvents extends TEventsList> extends EEmitter
  implements TypedEventEmitter<IEvents> {}
