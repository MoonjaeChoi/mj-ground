import { ActionMeta, SingleValue } from "react-select";

export interface IFormInfo {
    [key: string]: string | Array<string> | boolean;
  }

export interface IOptionObj {
  label: string;
  color: string;
  isDisabled?: boolean;
}

export interface IWordSelect {
  optionList: IOptionObj[];
  onChangeWord: (
    newValue: SingleValue<IOptionObj>,
    actionMeta: ActionMeta<IOptionObj>
  ) => void;
  defaultValueIndex?: number;
}

export interface ISelectOption {
  readonly id: number
  readonly label: string
}

export interface ColourOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export const colourOptions: readonly ColourOption[] = [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
  { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
  { value: 'purple', label: 'Purple', color: '#5243AA' },
  { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
  { value: 'orange', label: 'Orange', color: '#FF8B00' },
  { value: 'yellow', label: 'Yellow', color: '#FFC400' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'forest', label: 'Forest', color: '#00875A' },
  { value: 'slate', label: 'Slate', color: '#253858' },
  { value: 'silver', label: 'Silver', color: '#666666' },
];