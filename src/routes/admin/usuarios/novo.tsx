import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PrivateRoute } from '@/components/PrivateRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PermissionGuard } from '@/components/PermissionGuard';
import { AdminLayout } from '@/layouts/AdminLayout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Role } from '@/types/auth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api-client';
import { toast } from '@/components/ui/use-toast';

export const Route = createFileRoute('/admin/usuarios/novo')({
  component: () => (
    <PrivateRoute>
      <DashboardLayout>
      <PermissionGuard resource="admin" action="create">
          <NovoUsuarioPage />
      </PermissionGuard>
    </DashboardLayout>
    </PrivateRoute>
  ),
});

const createUserSchema = z.object({
  nome_completo: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmar_senha: z.string(),
  role: z.nativeEnum(Role),
  membro_id: z.string().uuid().optional().nullable(),
  enviar_email: z.boolean().default(true),
}).refine((data) => data.senha === data.confirmar_senha, {
  message: 'Senhas não conferem',
  path: ['confirmar_senha'],
});

type CreateUserForm = z.infer<typeof createUserSchema>;

function NovoUsuarioPage() {
  const navigate = useNavigate();
  
  const { data: membrosData } = useQuery({
    queryKey: ['membros', 'select'],
    queryFn: async () => {
      const response = await api.get('/membros', { params: { limit: 1000 } });
      return response.data;
    },
  });

  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      nome_completo: '',
      email: '',
      senha: '',
      confirmar_senha: '',
      role: Role.MEMBRO,
      membro_id: null,
      enviar_email: true,
    },
  });

  const watchedRole = form.watch('role');

  const onSubmit = async (data: CreateUserForm) => {
    try {
      await api.post('/admin/users', data);
      toast({
        title: 'Sucesso!',
        description: 'Usuário criado com sucesso',
      });
      navigate({ to: '/admin/usuarios' });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Erro ao criar usuário',
        variant: 'destructive',
      });
    }
  };

  const roles: Role[] = [
    'ADMIN',
    'PASTOR',
    'SECRETARIO',
    'TESOUREIRO',
    'LIDER_MINISTERIO',
    'LIDER_CELULA',
    'DISCIPULADOR',
    'MEMBRO',
    'MODERADOR',
  ];

  // Admin não pode criar outro admin via interface (segurança)
  const allowedRoles = roles.filter(role => role !== 'ADMIN');

  return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Criar Novo Usuário
          </h1>
          <p className="text-gray-400">
            Preencha os dados para criar um novo usuário no sistema
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nome_completo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Nome Completo</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="João da Silva"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Email</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="joao@igreja.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Senha</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-400">
                        Mínimo 8 caracteres
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmar_senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Perfil (Role)</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={field.value === 'ADMIN'} // admin protegido
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Selecione um perfil" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {allowedRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                    {watchedRole === 'ADMIN' && (
                      <p className="text-xs text-red-400">
                        ⚠️ Cuidado: ADMIN tem acesso total ao sistema
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="membro_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">
                      Vincular a Membro Existente (opcional)
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Selecione um membro" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                          {membrosData?.data?.map((membro: any) => (
                            <SelectItem key={membro.id} value={membro.id}>
                              {membro.nome_completo} - {membro.email || 'sem email'}
                            </SelectItem>
                          ))}
                          {(!membrosData?.data || membrosData.data.length === 0) && (
                            <SelectItem value="none" disabled>
                              Nenhum membro cadastrado
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-400">
                      Opcional: vincular a um registro de membro existente
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enviar_email"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-600"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-gray-200">
                        Enviar email de boas-vindas
                      </FormLabel>
                      <p className="text-xs text-gray-400">
                        O usuário receberá um email com instruções para acessar o sistema
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/admin/usuarios' })}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Criar Usuário
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
  );
}
