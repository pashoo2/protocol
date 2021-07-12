import { ConstructorType } from "../../types/helper.types";
export const isConstructor = (v) => {
    var _a, _b;
    return typeof v === 'function' && typeof ((_b = (_a = v.prototype) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.name) === 'string';
};
//# sourceMappingURL=common-utils.constructor.js.map