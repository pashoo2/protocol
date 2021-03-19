import { ISwarmMessageChannelDescriptionRaw } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { IFieldDescription, EFormFieldType, IFormMethods, IDropdownProps } from '../base-component/base-component.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from '../../classes/swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';

export function swarmChannelDescriptionComponentCreateFormFieldsDescriptionForChannelDescription<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CHD extends ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> = ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>
>(channelDescription: CHD): IFieldDescription<EFormFieldType>[] {
  const { name, tags, version, dbType, dbOptions } = channelDescription;
  return [
    { type: EFormFieldType.INPUT, props: { name: 'name', value: name }, label: { label: 'Name:' } },
    { type: EFormFieldType.INPUT, props: { name: 'version', value: version }, label: { label: 'Version' } },
    {
      type: EFormFieldType.DROPDOWN,
      props: {
        name: 'dbType',
        value: dbType,
        options: Object.keys(
          ESwarmStoreConnectorOrbitDbDatabaseType as Record<string, ESwarmStoreConnectorOrbitDbDatabaseType>
        ).map((databaseTypeName) => {
          return {
            name: databaseTypeName,
            value: (ESwarmStoreConnectorOrbitDbDatabaseType as Record<string, ESwarmStoreConnectorOrbitDbDatabaseType>)[
              databaseTypeName
            ],
          };
        }),
      },
      label: { label: 'Database type' },
    },
    {
      type: EFormFieldType.DROPDOWN,
      props: {
        name: 'tags',
        isMultiple: true,
        value: tags,
        selectElementProps: { disabled: true },
        options: tags.map((tag) => ({
          name: tag,
          value: tag,
        })),
      },
      label: { label: 'Database type' },
    },
    {
      type: EFormFieldType.BUTTON,
      label: {
        label: 'Add new tag',
      },
      props: {
        name: 'Add new tag',
        title: 'Add new tag',
        buttonProps: { type: 'button' },
        onClick: (formMethods: IFormMethods) => {
          const newTag = prompt('Type a new tag for the channel');
          const currentFormValues = formMethods.getFormValues();
          formMethods.updateFormValues({
            tags: [...(currentFormValues.tags as string[]), newTag] as string[],
          });
        },
      },
    },
  ];
}
