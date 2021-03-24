import React from 'react';

export type TFieldValue = boolean | string | string[] | undefined | IFormFieldsValues;

export interface IFormMethods {
  readonly updateFormValues: (values: IFormFieldsValues) => void;
  readonly getFormValues: () => IFormFieldsValues;
}

export interface ILabelProps {
  label: string;
  children?: React.ReactNode;
  labelProps?: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
}

export interface IField {
  name: string;
  validate?(fieldName: string, fieldValue: TFieldValue): string;
}

export interface ICheckboxFieldProps extends IField {
  value: boolean;
  onChange: (name: string, value: boolean) => void;
  checkboxFieldProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
}

export interface IInputFieldProps<T extends boolean = false> extends IField {
  value: string;
  isMultiline?: T;
  onChange: (name: string, value: string) => unknown;
  inputFieldProps?: T extends true
    ? React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
    : React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
}

export interface IButtonProps {
  title: string;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => unknown;
  buttonProps?: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
}

export interface IFormButtonProps extends Omit<IButtonProps, 'onClick'> {
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>, formMethods: IFormMethods) => unknown;
}

export interface IDropdownProps<MULTI extends boolean = false> extends IField {
  options: Array<{
    name: string;
    value: string;
    optionElementProps?: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
  }>;
  onChange: (fieldName: string, optionName: string, value: MULTI extends boolean ? string[] : string) => unknown;
  selectElementProps?: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
  isMultiple: MULTI extends true ? true : never | false;
  canRemove?: MULTI extends true ? boolean : never | false;
  value?: MULTI extends true ? string[] : string | never;
}

export interface IFormFieldsValues {
  [key: string]: TFieldValue;
}

export enum EFormFieldType {
  DROPDOWN = 'DROPDOWN',
  INPUT = 'INPUT',
  CHECKBOX = 'CHECKBOX',
  BUTTON = 'BUTTON',
  FORM = 'FORM',
}

export type TFormFieldProps<T extends EFormFieldType> = T extends EFormFieldType.BUTTON
  ? IFormButtonProps & IField
  : T extends EFormFieldType.DROPDOWN
  ? Omit<IDropdownProps<boolean>, 'onChange'> & Partial<Pick<IDropdownProps<boolean>, 'onChange'>>
  : T extends EFormFieldType.INPUT
  ? Omit<IInputFieldProps<boolean>, 'onChange'> & Partial<Pick<IInputFieldProps, 'onChange'>>
  : T extends EFormFieldType.CHECKBOX
  ? Omit<ICheckboxFieldProps, 'onChange'> & Partial<Pick<ICheckboxFieldProps, 'onChange'>> & IField
  : T extends EFormFieldType.FORM
  ? Omit<IFormProps, 'submitButton' | 'onChange'> & IField
  : never;

export interface IFieldDescription<T extends EFormFieldType> {
  type: T;
  props: TFormFieldProps<T>;
  label?: ILabelProps;
}

export interface onFormValuesChange {
  (values: IFormFieldsValues): void;
}

export interface IFormProps {
  formFields: IFieldDescription<EFormFieldType>[];
  submitButton: IButtonProps;
  hookGetFormMethods?(formMethods: IFormMethods): void;
}

export interface IBaseComponent {
  renderLabel({ label, children, labelProps }: ILabelProps): React.ReactElement;

  renderError(error: Error): React.ReactElement;

  renderInputField<T extends boolean>(fieldProps: IInputFieldProps<T>): React.ReactElement;

  renderInputFieldWithLabel<T extends boolean>(
    labelProps: Omit<ILabelProps, 'children'>,
    inputFieldProps: IInputFieldProps<T>
  ): React.ReactElement<any>;

  renderButton({ title, onClick, buttonProps }: IButtonProps): React.ReactElement;

  renderDropdown({
    name,
    options,
    value: currentValue,
    isMultiple,
    selectElementProps,
    onChange,
  }: IDropdownProps): React.ReactElement;

  renderDropdownWithLabel(labelProps: Omit<ILabelProps, 'children'>, dropdownProps: IDropdownProps): React.ReactElement;

  renderCheckbox({ name, value, checkboxFieldProps, onChange }: ICheckboxFieldProps): React.ReactElement<any>;

  renderForm(formProps: IFormProps, onFormValuesChange: onFormValuesChange): React.ReactElement;
}
