import { IRenderTemplateLayoutInput, ITemplateLayout, ITemplateLayoutGetInput } from '@libs/types';
import { useMutation, UseMutationOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { DefinedInitialDataOptions } from '@tanstack/react-query';

import { CreateQueryOptions, UpdateQueryOptions } from '..';
import { TemplateLayoutService } from '../services/template-layout.service';


const templateLayoutService = TemplateLayoutService.getInstance<TemplateLayoutService>();


export const useTemplateLayout = () => {
    const queryClient = useQueryClient();

    const useGetTemplateLayout = (request: ITemplateLayoutGetInput, options?: Partial<DefinedInitialDataOptions<ITemplateLayout[]>>) => useQuery({
        queryKey: [templateLayoutService.getQueryKey('get-template-layouts'), request],
        queryFn: () => templateLayoutService.getAll(request),
        staleTime: 0,
        ...options,
    });

    const useGetTemplateLayoutById = (id: string, options?: Partial<DefinedInitialDataOptions<ITemplateLayout>>) => useQuery({
        queryKey: [templateLayoutService.getQueryKey('get-one'), id],
        queryFn: () => templateLayoutService.get(id),
        enabled: !!id,
        ...options,
    });

    const useCreateTemplateLayout = (options?: CreateQueryOptions<ITemplateLayout, Error, Partial<ITemplateLayout>>) => useMutation({
        mutationFn: (input: Partial<ITemplateLayout>) => templateLayoutService.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === templateLayoutService.getQueryKey('get-one') || query.queryKey[0] === templateLayoutService.getQueryKey('get-template-layouts');
                },
            });
        },
        ...options,
    });

    const useUpdateTemplateLayout = (options?: UpdateQueryOptions<ITemplateLayout, Error, Partial<ITemplateLayout>>) => useMutation({
        mutationFn: (input: Partial<ITemplateLayout> & { id: string }) => templateLayoutService.update(input.id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === templateLayoutService.getQueryKey('get-one') || query.queryKey[0] === templateLayoutService.getQueryKey('get-template-layouts');
                },
            });
        },
        ...options,
    });

    const useDeleteTemplateLayout = (options?: any) => useMutation<string, Error, any>({
        mutationFn: (id: string) => templateLayoutService.delete(id),
        onSuccess: (_data, _variable) => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === templateLayoutService.getQueryKey('get-one') || query.queryKey[0] === templateLayoutService.getQueryKey('get-template-layouts'),
            });
        },
        ...options,
    });

    const useRenderTemplateLayout = (options?: Partial<UseMutationOptions<string, Error, IRenderTemplateLayoutInput>>) => useMutation({
        mutationFn: (input: IRenderTemplateLayoutInput) => templateLayoutService.render(input),
        ...options,
    });

    return {
        useGetTemplateLayout,
        useGetTemplateLayoutById,
        useCreateTemplateLayout,
        useUpdateTemplateLayout,
        useDeleteTemplateLayout,
        useRenderTemplateLayout,
    };
};
