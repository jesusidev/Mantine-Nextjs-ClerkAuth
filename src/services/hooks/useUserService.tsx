import { notifications } from '@mantine/notifications';
import { api } from '~/utils/api';

export function useUserService() {
  function create() {
    const { mutate, isLoading, error, isSuccess } = api.user.create.useMutation({
      onSuccess: (data, variables) => {
        notifications.show({
          id: variables.email,
          title: 'Account Created',
          message: `Account for ${variables.email} has been created successfully`,
          color: 'green.5',
        });
      },
      onError(e, variables) {
        notifications.show({
          id: variables.email,
          title: 'Unable to create account',
          message: `${e.message}`,
          color: 'red.5',
        });
      },
    });

    return { createUser: mutate, isLoading, error, isSuccess };
  }

  return { create };
}
