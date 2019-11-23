import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base';
import { IValidationValuesMessagingDateSyncIntervalEvents } from './const-validation-values-messaging-common.types';

export const CONST_VALIDATION_VALUES_MESSAGING_DATE_SYNC_INTERVAL_MS = 1000;

export const CONST_VALIDATION_VALUES_MESSAGING_DATE_SYNC_INTERVAL_EVENT = 'VALIDATION_VALUES_MESSAGING_DATE_SYNC_INTERVAL_EVENT';

export const timeIntervalSyncEvents = new EventEmitter<IValidationValuesMessagingDateSyncIntervalEvents>();

function dateTimeSyncTick() {
    timeIntervalSyncEvents.emit(CONST_VALIDATION_VALUES_MESSAGING_DATE_SYNC_INTERVAL_EVENT);
}
setInterval(dateTimeSyncTick, CONST_VALIDATION_VALUES_MESSAGING_DATE_SYNC_INTERVAL_MS);