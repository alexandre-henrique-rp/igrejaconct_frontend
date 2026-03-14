import { createFileRoute } from '@tanstack/react-router';
import { PrivateRoute } from '@/components/PrivateRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PermissionGuard } from '@/components/PermissionGuard';
import { AdminLayout } from '@/layouts/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api-client';
import { 
  Settings, 
  Server, 
  Shield,
  Mail,
  MessageSquare,
  Bell,
  Lock,
  Clock
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

export const Route = createFileRoute('/admin/sistema/')({
  component: () => (
    <PrivateRoute>
      <DashboardLayout>
      <PermissionGuard resource="admin" action="read">
        <AdminLayout>
          <SistemaPage />
        </AdminLayout>
      </PermissionGuard>
    </DashboardLayout>
    </PrivateRoute>
  ),
});

function SistemaPage() {
  const [config, setConfig] = useState({
    system_name: 'IgrejaConnect',
    admin_email: 'admin@igreja.com',
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_pass: '',
    telegram_bot_token: '',
    telegram_chat_id: '',
    password_min_length: 8,
    require_2fa: false,
    session_timeout_minutes: 60,
    rate_limit_requests_per_minute: 100,
    auto_backup_enabled: true,
    auto_backup_frequency: 'daily',
    backup_retention_days: 30,
  });

  const handleSave = async () => {
    try {
      await api.put('/admin/sistema/config', config);
      toast({
        title: 'Sucesso',
        description: 'Configurações salvas com sucesso',
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Erro ao salvar configurações',
        variant: 'destructive',
      });
    }
  };

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Configurações do Sistema
            </h1>
            <p className="text-gray-400">
              Gerencie configurações globais do sistema
            </p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Settings className="h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sistema */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Server className="h-5 w-5" />
                Sistema
              </CardTitle>
              <CardDescription>
                Informações e configurações gerais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system_name" className="text-gray-200">Nome do Sistema</Label>
                <Input
                  id="system_name"
                  value={config.system_name}
                  onChange={(e) => setConfig({ ...config, system_name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin_email" className="text-gray-200">Email do Administrador</Label>
                <Input
                  id="admin_email"
                  type="email"
                  value={config.admin_email}
                  onChange={(e) => setConfig({ ...config, admin_email: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-2">
                <Label htmlFor="password_min_length" className="text-gray-200">
                  Tamanho mínimo da senha
                </Label>
                <Input
                  id="password_min_length"
                  type="number"
                  min={6}
                  max={32}
                  value={config.password_min_length}
                  onChange={(e) => setConfig({ ...config, password_min_length: parseInt(e.target.value) })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="require_2fa" className="text-gray-200">
                  Exigir autenticação em duas etapas (2FA)
                </Label>
                <Switch
                  id="require_2fa"
                  checked={config.require_2fa}
                  onCheckedChange={(checked) => setConfig({ ...config, require_2fa: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session_timeout_minutes" className="text-gray-200">
                  Timeout de sessão (minutos)
                </Label>
                <Input
                  id="session_timeout_minutes"
                  type="number"
                  min={5}
                  value={config.session_timeout_minutes}
                  onChange={(e) => setConfig({ ...config, session_timeout_minutes: parseInt(e.target.value) })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Email */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Configurações de Email
              </CardTitle>
              <CardDescription>
                Configurações SMTP para envio de emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_host" className="text-gray-200">Servidor SMTP</Label>
                <Input
                  id="smtp_host"
                  placeholder="smtp.gmail.com"
                  value={config.smtp_host}
                  onChange={(e) => setConfig({ ...config, smtp_host: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp_port" className="text-gray-200">Porta</Label>
                  <Input
                    id="smtp_port"
                    type="number"
                    placeholder="587"
                    value={config.smtp_port}
                    onChange={(e) => setConfig({ ...config, smtp_port: parseInt(e.target.value) })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtp_user" className="text-gray-200">Usuário</Label>
                  <Input
                    id="smtp_user"
                    placeholder="usuario@email.com"
                    value={config.smtp_user}
                    onChange={(e) => setConfig({ ...config, smtp_user: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp_pass" className="text-gray-200">Senha</Label>
                <Input
                  id="smtp_pass"
                  type="password"
                  value={config.smtp_pass}
                  onChange={(e) => setConfig({ ...config, smtp_pass: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Telegram */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Telegram Bot
              </CardTitle>
              <CardDescription>
                Configurações do bot do Telegram
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="telegram_bot_token" className="text-gray-200">Bot Token</Label>
                <Input
                  id="telegram_bot_token"
                  placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                  value={config.telegram_bot_token}
                  onChange={(e) => setConfig({ ...config, telegram_bot_token: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-400">
                  Obtenha em @BotFather no Telegram
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram_chat_id" className="text-gray-200">Chat ID do Admin</Label>
                <Input
                  id="telegram_chat_id"
                  placeholder="123456789"
                  value={config.telegram_chat_id}
                  onChange={(e) => setConfig({ ...config, telegram_chat_id: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-400">
                  ID do chat para receber notificações
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Backup */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Backup Automático
              </CardTitle>
              <CardDescription>
                Configurações de backup do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto_backup_enabled" className="text-gray-200">
                  Backup automático ativado
                </Label>
                <Switch
                  id="auto_backup_enabled"
                  checked={config.auto_backup_enabled}
                  onCheckedChange={(checked) => setConfig({ ...config, auto_backup_enabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="auto_backup_frequency" className="text-gray-200">
                  Frequência
                </Label>
                <select
                  id="auto_backup_frequency"
                  value={config.auto_backup_frequency}
                  onChange={(e) => setConfig({ ...config, auto_backup_frequency: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                >
                  <option value="daily">Diariamente</option>
                  <option value="weekly">Semanalmente</option>
                  <option value="monthly">Mensalmente</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup_retention_days" className="text-gray-200">
                  Retenção (dias)
                </Label>
                <Input
                  id="backup_retention_days"
                  type="number"
                  min={1}
                  value={config.backup_retention_days}
                  onChange={(e) => setConfig({ ...config, backup_retention_days: parseInt(e.target.value) })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-400">
                  Por quantos dias manter os backups
                </p>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full gap-2">
                  <Clock className="h-4 w-4" />
                  Executar Backup Manual
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Segurança
              </CardTitle>
              <CardDescription>
                Configurações de segurança e rate limiting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rate_limit_requests_per_minute" className="text-gray-200">
                  Rate limit (requisições por minuto)
                </Label>
                <Input
                  id="rate_limit_requests_per_minute"
                  type="number"
                  min={10}
                  value={config.rate_limit_requests_per_minute}
                  onChange={(e) => setConfig({ ...config, rate_limit_requests_per_minute: parseInt(e.target.value) })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-400">
                  Limite de requisições por IP por minuto
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="require_2fa" className="text-gray-200">
                  Exigir 2FA para todos os usuários
                </Label>
                <Switch
                  id="require_2fa"
                  checked={config.require_2fa}
                  onCheckedChange={(checked) => setConfig({ ...config, require_2fa: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
