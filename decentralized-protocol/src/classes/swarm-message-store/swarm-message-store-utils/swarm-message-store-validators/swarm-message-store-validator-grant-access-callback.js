import assert from 'assert';
import { isNativeFunction, isArrowFunction } from "../../../../utils";
import { serializerClassUtilFunctionParserSandboxedDefault } from "../../../basic-classes/serializer-class";
export function validateGrantAccessCallback(grantAccess) {
    assert(grantAccess, 'Grant access callback must be provided in the databse options');
    if (typeof grantAccess !== 'function') {
        throw new Error('Grant access callback should be a function');
    }
    assert(grantAccess.length <= 5, 'Grant access callback should handle maximum 5 arguments');
    if (!grantAccess.length) {
        console.warn('Grant access callback should handle minimum 1 argument');
    }
    assert(!isNativeFunction(grantAccess), 'Grant access callback should not be a native function');
    return true;
}
export function validateGrantAccessCallbackWithContext(grantAccess) {
    if (!validateGrantAccessCallback(grantAccess)) {
        throw new Error('The function is not a valid grand access callback');
    }
    assert(Boolean(grantAccess.name), 'Grant access callback function should have a name');
    assert(!isArrowFunction(grantAccess), 'Grant access callback should not be an arrow function');
    return true;
}
export function validateGrantAccessCallbackWithContextSerializable(grantAccess) {
    assert(validateGrantAccessCallbackWithContext(grantAccess), 'Grant access callback is not a valid function supports validation context');
    serializerClassUtilFunctionParserSandboxedDefault(String(grantAccess));
    return true;
}
//# sourceMappingURL=swarm-message-store-validator-grant-access-callback.js.map