import { OptionsSerializerValidator } from '../../../../basic-classes/options-serializer-validator-class/options-serializer-validator-class';
import assert from 'assert';
export class SwarmMessageStoreDBOptionsClass extends OptionsSerializerValidator {
    constructor(params) {
        super(params);
        this._validateParams(params);
        this._setGrandAccessCallbackContextBinder(params.grandAccessBinder);
        this._setGrandAccessCallbackContextForDbOptionsBinder(params.grandAccessBinderForDBOptions);
        this._bindGrandAccessContextToOptions();
    }
    _validateParams(params) {
        assert(params, 'Parameters must be defined');
        assert(typeof params.grandAccessBinder, 'Grand access callback context binder must be a function');
        assert(params.grandAccessBinder.length > 0, 'Grand access callback context binder function must accept arguments');
        assert(typeof params.grandAccessBinderForDBOptions === 'function', 'Grand access callback context binder for a database options must be passed in params');
        assert(params.grandAccessBinderForDBOptions.length > 0, 'Grand access callback context binder for a database options function must accept arguments');
    }
    _setGrandAccessCallbackContextBinder(grandAccessCallbackContextBinder) {
        this._grandAccessContextBinder = grandAccessCallbackContextBinder;
    }
    _setGrandAccessCallbackContextForDbOptionsBinder(grandAccessCallbackContextForDbOptionsBinder) {
        this._grandAccessCallbackToDbOptionsBinder = grandAccessCallbackContextForDbOptionsBinder;
    }
    _getGrandAccessContextBinder() {
        const binder = this._grandAccessContextBinder;
        if (!binder) {
            throw new Error('Grand acess binder is not defined');
        }
        return binder;
    }
    _getGrandAccessCallbackToDbOptionsBinder() {
        const grandAccessCallbackOptionsBinder = this._grandAccessCallbackToDbOptionsBinder;
        if (!grandAccessCallbackOptionsBinder) {
            throw new Error('Grand access callback to options binder not defined');
        }
        return grandAccessCallbackOptionsBinder;
    }
    _bindGrandAccessContextToOptions() {
        const databaseOptionsUnboundToContext = this._getOptionsHandled();
        const databaseOptionsContextBinder = this._getGrandAccessCallbackToDbOptionsBinder();
        const databaseOptionsWithGrandAccessBound = databaseOptionsContextBinder(databaseOptionsUnboundToContext, this._getGrandAccessContextBinder());
        this._validateAndSetOptionsUnserialized(databaseOptionsWithGrandAccessBound);
    }
}
//# sourceMappingURL=swarm-message-store-connector-db-options-class.js.map