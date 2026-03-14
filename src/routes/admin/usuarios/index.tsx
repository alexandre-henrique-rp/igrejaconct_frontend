import React, { useState } from 'react';
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
  Key,
  Trash2,
  Edit,
  UserCheck,
  Users
} from 'lucide-react';
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
  Select,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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
import { TitleComponent } from '#/components/TitleComponent';
import { ButtonNew } from '#/components/button_new';

export const Route = createFileRoute('/admin/usuarios/')({
  component: () => (
    <PrivateRoute>
      <DashboardLayout>
      <PermissionGuard resource="admin" action="read">
          <UsuariosAdminPage />
      </PermissionGuard>
    </DashboardLayout>
    </PrivateRoute>
  ),
});

interface Usuario {
  id: string;
  email: string;
  perfil: string;
  membro?: {
    id: string;
    nome_completo: string;
  };
  igreja_id?: string | null;
  created_at: string;
  updated_at: string;
  ultimo_login?: string;
}

function UsuariosAdminPage() {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignChurchId, setAssignChurchId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [churches, setChurches] = useState<Array<{id: string; nome: string}>>([]);

   const { data, isLoading, error } = useQuery({
     queryKey: ['admin', 'usuarios', { page, search, filterRole }],
     queryFn: async () => {
       const params: any = { page, limit: 20 };
       if (search) params.search = search;
       if (filterRole !== 'ALL') params.role = filterRole;
       const response = await api.get('/admin/users', { params });
       return response.data;
     },
   });

   // Fetch churches for assignment modal
   const { data: churchesData } = useQuery({
     queryKey: ['admin', 'igrejas'],
     queryFn: async () => {
       const response = await api.get('/igrejas', {
         params: { limit: 1000 },
       });
       return response.data;
     },
   });

   // Process churches data for select
   React.useEffect(() => {
     if (churchesData?.data) {
       setChurches(
         churchesData.data.map((igreja: any) => ({
           id: igreja.id,
           nome: igreja.nome,
         }))
       );
     }
   }, [churchesData]);

  const handleDelete = async () => {
    if (!deleteUserId) return;
    
    try {
      await api.delete(`/admin/users/${deleteUserId}`);
      toast({
        title: 'Sucesso',
        description: 'Usuário desativado com sucesso',
      });
      setDeleteUserId(null);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Erro ao desativar usuário',
        variant: 'destructive',
      });
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      await api.post(`/admin/users/${userId}/reset-password`);
      toast({
        title: 'Sucesso',
        description: 'Email de reset de senha enviado',
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Erro ao resetar senha',
        variant: 'destructive',
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      ADMIN: 'destructive',
      PASTOR: 'default',
      SECRETARIO: 'secondary',
      TESOUREIRO: 'secondary',
      LIDER_MINISTERIO: 'outline',
      LIDER_CELULA: 'outline',
      DISCIPULADOR: 'outline',
      MEMBRO: 'default',
      MODERADOR: 'outline',
    };
    return variants[role] || 'default';
  };

  return (

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <TitleComponent title='Gestão de Usuários' description='Gerenciar usuários do sistema'/>
            
          </div>
          <ButtonNew nav="/admin/usuarios/novo" label="Novo Usuário" />
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por email ou nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-full sm:w-48 bg-gray-700 border-gray-600 text-white">
              <option value="ALL">Todas as roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="PASTOR">PASTOR</option>
              <option value="SECRETARIO">SECRETÁRIO</option>
              <option value="TESOUREIRO">TESOUREIRO</option>
              <option value="LIDER_MINISTERIO">LÍDER MINISTÉRIO</option>
              <option value="LIDER_CELULA">LÍDER CÉLULA</option>
              <option value="DISCIPULADOR">DISCIPULADOR</option>
              <option value="MEMBRO">MEMBRO</option>
              <option value="MODERADOR">MODERADOR</option>
            </Select>
        </div>

        {/* Tabela */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">
              Carregando usuários...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">
              Erro ao carregar usuários
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              Nenhum usuário encontrado
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                 <TableHead className="text-gray-300">Email</TableHead>
                     <TableHead className="text-gray-300">Nome</TableHead>
                     <TableHead className="text-gray-300">Role</TableHead>
                     <TableHead className="text-gray-300">Igreja</TableHead>
                     <TableHead className="text-gray-300">Status</TableHead>
                     <TableHead className="text-gray-300">Criado em</TableHead>
                     <TableHead className="text-gray-300 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data?.map((usuario: Usuario) => (
                    <TableRow key={usuario.id} className="border-gray-700">
                       <TableCell className="font-medium text-white">
                         {usuario.email}
                       </TableCell>
                       <TableCell className="text-gray-300">
                         {usuario.membro?.nome_completo || '-'}
                       </TableCell>
                       <TableCell>
                         <Badge variant={getRoleBadgeVariant(usuario.perfil)}>
                           {usuario.perfil}
                         </Badge>
                       </TableCell>
                       <TableCell>
                         <span className="px-2 py-1 rounded-full text-xs font-medium">
                           {usuario.igreja_id ? (
                             <span className="bg-blue-100 text-blue-800">
                               Vinculado
                             </span>
                           ) : (
                             <span className="bg-red-100 text-red-800">
                               Órfão
                             </span>
                           )}
                         </span>
                       </TableCell>
                       <TableCell>
                         <Badge variant="outline" className="border-green-500 text-green-400">
                           Ativo
                         </Badge>
                       </TableCell>
                       <TableCell className="text-gray-300">
                         {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                       </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="text-gray-400 hover:text-white h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                            <DropdownMenuItem
                              onClick={() => window.location.href = `/admin/usuarios/${usuario.id}`}
                              className="text-gray-200 hover:bg-gray-700"
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.location.href = `/admin/usuarios/${usuario.id}/edit`}
                              className="text-gray-200 hover:bg-gray-700"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleResetPassword(usuario.id)}
                              className="text-gray-200 hover:bg-gray-700"
                            >
                              <Key className="mr-2 h-4 w-4" />
                              Resetar Senha
                            </DropdownMenuItem>
                           <DropdownMenuItem
                             onClick={() => setDeleteUserId(usuario.id)}
                             className="text-red-400 hover:bg-red-900/20"
                           >
                             <Trash2 className="mr-2 h-4 w-4" />
                             Desativar
                           </DropdownMenuItem>
                           
                           {!usuario.igreja_id && (
                             <DropdownMenuItem
                               onClick={() => {
                                 // Open assign church modal
                                 setSelectedUserId(usuario.id);
                                 setIsAssignModalOpen(true);
                               }}
                               className="text-blue-400 hover:bg-blue-900/20"
                             >
                               <Users className="mr-2 h-4 w-4" />
                               Assinar à Igreja
                             </DropdownMenuItem>
                           )}
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
                    Página {page} de {data.pagination.total_pages}
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
        </div>

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
          <AlertDialogContent className="bg-gray-800 border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle>Desativar Usuário</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja desativar este usuário? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Desativar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div>
        {/* Modal para atribuir usuário a uma igreja */}
        <AlertDialog open={isAssignModalOpen} onOpenChange={() => setIsAssignModalOpen(false)}>
          <AlertDialogContent className="bg-gray-800 border-gray-700">
            <AlertDialogHeader>
               <AlertDialogTitle>Atribuir Usuário à Igreja</AlertDialogTitle>
               <AlertDialogDescription>
                 Selecione a igreja para vincular o usuário selecionado
               </AlertDialogDescription>
             </AlertDialogHeader>
             <div className="py-4">
               <Select value={assignChurchId || ''} onChange={(e) => setAssignChurchId(e.target.value)}>
                 {churches.map((church) => (
                   <option key={church.id} value={church.id}>
                     {church.nome}
                   </option>
                 ))}
               </Select>
             </div>
             <AlertDialogFooter>
               <AlertDialogCancel onClick={() => setIsAssignModalOpen(false)}>
                 Cancelar
               </AlertDialogCancel>
               <AlertDialogAction
                 onClick={async () => {
                   if (!selectedUserId || !assignChurchId) return;
                   setIsAssigning(true);
                   try {
                     await api.post(`/admin/users/${selectedUserId}/assign-church`, {
                       igreja_id: assignChurchId,
                     });
                     toast({
                       title: 'Sucesso',
                       description: 'Usuário atribuído à igreja com sucesso',
                     });
                     setIsAssignModalOpen(false);
                     setSelectedUserId(null);
                     setAssignChurchId(null);
                   } catch (error: any) {
                     toast({
                       title: 'Erro',
                       description: error.response?.data?.message || 'Erro ao atribuir usuário à igreja',
                       variant: 'destructive',
                     });
                   } finally {
                     setIsAssigning(false);
                   }
                 }}
                 disabled={isAssigning}
                 className="bg-blue-600 hover:bg-blue-700"
                >
                  {isAssigning ? 'Atribuindo...' : 'Atribuir'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        </div>
  );
}
