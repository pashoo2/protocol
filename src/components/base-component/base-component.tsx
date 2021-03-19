import React from 'react';
import { IFormFieldsValues, onFormValuesChange, IFormMethods, IFormButtonProps } from './base-component.types';
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

import styles from './base-component.module.css';

export class BaseComponent {
  renderLabel({ label, children, labelProps }: ILabelProps): React.ReactElement {
    return (
      <label className={styles.label} {...labelProps}>
        {label}
        {children}
      </label>
    );
  }

  renderError(error: Error): React.ReactElement {
    return (
      <div>
        <h4>Error:</h4>
        <p>{error.message}</p>
      </div>
    );
  }

  renderInputField(
    { name, value, onChange, inputFieldProps }: IInputFieldProps,
    formFieldsValues?: IFormFieldsValues
  ): React.ReactElement {
    const handleFieldValueChange = (ev: React.SyntheticEvent<HTMLInputElement>): void => {
      const { target } = ev;
      const { value, name } = target as HTMLInputElement;
      onChange(name, value);
    };

    if (formFieldsValues) {
      formFieldsValues[name] = value;
    }
    return <input name={name} value={value} onChange={handleFieldValueChange} {...inputFieldProps} />;
  }

  renderInputFieldWithLabel(
    labelProps: Omit<ILabelProps, 'children'>,
    inputFieldProps: IInputFieldProps
  ): React.ReactElement<any> {
    const labelPropsResulted: ILabelProps = {
      ...labelProps,
      children: this.renderInputField(inputFieldProps),
    };
    return this.renderLabel(labelPropsResulted);
  }

  renderButton({ title, onClick, buttonProps }: IButtonProps, formMethods?: IFormMethods): React.ReactElement {
    const handleClick =
      onClick && formMethods
        ? () => {
            (onClick as IFormButtonProps['onClick'])?.(formMethods);
          }
        : onClick;
    return (
      <button onClick={handleClick} {...buttonProps}>
        {title}
      </button>
    );
  }

  renderDropdown(
    { name, options, value: currentValue, isMultiple, selectElementProps, onChange }: IDropdownProps,
    formFieldsValues?: IFormFieldsValues
  ): React.ReactElement {
    const handleValueChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
      const { target } = ev;
      const { name: optionName, value } = target;
      debugger;
      onChange(name, optionName, value);
    };
    const optionsElements = options.map(
      ({ name, value, optionElementProps }): React.ReactElement => {
        const isSelected: boolean =
          Boolean(currentValue) &&
          (isMultiple && Array.isArray(currentValue) ? (currentValue as string[]).includes(value) : value === currentValue);
        return (
          <option key={`${name};${value}`} value={value} selected={isSelected} {...optionElementProps}>
            {name}
          </option>
        );
      }
    );

    if (formFieldsValues) {
      formFieldsValues[name] = currentValue;
    }

    function Form() {
      return (
        <select
          name={name}
          multiple={isMultiple}
          size={isMultiple ? Math.max(5, options.length) : undefined}
          onChange={handleValueChange}
          {...selectElementProps}
        >
          {optionsElements}
        </select>
      );
    }

    return <Form />;
  }

  renderDropdownWithLabel(labelProps: Omit<ILabelProps, 'children'>, dropdownProps: IDropdownProps): React.ReactElement {
    const dropdownElement = this.renderDropdown(dropdownProps);
    const labelPropsResulted = {
      ...labelProps,
      children: dropdownElement,
    };
    return this.renderLabel(labelPropsResulted);
  }

  renderForm(
    formProps: IFormProps,
    onFormValuesChange: onFormValuesChange,
    formFieldsValuesCurrent: IFormFieldsValues = {}
  ): React.ReactElement {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const currentFormFieldsValues = { ...formFieldsValuesCurrent };
    const { formFields, submitButton } = formProps;
    const handleFormValuesChange = (values: IFormFieldsValues): void => {
      const updatedFormFieldsValues = Object.assign({}, currentFormFieldsValues, values);
      onFormValuesChange(updatedFormFieldsValues);
    };
    const formMethods: IFormMethods = Object.freeze({
      get getFormValues(): IFormMethods['getFormValues'] {
        return () => currentFormFieldsValues;
      },
      get updateFormValues(): IFormMethods['updateFormValues'] {
        return (values: IFormFieldsValues): void => {
          handleFormValuesChange(values);
        };
      },
    });
    const formFieldsElements = formFields.map((formFieldDescription) => {
      return this.renderFormFieldByDescription(
        formFieldDescription,
        currentFormFieldsValues,
        formMethods,
        handleFormValuesChange
      );
    });
    const submitButtonPropsResulted = {
      label: 'Submit',
      ...submitButton,
      type: 'submit',
    };
    const submitButtonElement = this.renderButton(submitButtonPropsResulted);
    debugger;
    return (
      <form>
        {formFieldsElements}
        {submitButtonElement}
      </form>
    );
  }

  private __renderFormElementByTypeAndProps<T extends EFormFieldType>(fieldDescription: {
    type: T;
    props: TFormFieldProps<T>;
    formMethods: IFormMethods;
    currentFormFieldsValues: IFormFieldsValues;
    onChange: onFormValuesChange;
  }): React.ReactElement {
    const { type, props, currentFormFieldsValues, formMethods, onChange } = fieldDescription;
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
        return this.renderDropdown(propsDropdownResulted, currentFormFieldsValues);
      case EFormFieldType.INPUT:
        const handleInputValueChange: IInputFieldProps['onChange'] = (fieldName: string, value: string) => {
          (props as IInputFieldProps).onChange?.(fieldName, value);
          onChange({ [fieldName]: value });
        };
        const propsInputResulted: IInputFieldProps = {
          ...(props as IInputFieldProps),
          onChange: handleInputValueChange,
        };
        return this.renderInputField(propsInputResulted, currentFormFieldsValues);
      case EFormFieldType.BUTTON:
        return this.renderButton(props as IButtonProps, formMethods);
      case EFormFieldType.FORM:
        let formValues: IFormFieldsValues = {};
        const onFormValueChanged = (value: IFormFieldsValues) => {
          debugger;
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
            {this.renderForm(props as IFormProps, onFormValueChanged, currentFormFieldsValues)}
            <hr />
          </div>
        );
      default:
        throw new Error(`Unknown field type ${type}`);
    }
  }

  renderFormFieldByDescription<T extends EFormFieldType>(
    formFieldDescription: IFieldDescription<T>,
    currentFormFieldsValues: IFormFieldsValues,
    formMethods: IFormMethods,
    onChange: onFormValuesChange
  ): React.ReactElement {
    const { type, label, props } = formFieldDescription;
    let fieldElement = this.__renderFormElementByTypeAndProps<T>({
      type,
      props,
      currentFormFieldsValues,
      formMethods,
      onChange,
    });

    if (label) {
      const labelPropsResulted = {
        ...label,
        children: fieldElement,
      };
      fieldElement = this.renderLabel(labelPropsResulted);
    }
    return <div key={`${type};${label?.label || ''};${(props as IField)?.name || ''}`}>{fieldElement}</div>;
  }
}
