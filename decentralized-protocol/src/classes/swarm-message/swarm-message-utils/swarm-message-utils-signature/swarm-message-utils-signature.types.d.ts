import { ISwarmMessageRaw } from '../../swarm-message-constructor.types';
export interface ISwarmMessageUtilSignatureGetStringForSignByMessageRaw {
    (msg: Omit<ISwarmMessageRaw, 'sig'>): string;
}
//# sourceMappingURL=swarm-message-utils-signature.types.d.ts.map