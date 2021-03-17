import React from 'react';
import { IFormFieldsValues, onFormValuesChange } from './base-component.types';
import {
  IField,
  ILabelProps,
  IInputFieldProps,
  IButtonProps,
  IDropdownProps,
  IFormProps,
  IFieldDescription,
  EFormFieldType,
  TFormFieldProps,
} from './base-component.types';

export class BaseComponent extends React.PureComponent {
  protected _renderLabel({ label, children, labelProps }: ILabelProps): React.ReactElement {
    return (
      <label {...labelProps}>
        {label}
        {children}
      </label>
    );
  }

  protected _renderInputField({ name, value, onChange, inputFieldProps }: IInputFieldProps): React.ReactElement {
    const handleFieldValueChange = (ev: React.SyntheticEvent<HTMLInputElement>): void => {
      const { target } = ev;
      const { value, name } = target as HTMLInputElement;
      onChange(name, value);
    };
    return <input name={name} value={value} onChange={handleFieldValueChange} {...inputFieldProps} />;
  }

  protected _renderInputFieldWithLabel(
    labelProps: Omit<ILabelProps, 'children'>,
    inputFieldProps: IInputFieldProps
  ): React.ReactElement<any> {
    const labelPropsResulted: ILabelProps = {
      ...labelProps,
      children: this._renderInputField(inputFieldProps),
    };
    return this._renderLabel(labelPropsResulted);
  }

  protected _renderButton({ title, onClick, buttonProps }: IButtonProps): React.ReactElement {
    return (
      <button onClick={onClick} {...buttonProps}>
        {title}
      </button>
    );
  }

  protected _renderDropdown({ name, options, onChange, selectElementProps }: IDropdownProps): React.ReactElement {
    const handleValueChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
      const { target } = ev;
      const { name: optionName, value } = target;
      debugger;
      onChange(name, optionName, value);
    };
    const optionsElements = options.map(
      ({ name, value, optionElementProps }): React.ReactElement => {
        return (
          <option key={`${name};${value}`} value={value} {...optionElementProps}>
            {name}
          </option>
        );
      }
    );
    return (
      <select name={name} onChange={handleValueChange} {...selectElementProps}>
        {optionsElements}
      </select>
    );
  }

  protected _renderDropdownWithLabel(
    labelProps: Omit<ILabelProps, 'children'>,
    dropdownProps: IDropdownProps
  ): React.ReactElement {
    const dropdownElement = this._renderDropdown(dropdownProps);
    const labelPropsResulted = {
      ...labelProps,
      children: dropdownElement,
    };
    return this._renderLabel(labelPropsResulted);
  }

  protected _renderForm(formProps: IFormProps, onFormValuesChange: onFormValuesChange): React.ReactElement {
    const { formFields, submitButton } = formProps;
    const formFieldsElements = formFields.map((formFieldDescription) => {
      return this.__renderFormFieldByDescription(formFieldDescription, onFormValuesChange);
    });
    const submitButtonPropsResulted = {
      label: 'Submit',
      ...submitButton,
      type: 'submit',
    };
    const submitButtonElement = this._renderButton(submitButtonPropsResulted);
    return (
      <form>
        {formFieldsElements}
        {submitButtonElement}
      </form>
    );
  }

  protected _renderFormElementByTypeAndProps<T extends EFormFieldType>(fieldDescription: {
    type: T;
    props: TFormFieldProps<T>;
    onChange: onFormValuesChange;
  }): React.ReactElement {
    const { type, props, onChange } = fieldDescription;
    switch (type) {
      case EFormFieldType.DROPDOWN:
        const handleDropdownValueChange: IDropdownProps['onChange'] = (fieldName: string, optionName: string, value: string) => {
          (props as IDropdownProps).onChange?.(fieldName, optionName, value);
          onChange({ [fieldName]: value });
        };
        const propsDropdownResulted: IDropdownProps = {
          ...(props as IDropdownProps),
          onChange: handleDropdownValueChange,
        };
        return this._renderDropdown(propsDropdownResulted);
      case EFormFieldType.INPUT:
        const handleInputValueChange: IInputFieldProps['onChange'] = (fieldName: string, value: string) => {
          (props as IInputFieldProps).onChange?.(fieldName, value);
          onChange({ [fieldName]: value });
        };
        const propsInputResulted: IInputFieldProps = {
          ...(props as IInputFieldProps),
          onChange: handleInputValueChange,
        };
        return this._renderInputField(propsInputResulted);
      case EFormFieldType.BUTTON:
        return this._renderButton(props as IButtonProps);
      case EFormFieldType.FORM:
        let formValues: IFormFieldsValues = {};
        const onFormValueChanged = (value: IFormFieldsValues) => {
          formValues = {
            ...formValues,
            ...value,
          };
          onChange({
            [(props as IField).name]: formValues,
          });
        };
        return (
          <div>
            <hr />
            {this._renderForm(props as IFormProps, onFormValueChanged)}
            <hr />
          </div>
        );
      default:
        throw new Error(`Unknown field type ${type}`);
    }
  }

  private __renderFormFieldByDescription = <T extends EFormFieldType>(
    formFieldDescription: IFieldDescription<T>,
    onChange: onFormValuesChange
  ): React.ReactElement => {
    const { type, label, props } = formFieldDescription;
    let fieldElement = this._renderFormElementByTypeAndProps<T>({
      type,
      props,
      onChange,
    });

    if (label) {
      const labelPropsResulted = {
        ...label,
        children: fieldElement,
      };
      fieldElement = this._renderLabel(labelPropsResulted);
    }
    return <div key={`${type};${label?.label || ''};${(props as IField)?.name || ''}`}>{fieldElement}</div>;
  };
}
