export function extendClassSwarmStoreWithOptionsConstructor(BaseClass, SwarmStoreOptionsClass) {
    return class SwarmStoreWithOptionsConstructor extends BaseClass {
        connect(swarmStoreOptions) {
            const optionsClass = new SwarmStoreOptionsClass({ swarmStoreOptions });
            const swarmStoreOptionsValidated = optionsClass.options;
            return super.connect(swarmStoreOptionsValidated);
        }
    };
}
//# sourceMappingURL=swarm-store-class-with-options-constructor-mixin.js.map