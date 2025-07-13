import { IRenderTemplateInput, ITemplate, ITemplateGetInput } from '@libs/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DefinedInitialDataOptions } from '@tanstack/react-query';
import { UseMutationOptions } from '@tanstack/react-query';

import { CreateQueryOptions, UpdateQueryOptions } from '..';
import { TemplateService } from '../services/template.service';


const templateService = TemplateService.getInstance<TemplateService>();


export const useTemplate = () => {
    const queryClient = useQueryClient();

    const useGetTemplate = (request: ITemplateGetInput, options?: Partial<DefinedInitialDataOptions<ITemplate[]>>) => useQuery({
        queryKey: [templateService.getQueryKey('get-templates'), request],
        queryFn: () => templateService.getAll(request),
        staleTime: 0,
        ...options,
    });

    const useGetTemplateById = (id: string, options?: Partial<DefinedInitialDataOptions<ITemplate>>) => useQuery({
        queryKey: [templateService.getQueryKey('get-template-by-id'), id],
        queryFn: () => templateService.get(id),
        enabled: !!id,
        ...options,
    });

    const useCreateTemplate = (options?: CreateQueryOptions<ITemplate, Error, Partial<ITemplate>>) => useMutation({
        mutationFn: (input: Partial<ITemplate>) => templateService.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === templateService.getQueryKey('get-template-by-id') || query.queryKey[0] === templateService.getQueryKey('get-templates');
                },
            });
        },
        ...options,
    });

    const useUpdateTemplate = (options?: UpdateQueryOptions<ITemplate, Error, Partial<ITemplate>>) => useMutation({
        mutationFn: (input: Partial<ITemplate> & { id: string }) => templateService.update(input.id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === templateService.getQueryKey('get-template-by-id') || query.queryKey[0] === templateService.getQueryKey('get-templates');
                },
            });
        },
        ...options,
    });

    const useDeleteTemplate = (options?: any) => useMutation<string, Error, any>({
        mutationFn: (id: string) => templateService.delete(id),
        onSuccess: (_data, _variable) => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === templateService.getQueryKey('get-template-by-id') || query.queryKey[0] === templateService.getQueryKey('get-templates'),
            });
        },
        ...options,
    });

    const useRenderTemplate = (options?: Partial<UseMutationOptions<string, Error, IRenderTemplateInput>>) => useMutation({
        mutationFn: (input: IRenderTemplateInput) => templateService.render(input),
        ...options,
    });

    return {
        useGetTemplate,
        useGetTemplateById,
        useCreateTemplate,
        useUpdateTemplate,
        useDeleteTemplate,
        useRenderTemplate,
    };
};
