import { useRef } from 'react';
import { ActionIcon, NumberInput, type NumberInputHandlers } from '@mantine/core';
import { IconAlertTriangle, IconMinus, IconPlus } from '@tabler/icons-react';
import classes from './styles/InputNumber.module.css';

type InputNumberProps = {
  min?: number;
  max?: number;
  label?: string;
  error?: string;
  defaultValue?: number;
};

export function InputNumber({
  min = 0,
  max,
  label,
  error,
  defaultValue,
  ...props
}: InputNumberProps) {
  const handlers = useRef<NumberInputHandlers>(null);

  return (
    <div className={classes.wrapper}>
      <ActionIcon<'button'>
        size={28}
        variant="transparent"
        onClick={() => handlers.current?.decrement()}
        className={classes.control}
        onMouseDown={(event) => event.preventDefault()}
      >
        <IconMinus size="1rem" stroke={1.5} />
      </ActionIcon>

      <NumberInput
        {...props}
        variant="unstyled"
        min={min}
        max={max}
        label={label || ''}
        error={error && error}
        defaultValue={defaultValue || 0}
        handlersRef={handlers}
        classNames={{ input: classes.input }}
        rightSection={
          error && <IconAlertTriangle stroke={1.5} size="1.1rem" className={classes.icon} />
        }
      />

      <ActionIcon<'button'>
        size={28}
        variant="transparent"
        onClick={() => handlers.current?.increment()}
        className={classes.control}
        onMouseDown={(event) => event.preventDefault()}
      >
        <IconPlus size="1rem" stroke={1.5} />
      </ActionIcon>
    </div>
  );
}
