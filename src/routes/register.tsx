import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { authService } from '@/services/auth-service'
import { useState } from 'react'

export const Route = createFileRoute('/register' as any)({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        setError('As senhas não coincidem')
        return
      }
      try {
        setError(null)
        await authService.register(value.email, value.password, value.name)
        setSuccess(true)
        setTimeout(() => navigate({ to: '/login' }), 2000)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao realizar cadastro.')
      }
    },
  })

  if (success) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-200 text-center">
          <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Cadastro realizado!</h2>
          <p className="text-gray-600">Sua conta foi criada com sucesso. Redirecionando para o login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Criar Conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Registre-se para começar a gerenciar sua igreja
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-100">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            <form.Field
              name="name"
              validators={{
                onChange: z.string().min(2, 'Nome muito curto'),
              }}
              children={(field) => (
                <div>
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-900">
                    Nome Completo
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 sm:text-sm"
                    placeholder="Seu Nome"
                    required
                  />
                  {field.state.meta.errors ? (
                    <em className="text-xs text-red-600">{field.state.meta.errors.join(', ')}</em>
                  ) : null}
                </div>
              )}
            />

            <form.Field
              name="email"
              validators={{
                onChange: z.string().email('Email inválido'),
              }}
              children={(field) => (
                <div>
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-900">
                    Email
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 sm:text-sm"
                    placeholder="seu@email.com"
                    required
                  />
                  {field.state.meta.errors ? (
                    <em className="text-xs text-red-600">{field.state.meta.errors.join(', ')}</em>
                  ) : null}
                </div>
              )}
            />

            <form.Field
              name="password"
              validators={{
                onChange: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
              }}
              children={(field) => (
                <div>
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-900">
                    Senha
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 sm:text-sm"
                    placeholder="••••••••"
                    required
                  />
                  {field.state.meta.errors ? (
                    <em className="text-xs text-red-600">{field.state.meta.errors.join(', ')}</em>
                  ) : null}
                </div>
              )}
            />

            <form.Field
              name="confirmPassword"
              children={(field) => (
                <div>
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-900">
                    Confirmar Senha
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 sm:text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}
            />
          </div>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="flex w-full justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Criando conta...' : 'Cadastrar'}
              </button>
            )}
          />

          <div className="text-center text-sm">
            <span className="text-gray-600">Já tem uma conta? </span>
            <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700">
              Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
