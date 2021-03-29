import React from 'react';
import {
  EFormFieldType,
  IBaseComponent,
  IButtonProps,
  IDropdownProps,
  IField,
  IFieldDescription,
  IFormButtonProps,
  IFormFieldsValues,
  IFormMethods,
  IFormProps,
  IInputFieldProps,
  ILabelProps,
  onFormValuesChange,
  TFormFieldProps,
  ICheckboxFieldProps,
  TFieldValue,
} from './base-component.types';

import styles from './base-component.module.css';

export class BaseComponent implements IBaseComponent {
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

  renderTextareaField(
    { name, value, inputFieldProps, onChange, validate }: IInputFieldProps<true>,
    formFieldsValues?: IFormFieldsValues
  ): React.ReactElement {
    const handleFieldValueChange = (ev: React.SyntheticEvent<HTMLTextAreaElement>): void => {
      const { target } = ev;
      const { value, name } = target as HTMLTextAreaElement;
      if (this.__validateField({ name, validate }, value, ev)) {
        return;
      }
      onChange(name, value);
    };

    if (formFieldsValues) {
      formFieldsValues[name] = value;
    }
    return (
      <textarea name={name} onBlur={handleFieldValueChange} {...inputFieldProps}>
        {value}
      </textarea>
    );
  }

  renderTextInputField(
    { name, value, inputFieldProps, onChange, validate }: IInputFieldProps<false>,
    formFieldsValues?: IFormFieldsValues
  ): React.ReactElement {
    const handleFieldValueChange = (ev: React.SyntheticEvent<HTMLInputElement>): void => {
      const { target } = ev;
      const { value, name } = target as HTMLInputElement;
      if (this.__validateField({ name, validate }, value, ev)) {
        return;
      }
      onChange(name, value);
    };

    if (formFieldsValues) {
      formFieldsValues[name] = value;
    }
    return <input type="text" name={name} defaultValue={value} onBlur={handleFieldValueChange} {...inputFieldProps} />;
  }

  renderInputField<T extends boolean>(fieldProps: IInputFieldProps<T>, formFieldsValues?: IFormFieldsValues): React.ReactElement {
    if (fieldProps.isMultiline) {
      return this.renderTextareaField(fieldProps as IInputFieldProps<true>, formFieldsValues);
    }
    return this.renderTextInputField(fieldProps as IInputFieldProps<false>, formFieldsValues);
  }

  renderInputFieldWithLabel<T extends boolean>(
    labelProps: Omit<ILabelProps, 'children'>,
    inputFieldProps: IInputFieldProps<T>
  ): React.ReactElement<any> {
    const labelPropsResulted: ILabelProps = {
      ...labelProps,
      children: this.renderInputField<T>(inputFieldProps),
    };
    return this.renderLabel(labelPropsResulted);
  }

  renderCheckbox(
    { name, value, checkboxFieldProps, validate, onChange }: ICheckboxFieldProps,
    formFieldsValues?: IFormFieldsValues
  ): React.ReactElement<any> {
    const handleCheckboxValueChange = (ev: React.SyntheticEvent<HTMLInputElement>): void => {
      const { target } = ev;
      const { name, checked } = target as HTMLInputElement;
      if (this.__validateField({ name, validate }, value, ev)) {
        return;
      }
      onChange?.(name, checked);
    };

    if (formFieldsValues) {
      formFieldsValues[name] = value;
    }
    return <input type="checkbox" name={name} checked={value} onChange={handleCheckboxValueChange} {...checkboxFieldProps} />;
  }

  renderButton({ title, onClick, buttonProps }: IButtonProps, formMethods?: IFormMethods): React.ReactElement {
    const handleClick =
      onClick && formMethods
        ? (ev: React.MouseEvent<HTMLButtonElement>) => {
            (onClick as IFormButtonProps['onClick'])?.(ev, formMethods);
          }
        : onClick;
    return (
      <button onClick={handleClick} {...buttonProps}>
        {title}
      </button>
    );
  }

  renderDropdown<T extends boolean = false>(
    { name, options, value: currentValue, isMultiple, canRemove, selectElementProps, onChange, validate }: IDropdownProps<T>,
    formFieldsValues?: IFormFieldsValues
  ): React.ReactElement {
    const getCurrentValues = (): string[] => {
      return Array.isArray(currentValue) ? currentValue : options.map(({ value }) => value);
    };
    const handleValueChange = isMultiple
      ? undefined
      : (ev: React.ChangeEvent<HTMLSelectElement>) => {
          const { target } = ev;
          const { name: optionName, value } = target;
          if (this.__validateField({ name, validate }, value, ev)) {
            return;
          }
          onChange(name, optionName, (isMultiple ? getCurrentValues() : value) as T extends boolean ? string[] : string);
        };
    const handleRemoveValue = (ev: React.MouseEvent<HTMLOptionElement, MouseEvent>) => {
      if (!window.confirm('Do you really want to remove the element?')) {
        return;
      }
      const { target } = ev;
      const { title: optionName, value: optionValue } = target as HTMLOptionElement;
      const valuesUpdated = getCurrentValues().filter((value) => value !== optionValue);
      onChange(name, optionName, valuesUpdated as T extends boolean ? string[] : string);
    };
    const optionsElements = options.map(
      ({ name, value, optionElementProps }): React.ReactElement => {
        const isSelected: boolean =
          Boolean(currentValue) &&
          (isMultiple && Array.isArray(currentValue) ? (currentValue as string[]).includes(value) : value === currentValue);
        return (
          <option
            key={`${name};${value}`}
            value={value}
            selected={isSelected}
            onDoubleClick={canRemove ? handleRemoveValue : undefined}
            {...optionElementProps}
          >
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

  renderDropdownWithLabel<T extends boolean>(
    labelProps: Omit<ILabelProps, 'children'>,
    dropdownProps: IDropdownProps<T>
  ): React.ReactElement {
    const dropdownElement = this.renderDropdown<T>(dropdownProps);
    const labelPropsResulted = {
      ...labelProps,
      children: dropdownElement,
    };
    return this.renderLabel(labelPropsResulted);
  }

  renderForm(formProps: IFormProps, onFormValuesChange: onFormValuesChange): React.ReactElement {
    return this.renderFormAsField(formProps, onFormValuesChange);
  }

  renderFormAsField(
    formProps: IFormProps | TFormFieldProps<EFormFieldType.FORM>,
    onFormValuesChange: onFormValuesChange,
    currentFormFieldsValues: IFormFieldsValues = {}
  ): React.ReactElement {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { formFields, submitButton } = formProps as IFormProps;
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
    const submitButtonPropsResulted = submitButton
      ? {
          label: 'Submit',
          ...submitButton,
          type: 'submit',
        }
      : undefined;
    const submitButtonElement = submitButtonPropsResulted && this.renderButton(submitButtonPropsResulted);
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
        const handleDropdownValueChange: IDropdownProps<any>['onChange'] = (
          fieldName: string,
          optionName: string,
          value: string | string[]
        ) => {
          (props as IDropdownProps<any>).onChange?.(fieldName, optionName, value);
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
      case EFormFieldType.CHECKBOX: {
        const fieldProps = props as TFormFieldProps<EFormFieldType.CHECKBOX>;
        const handleCheckboxValueChange: TFormFieldProps<EFormFieldType.CHECKBOX>['onChange'] = (
          fieldName: string,
          value: boolean
        ) => {
          fieldProps.onChange?.(fieldName, value);
          onChange({ [fieldName]: value });
        };
        const propsInputResulted: ICheckboxFieldProps = {
          ...fieldProps,
          onChange: handleCheckboxValueChange,
        };
        return this.renderCheckbox(propsInputResulted, currentFormFieldsValues);
      }
      case EFormFieldType.FORM: {
        const formName = (props as IField).name;

        if (currentFormFieldsValues) {
          currentFormFieldsValues[formName] = {};
        }
        let formValues = (currentFormFieldsValues[formName] as IFormFieldsValues) ?? {};
        const onFormValueChanged = (value: IFormFieldsValues) => {
          formValues = {
            ...formValues,
            ...value,
          };
          // eslint-disable-next-line @typescript-eslint/unbound-method
          if (
            this.__validateField(
              {
                name: formName,
                // eslint-disable-next-line @typescript-eslint/unbound-method
                validate: (props as IField).validate,
              },
              formValues
            )
          ) {
            return;
          }
          onChange({
            [formName]: formValues,
          });
        };
        return (
          <div>
            <br />
            <hr />
            <h3>{props.name}</h3>
            {this.renderFormAsField(props as TFormFieldProps<EFormFieldType.FORM>, onFormValueChanged, formValues)}
            <hr />
          </div>
        );
      }
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

  __validateField(field: IField, value: TFieldValue, ev?: React.SyntheticEvent<any>): string {
    const errorMessage = field.validate?.(field.name, value);
    if (errorMessage) {
      ev?.preventDefault();
      alert(errorMessage);
      return errorMessage;
    }
    return '';
  }
}
