import { ISwarmMessageChannelDescriptionRaw } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { IFieldDescription, EFormFieldType, IFormMethods } from '../base-component/base-component.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from '../../classes/swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { commonUtilsArrayUniq } from '../../utils/common-utils/common-utils-array';

export function swarmChannelDescriptionComponentCreateSubformDescriptionForChannelDatabaseOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CHD extends ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> = ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>
>(databaseOptions: CHD['dbOptions']): IFieldDescription<EFormFieldType.FORM> {
  const { isPublic, write } = databaseOptions;
  const formFields: IFieldDescription<EFormFieldType>[] = [
    {
      type: EFormFieldType.CHECKBOX,
      label: { label: 'Is public channels' },
      props: {
        name: 'isPublic',
        value: Boolean(isPublic),
      },
    },
    {
      type: EFormFieldType.DROPDOWN,
      label: { label: 'Users who have the WRITE permission' },
      props: {
        name: 'write',
        value: write,
        isMultiple: true,
        canRemove: true,
        options: write
          ? write.map((writeUserId) => ({
              name: writeUserId,
              value: writeUserId,
            }))
          : [],
      },
    },
  ];

  return {
    type: EFormFieldType.FORM,
    label: { label: 'Database options' },
    props: {
      name: 'dbOptions',
      formFields,
    },
  };
}

export function swarmChannelDescriptionComponentCreateFormFieldsDescriptionForChannelDescription<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CHD extends ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> = ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>
>(channelDescription: CHD): IFieldDescription<EFormFieldType>[] {
  const { name, tags, version, dbType, description, messageEncryption, admins, dbOptions } = channelDescription;
  return [
    { type: EFormFieldType.INPUT, props: { name: 'name', value: name }, label: { label: 'Name:' } },
    { type: EFormFieldType.INPUT, props: { name: 'version', value: version }, label: { label: 'Version' } },
    {
      type: EFormFieldType.DROPDOWN,
      props: {
        name: 'dbType',
        value: dbType,
        selectElementProps: { disabled: true },
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
        value: tags,
        isMultiple: true,
        options: tags.map((tag) => ({
          name: tag,
          value: tag,
        })),
      },
      label: { label: 'Tags for the channel' },
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
    {
      type: EFormFieldType.INPUT,
      label: { label: 'Description' },
      props: {
        name: 'description',
        value: description,
        isMultiline: true,
      },
    },
    {
      type: EFormFieldType.INPUT,
      label: { label: 'Message encryption' },
      props: {
        name: 'messageEncryption',
        value: messageEncryption,
        inputFieldProps: { disabled: true },
      },
    },
    {
      type: EFormFieldType.DROPDOWN,
      label: { label: 'Channel admins' },
      props: {
        name: 'admins',
        value: admins,
        isMultiple: true,
        canRemove: true,
        options: admins.map((admin) => ({
          name: admin,
          value: admin,
        })),
      },
    },
    {
      type: EFormFieldType.BUTTON,
      label: {
        label: 'Add new admin',
      },
      props: {
        name: 'Add new admin',
        title: 'Add new admin',
        buttonProps: { type: 'button' },
        onClick: (formMethods: IFormMethods) => {
          const newAdminUserId = prompt('Input an admin user id');
          const currentFormValues = formMethods.getFormValues();
          formMethods.updateFormValues({
            admins: commonUtilsArrayUniq([...(currentFormValues.admins as string[]), newAdminUserId]) as string[],
          });
        },
      },
    },
    swarmChannelDescriptionComponentCreateSubformDescriptionForChannelDatabaseOptions<P, T, DbType, DBO, CHD>(dbOptions),
  ];
}
