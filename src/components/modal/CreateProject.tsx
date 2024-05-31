import { Button, Container, Modal, Paper, TextInput, Title } from '@mantine/core';
import React from 'react';
import { useForm } from '@mantine/form';
import { color } from '~/styles/colors';
import { useProjectService } from '~/services/hooks/useProjectService';

export default function ModalCreateProject({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) {
  const { createProject, error, isSuccess } = useProjectService().create();
  const [formError, setFormError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (error?.message.includes('Unique constraint failed on the fields: (`name`)')) {
      setFormError('Project Name already exists, Please use a different projects name.');
    }

    if (isSuccess) {
      close();
    }
  }, [isSuccess, error]);

  const form = useForm({
    initialValues: {
      name: '',
    },
  });

  const onFormSubmit = (values: ReturnType<(values: { name: string }) => { name: string }>) => {
    createProject({ name: values.name });
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      withCloseButton={false}
      overlayProps={{
        color: color.gray[2],
        opacity: 0.55,
        blur: 3,
      }}
    >
      <Container size={420} my={40}>
        <Title order={3}>Please Enter Your Project Name:</Title>
        {formError && <div style={{ color: 'red' }}>{formError}</div>}

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit((values) => onFormSubmit(values))}>
            <TextInput
              error
              label="Project Name:"
              placeholder="Art Frame"
              required
              withAsterisk
              {...form.getInputProps('name')}
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
