import { TextInput, type TextInputProps } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import classes from './styles/InputText.module.css';

export type InputTextProps = {
  label: string;
  error?: string;
  defaultValue?: string;
};

export function InputText({
  label,
  error,
  defaultValue,
  ...props
}: InputTextProps & TextInputProps) {
  return (
    <TextInput
      {...props}
      label={label || ''}
      error={error && error}
      defaultValue={defaultValue || ''}
      classNames={{ input: error && classes.input }}
      rightSection={
        error && <IconAlertTriangle stroke={1.5} size="1.1rem" className={classes.icon} />
      }
    />
  );
}
