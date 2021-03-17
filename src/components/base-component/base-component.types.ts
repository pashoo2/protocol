import React from 'react';

export interface ILabelProps {
  label: string;
  children?: React.ReactNode;
  labelProps?: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
}

export interface IField {
  name: string;
}

export interface IInputFieldProps extends IField {
  value: string;
  onChange: (name: string, value: string) => unknown;
  inputFieldProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
}

export interface IButtonProps {
  title: string;
  onClick?: () => unknown;
  buttonProps?: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
}

export interface IDropdownProps extends IField {
  options: Array<{
    name: string;
    value: string;
    optionElementProps?: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
  }>;
  onChange: (fieldName: string, optionName: string, value: string) => unknown;
  selectElementProps?: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
}

export interface IFormFieldsValues {
  [key: string]: string | IFormFieldsValues;
}

export enum EFormFieldType {
  DROPDOWN = 'DROPDOWN',
  INPUT = 'INPUT',
  BUTTON = 'BUTTON',
  FORM = 'FORM',
}

export type TFormFieldProps<T extends EFormFieldType> = T extends EFormFieldType.BUTTON
  ? IButtonProps & IField
  : T extends EFormFieldType.DROPDOWN
  ? Omit<IDropdownProps, 'onChange'> & Partial<Pick<IDropdownProps, 'onChange'>>
  : T extends EFormFieldType.INPUT
  ? Omit<IInputFieldProps, 'onChange'> & Partial<Pick<IInputFieldProps, 'onChange'>>
  : T extends EFormFieldType.FORM
  ? Omit<IFormProps, 'submitButton' & 'onChange'> & IField & Partial<Pick<IFormProps, 'onChange'>>
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
  onChange: onFormValuesChange;
}
