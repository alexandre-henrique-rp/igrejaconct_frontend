import { createFileRoute } from '@tanstack/react-router';
import { PrivateRoute } from '@/components/PrivateRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PermissionGuard } from '@/components/PermissionGuard';
import { AdminLayout } from '@/layouts/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api-client';
import { 
  Plus, 
  Search, 
  MoreVertical,
  MapPin,
  Phone,
  Mail,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Route = createFileRoute('/admin/igrejas/')({
  component: () => (
    <PrivateRoute>
      <DashboardLayout>
      <PermissionGuard resource="admin" action="read">
        <AdminLayout>
          <IgrejasAdminPage />
        </AdminLayout>
      </PermissionGuard>
    </DashboardLayout>
    </PrivateRoute>
  ),
});

interface Igreja {
  id: string;
  nome: string;
  cnpj?: string;
  endereco?: {
    cidade?: string;
    estado?: string;
    logradouro?: string;
  };
  telefone?: string;
  email?: string;
  created_at: string;
  _count?: {
    usuarios: number;
    membros: number;
  };
}

function IgrejasAdminPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteIgrejaId, setDeleteIgrejaId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'igrejas', { page, search }],
    queryFn: async () => {
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      const response = await api.get('/admin/igrejas', { params });
      return response.data;
    },
  });

  const handleDelete = async () => {
    if (!deleteIgrejaId) return;
    
    try {
      await api.delete(`/admin/igrejas/${deleteIgrejaId}`);
      toast({
        title: 'Sucesso',
        description: 'Igreja excluída com sucesso',
      });
      setDeleteIgrejaId(null);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Erro ao excluir igreja',
        variant: 'destructive',
      });
    }
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Gerenciamento de Igrejas
            </h1>
            <p className="text-gray-400">
              Lista de todas as igrejas cadastradas
            </p>
          </div>
          <a href="/admin/igrejas/nova">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Igreja
            </Button>
          </a>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">
              Carregando igrejas...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">
              Erro ao carregar igrejas
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              Nenhuma igreja encontrada
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Nome</TableHead>
                    <TableHead className="text-gray-300">CNPJ</TableHead>
                    <TableHead className="text-gray-300">Localização</TableHead>
                    <TableHead className="text-gray-300">Contato</TableHead>
                    <TableHead className="text-gray-300">Estatísticas</TableHead>
                    <TableHead className="text-gray-300">Criada em</TableHead>
                    <TableHead className="text-gray-300 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data?.map((igreja: Igreja) => (
                    <TableRow key={igreja.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">
                        {igreja.nome}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {igreja.cnpj || '-'}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>
                            {igreja.endereco?.cidade || '-'}/{igreja.endereco?.estado || ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex flex-col gap-1">
                          {igreja.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{igreja.email}</span>
                            </div>
                          )}
                          {igreja.telefone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{igreja.telefone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-blue-400" />
                            <span className="text-sm">{igreja._count?.usuarios || 0} usuários</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-green-400" />
                            <span className="text-sm">{igreja._count?.membros || 0} membros</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {format(new Date(igreja.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                            <DropdownMenuItem
                              onClick={() => window.location.href = `/admin/igrejas/${igreja.id}`}
                              className="text-gray-200 hover:bg-gray-700"
                            >
                              <Users className="mr-2 h-4 w-4" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.location.href = `/admin/igrejas/${igreja.id}/edit`}
                              className="text-gray-200 hover:bg-gray-700"
                            >
                              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteIgrejaId(igreja.id)}
                              className="text-red-400 hover:bg-red-900/20"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginação */}
              {data?.pagination && (
                <div className="p-4 border-t border-gray-700 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Página {page} de {data.pagination.total_pages} • {data.pagination.total} igrejas
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= data.pagination.total_pages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={!!deleteIgrejaId} onOpenChange={() => setDeleteIgrejaId(null)}>
          <AlertDialogContent className="bg-gray-800 border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Igreja</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta igreja? 
                <strong className="block mt-2 text-red-400">
                  ATENÇÃO: Todos os dados associados (usuários, membros, etc.) serão excluídos permanentemente. 
                  Esta ação NÃO pode ser desfeita!
                </strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Excluir Permanentemente
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
