import firebase from 'firebase';
export declare class CAConnectionWithFirebaseUtilDatabase {
    protected app?: firebase.app.App;
    protected database?: firebase.database.Database;
    protected wasConnected: boolean;
    get isConnected(): boolean;
    protected setWasConnectedStatus(wasConnected?: boolean): void;
    protected setDatabaseInstance(db: firebase.database.Database): void;
    protected checkIsConnected(): Error | boolean;
    protected checkKeyValue(key: any): key is string;
    connect(): Promise<boolean | Error>;
    disconnect(): Promise<boolean | Error>;
    protected checkBeforeReadWrite(key: string): Error | boolean;
    setValue<T>(key: string, value: T): Promise<Error | boolean>;
    getValue<T>(key: string): Promise<Error | null | T>;
}
export default CAConnectionWithFirebaseUtilDatabase;
//# sourceMappingURL=central-authority-connection-firebase-utils.database.d.ts.map