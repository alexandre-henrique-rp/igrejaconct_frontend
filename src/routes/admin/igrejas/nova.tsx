import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PrivateRoute } from '@/components/PrivateRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PermissionGuard } from '@/components/PermissionGuard';
import { AdminLayout } from '@/layouts/AdminLayout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Upload } from 'lucide-react';

export const Route = createFileRoute('/admin/igrejas/nova')({
  component: () => (
    <PrivateRoute>
      <DashboardLayout>
      <PermissionGuard resource="admin" action="create">
        <AdminLayout>
          <NovaIgrejaPage />
        </AdminLayout>
      </PermissionGuard>
    </DashboardLayout>
    </PrivateRoute>
  ),
});

const createIgrejaSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cnpj: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  endereco: z.object({
    cep: z.string().optional(),
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
  }),
  logo_url: z.string().optional(),
});

type CreateIgrejaForm = z.infer<typeof createIgrejaSchema>;

function NovaIgrejaPage() {
  const navigate = useNavigate();

  const form = useForm<CreateIgrejaForm>({
    resolver: zodResolver(createIgrejaSchema),
    defaultValues: {
      nome: '',
      cnpj: '',
      telefone: '',
      email: '',
      endereco: {
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
      },
      logo_url: '',
    },
  });

  const onSubmit = async (data: CreateIgrejaForm) => {
    try {
      await api.post('/admin/igrejas', data);
      toast({
        title: 'Sucesso!',
        description: 'Igreja criada com sucesso',
      });
      navigate({ to: '/admin/igrejas' });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Erro ao criar igreja',
        variant: 'destructive',
      });
    }
  };

  return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Criar Nova Igreja
          </h1>
          <p className="text-gray-400">
            Adicione uma nova igreja ao sistema
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Informações Básicas
                </h3>

                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Nome da Igreja *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Igreja Batista da Cidade"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">CNPJ</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="00.000.000/0000-00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Telefone</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="(11) 99999-9999"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                          placeholder="contato@igreja.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Endereço */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Endereço
                </h3>

                <FormField
                  control={form.control}
                  name="endereco.cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">CEP</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="00000-000"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="endereco.logradouro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Logradouro</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="Rua das Flores"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endereco.numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Número</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="123"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="endereco.complemento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Complemento</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Sala 01, Prédio Azul"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endereco.bairro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Bairro</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Centro"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="endereco.cidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Cidade</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="São Paulo"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endereco.estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Estado</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="SP"
                            maxLength={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Logo */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Logo (opcional)
                </h3>

                <FormField
                  control={form.control}
                  name="logo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">URL da Logo</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="https://exemplo.com/logo.png"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-400">
                        Cole a URL de uma imagem para usar como logo da igreja
                      </p>
                    </FormItem>
                  )}
                />
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/admin/igrejas' })}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Criar Igreja
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
  );
}
