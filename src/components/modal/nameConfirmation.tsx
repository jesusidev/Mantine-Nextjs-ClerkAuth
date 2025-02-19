import { useDisclosure } from '@mantine/hooks';
import { Button, Container, Modal, Paper, TextInput, Title, useMantineTheme } from '@mantine/core';
import React from 'react';
import { useForm } from '@mantine/form';
import { useUser } from '@clerk/nextjs';
import { useUserService } from '~/services/hooks/useUserService';

export default function ModalNameConfirmation() {
  const { createUser, isSuccess, error: createUserError } = useUserService().create();
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const { user } = useUser();

  React.useEffect(() => {
    open();
    if (isSuccess) {
      close();
    }
    if (createUserError?.message.includes('Unique constraint failed on the fields: (`id`)')) {
      setFormError(
        'Email already exists, Please login with your email and password or reset your password.'
      );
    }
  }, [open, isSuccess, createUserError]);

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
    },
  });

  const onFormSubmit = (
    values: ReturnType<
      (values: { firstName: string; lastName: string }) => {
        firstName: string;
        lastName: string;
      }
    >
  ) => {
    createUser({
      firstName: values.firstName,
      lastName: values.lastName,
      email: user?.primaryEmailAddress?.emailAddress as string,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      withCloseButton={false}
      overlayProps={{
        color: theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      }}
    >
      <Container size={420} my={40}>
        <Title order={3}>Please Enter Your Name:</Title>
        {formError && <div style={{ color: 'red' }}>{formError}</div>}

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit((values) => onFormSubmit(values))}>
            <TextInput
              label="FirstName"
              placeholder="Test"
              required
              withAsterisk
              {...form.getInputProps('firstName')}
            />
            <TextInput
              label="LastName"
              placeholder="Test"
              required
              withAsterisk
              {...form.getInputProps('lastName')}
            />
            <Button fullWidth mt="xl" type="submit">
              Submit
            </Button>
          </form>
        </Paper>
      </Container>
    </Modal>
  );
}
