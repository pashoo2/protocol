import { forwardEvents, stopForwardEvents } from './event-emitter-class-with-forwarding.utils';
import { getEventEmitterInstance } from './event-emitter-class-base';

describe('Event emitter forwarding events utils', () => {
  describe('forwardEvents utility', () => {
    it('Should emit events from source emitter to target emitter', () => {
      const eventName = 'TEST_EVENT_NAME';
      const sourceEventEmitter = getEventEmitterInstance<{ [eventName]: (...args: any[]) => void }>();
      const targetEventEmitter = getEventEmitterInstance<{ [eventName]: (...args: any[]) => void }>();

      forwardEvents(sourceEventEmitter, targetEventEmitter);
      let eventHasBeenListened = false;
      targetEventEmitter.addListener(eventName, () => {
        eventHasBeenListened = true;
      });
      sourceEventEmitter.emit(eventName);
      expect(eventHasBeenListened).toBe(true);
    });
    it('Should emit events on a source emitter also', () => {
      const eventName = 'TEST_EVENT_NAME';
      const sourceEventEmitter = getEventEmitterInstance<{ [eventName]: (...args: any[]) => void }>();
      const targetEventEmitter = getEventEmitterInstance<{ [eventName]: (...args: any[]) => void }>();

      forwardEvents(sourceEventEmitter, targetEventEmitter);
      let eventHasBeenListened = false;
      sourceEventEmitter.addListener(eventName, () => {
        eventHasBeenListened = true;
      });
      sourceEventEmitter.emit(eventName);
      expect(eventHasBeenListened).toBe(true);
    });
    it('Should emit events from source emitter to multiple target emitters', () => {
      const eventName = 'TEST_EVENT_NAME';
      const sourceEventEmitter = getEventEmitterInstance<{ [eventName]: (...args: any[]) => void }>();
      const firstTargetEventEmitter = getEventEmitterInstance<{ [eventName]: (...args: any[]) => void }>();
      const secondTargetEventEmitter = getEventEmitterInstance<{ [eventName]: (...args: any[]) => void }>();

      forwardEvents(sourceEventEmitter, firstTargetEventEmitter);
      forwardEvents(sourceEventEmitter, secondTargetEventEmitter);

      let firedOnFirstEmitter = false;
      let firedOnSecondEmitter = false;
      let firedOnSourceEmitter = false;

      firstTargetEventEmitter.addListener(eventName, () => {
        firedOnFirstEmitter = true;
      });
      secondTargetEventEmitter.addListener(eventName, () => {
        firedOnSecondEmitter = true;
      });
      sourceEventEmitter.addListener(eventName, () => {
        firedOnSourceEmitter = true;
      });
      sourceEventEmitter.emit(eventName);
      expect(firedOnFirstEmitter).toBe(true);
      expect(firedOnSecondEmitter).toBe(true);
      expect(firedOnSourceEmitter).toBe(true);
    });
    it('Should emit multiple events with arguments passed on a source emitter also', () => {
      let eventName = 'TEST_EVENT_NAME';
      let eventArgument = 'EVENT_ARGUMENT';
      const sourceEventEmitter = getEventEmitterInstance();
      const targetEventEmitter = getEventEmitterInstance();

      forwardEvents(sourceEventEmitter, targetEventEmitter);

      let eventHasBeenListenedWithArgument: unknown;

      sourceEventEmitter.addListener(eventName, (eventArgument) => {
        eventHasBeenListenedWithArgument = eventArgument;
      });
      sourceEventEmitter.emit(eventName, eventArgument);
      expect(eventHasBeenListenedWithArgument).toBe(eventArgument);

      eventName = 'TEST_EVENT_NAME_SECOND';
      eventArgument = 'EVENT_ARGUMENT_SECOND';
      sourceEventEmitter.addListener(eventName, (eventArgument) => {
        eventHasBeenListenedWithArgument = eventArgument;
      });
      sourceEventEmitter.emit(eventName, eventArgument);
      expect(eventHasBeenListenedWithArgument).toBe(eventArgument);
    });
    it('Should emit multiple events with multiple arguments passed on a source emitter also', () => {
      let eventName = 'TEST_EVENT_NAME';
      let eventArguments = ['EVENT_ARGUMENT_1', 'EVENT_ARGUMENT_2'];
      const sourceEventEmitter = getEventEmitterInstance();
      const targetEventEmitter = getEventEmitterInstance();

      forwardEvents(sourceEventEmitter, targetEventEmitter);

      let eventHasBeenListenedWithArgument: unknown;

      sourceEventEmitter.addListener(eventName, (eventArgument1, eventArgument2) => {
        eventHasBeenListenedWithArgument = [eventArgument1, eventArgument2];
      });
      sourceEventEmitter.emit(eventName, ...eventArguments);
      expect(eventHasBeenListenedWithArgument).toEqual(expect.arrayContaining(eventArguments));

      eventName = 'TEST_EVENT_NAME_SECOND';
      eventArguments = ['EVENT_2_ARGUMENT_1', 'EVENT_2_ARGUMENT_2'];
      sourceEventEmitter.addListener(eventName, (eventArgument1, eventArgument2) => {
        eventHasBeenListenedWithArgument = [eventArgument1, eventArgument2];
      });
      sourceEventEmitter.emit(eventName, ...eventArguments);
      expect(eventHasBeenListenedWithArgument).toEqual(expect.arrayContaining(eventArguments));
    });
  });

  describe('stopForwardEvents', () => {
    it('Should stop emit events from source emitter to target emitter', () => {
      let eventName = 'TEST_EVENT_NAME';
      const sourceEventEmitter = getEventEmitterInstance();
      const targetEventEmitter = getEventEmitterInstance();

      forwardEvents(sourceEventEmitter, targetEventEmitter);

      let eventHasBeenListened = false;

      targetEventEmitter.addListener(eventName, () => {
        eventHasBeenListened = true;
      });
      sourceEventEmitter.emit(eventName);
      expect(eventHasBeenListened).toBe(true);

      stopForwardEvents(sourceEventEmitter, targetEventEmitter);

      eventHasBeenListened = false;

      sourceEventEmitter.emit(eventName);
      eventName = 'TEST_EVENT_NAME_2';
      targetEventEmitter.addListener(eventName, () => {
        eventHasBeenListened = true;
      });
      sourceEventEmitter.emit(eventName);
      expect(eventHasBeenListened).toBe(false);
    });

    it('Should stop emit events from source emitter to target emitter only', () => {
      let eventName = 'TEST_EVENT_NAME';
      const sourceEventEmitter = getEventEmitterInstance();
      const targetEventEmitter = getEventEmitterInstance();
      const secondTargetEventEmitter = getEventEmitterInstance();

      forwardEvents(sourceEventEmitter, targetEventEmitter);
      forwardEvents(sourceEventEmitter, secondTargetEventEmitter);

      let eventHasBeenListened = false;
      let eventHasBeenListenedOnSecondEmitter = false;

      targetEventEmitter.addListener(eventName, () => {
        eventHasBeenListened = true;
      });
      secondTargetEventEmitter.addListener(eventName, () => {
        eventHasBeenListenedOnSecondEmitter = true;
      });
      sourceEventEmitter.emit(eventName);
      expect(eventHasBeenListened).toBe(true);
      expect(eventHasBeenListenedOnSecondEmitter).toBe(true);

      stopForwardEvents(sourceEventEmitter, targetEventEmitter);

      eventHasBeenListened = false;
      eventHasBeenListenedOnSecondEmitter = false;

      sourceEventEmitter.emit(eventName);
      expect(eventHasBeenListened).toBe(false);
      expect(eventHasBeenListenedOnSecondEmitter).toBe(true);

      eventHasBeenListened = false;
      eventHasBeenListenedOnSecondEmitter = false;
      stopForwardEvents(sourceEventEmitter, secondTargetEventEmitter);
      sourceEventEmitter.emit(eventName);
      expect(eventHasBeenListened).toBe(false);
      expect(eventHasBeenListenedOnSecondEmitter).toBe(false);
    });
  });
});
