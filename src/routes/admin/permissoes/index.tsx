import { createFileRoute } from '@tanstack/react-router';
import { PrivateRoute } from '@/components/PrivateRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PermissionGuard } from '@/components/PermissionGuard';
import { AdminLayout } from '@/layouts/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api-client';
import { 
  Shield, 
  Plus, 
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Role } from '@/types/auth';

export const Route = createFileRoute('/admin/permissoes/')({
  component: () => (
    <PrivateRoute>
      <DashboardLayout>
      <PermissionGuard resource="admin" action="update">
        <AdminLayout>
          <PermissoesPage />
        </AdminLayout>
      </PermissionGuard>
    </DashboardLayout>
    </PrivateRoute>
  ),
});

function PermissoesPage() {
  const [selectedRole, setSelectedRole] = useState<Role>('MEMBRO');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPermission, setNewPermission] = useState({ resource: '', action: '*' });

  const { data: permissionsData, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'permissoes', selectedRole],
    queryFn: async () => {
      const response = await api.get(`/admin/permissions/roles/${selectedRole}`);
      return response.data;
    },
  });

  const handleAddPermission = async () => {
    try {
      await api.post(`/admin/permissions/roles/${selectedRole}/permissions`, newPermission);
      toast({
        title: 'Sucesso',
        description: 'Permissão adicionada com sucesso',
      });
      setIsAddDialogOpen(false);
      setNewPermission({ resource: '', action: '*' });
      refetch();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Erro ao adicionar permissão',
        variant: 'destructive',
      });
    }
  };

  const handleRemovePermission = async (permissionId: string) => {
    try {
      await api.delete(`/admin/permissions/${permissionId}`);
      toast({
        title: 'Sucesso',
        description: 'Permissão removida com sucesso',
      });
      refetch();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Erro ao remover permissão',
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

  const actions = [
    { value: 'read', label: 'Ler' },
    { value: 'create', label: 'Criar' },
    { value: 'update', label: 'Editar' },
    { value: 'delete', label: 'Excluir' },
    { value: '*', label: 'Todas (*)' },
  ];

  const resources = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'membros', label: 'Membros' },
    { value: 'celulas', label: 'Células' },
    { value: 'ministerios', label: 'Ministérios' },
    { value: 'eventos', label: 'Eventos' },
    { value: 'financeiro', label: 'Financeiro' },
    { value: 'escola-biblica', label: 'Escola Bíblica' },
    { value: 'relatorios', label: 'Relatórios' },
    { value: 'patrimonio', label: 'Patrimônio' },
    { value: 'arquivos', label: 'Arquivos' },
    { value: 'historico', label: 'Histórico Pastoral' },
    { value: 'presenca', label: 'Presença' },
  ];

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Gerenciamento de Permissões
            </h1>
            <p className="text-gray-400">
              Configure as permissões de acesso por role
            </p>
          </div>
        </div>

        {/* Seletor de Role */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <Shield className="h-5 w-5 text-blue-400" />
            <label className="text-gray-200 font-medium">Selecione a Role:</label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as Role)}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lista de Permissões */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              Permissões de {selectedRole.replace('_', ' ')}
            </h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Permissão
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Permissão</DialogTitle>
                  <DialogDescription>
                    Adicione uma nova permissão para a role {selectedRole.replace('_', ' ')}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-200">Recurso</label>
                    <Select 
                      value={newPermission.resource}
                      onValueChange={(value) => setNewPermission({ ...newPermission, resource: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Selecione um recurso" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {resources.map((res) => (
                          <SelectItem key={res.value} value={res.value}>
                            {res.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-200">Ação</label>
                    <Select 
                      value={newPermission.action}
                      onValueChange={(value) => setNewPermission({ ...newPermission, action: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Selecione uma ação" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {actions.map((act) => (
                          <SelectItem key={act.value} value={act.value}>
                            {act.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddPermission} disabled={!newPermission.resource}>
                    Adicionar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-400">
              Carregando permissões...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">
              Erro ao carregar permissões
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Recurso</TableHead>
                  <TableHead className="text-gray-300">Ação</TableHead>
                  <TableHead className="text-gray-300 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissionsData?.permissions?.length === 0 ? (
                  <TableRow className="border-gray-700">
                    <TableCell colSpan={3} className="text-center py-8 text-gray-400">
                      Nenhuma permissão configurada para esta role
                    </TableCell>
                  </TableRow>
                ) : (
                  permissionsData?.permissions?.map((perm: any) => (
                    <TableRow key={perm.id} className="border-gray-700">
                      <TableCell className="text-white font-medium">
                        {perm.resource}
                      </TableCell>
                      <TableCell>
                        <Badge variant={perm.action === '*' ? 'destructive' : 'default'}>
                          {perm.action === '*' ? 'todas' : perm.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePermission(perm.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="text-sm">
              <h4 className="text-blue-400 font-medium mb-1">Informações sobre Permissões</h4>
              <ul className="text-gray-300 space-y-1 text-xs">
                <li>• Permissões definem o que cada role pode fazer no sistema</li>
                <li>• A role ADMIN tem implicitamente todas as permissões (wildcard)</li>
                <li>• Use '*' para conceder todas as ações sobre um recurso</li>
                <li>• Alterações são aplicadas imediatamente aos usuários com a role</li>
                <li>• Permissões são validadas tanto no frontend quanto no backend</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
}
