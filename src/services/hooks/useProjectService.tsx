import { notifications } from '@mantine/notifications';
import { v4 as uuidv4 } from 'uuid';
import { api } from '~/utils/api';
import { Product } from '~/types/product';

export function useProjectService() {
  const trpc = api.useUtils();
  const previousProjects = trpc.project.getAll.getData() ?? [];

  function products(id: string) {
    const { data, isLoading, isError } = api.product.getByProject.useQuery({
      projectId: id as string,
    });
    return { products: data, isLoading, isError };
  }

  function getProject(id: Product['projectId']) {
    const { data, isLoading, isError } = api.project.get.useQuery(
      { id: id as string },
      { enabled: id != null }
    );
    return { project: data, isLoading, isError };
  }

  function create() {
    const { mutate, isLoading, error, isSuccess } = api.project.create.useMutation({
      onMutate: async ({ name }) => {
        await trpc.project.getAll.cancel();
        const uuid = uuidv4();
        trpc.project.getAll.setData(undefined, [
          {
            id: `${uuid}-loading`,
            name: name ?? 'New Project',
            updatedAt: new Date(), // placeholder value
            status: 'ACTIVE', // placeholder value
            totalProjectProducts: 0, // placeholder value
          },
          ...previousProjects,
        ]);
        return { uuid };
      },
      onSuccess: (data, variables, context) => {
        const newProjects = previousProjects.map((project) =>
          project.id === `${context?.uuid}-loading` ? { ...project, ...data } : project
        );
        trpc.project.getAll.setData(undefined, newProjects);
        notifications.show({
          id: variables.name,
          title: 'Project Created',
          message: `Project ${variables.name} has been created successfully`,
          color: 'green.5',
        });
      },
      onError: (e, variables) => {
        const removeNewProduct = previousProjects.filter(
          (product) => product.name !== variables.name
        );
        trpc.project.getAll.setData(undefined, removeNewProduct);
        notifications.show({
          id: variables.name,
          title: 'Unable to create project',
          message: `${e.message}`,
          color: 'red.5',
        });
      },
    });

    return { createProject: mutate, isLoading, error, isSuccess };
  }

  return { products, project: getProject, create };
}
