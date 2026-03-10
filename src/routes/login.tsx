import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

export const Route = createFileRoute('/login' as any)({
  component: LoginPage,
})

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        setError(null)
        await login(value.email, value.password)
        navigate({ to: '/' })
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao realizar login. Verifique suas credenciais.')
      }
    },
  })

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-[var(--line)]">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--sea-ink)]">
            Login
          </h2>
          <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
            Acesse sua conta para gerenciar a igreja
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
              name="email"
              validators={{
                onChange: z.string().email('Email inválido'),
              }}
              children={(field) => (
                <div>
                  <label htmlFor={field.name} className="block text-sm font-medium text-[var(--sea-ink)]">
                    Email
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-[var(--line)] px-3 py-2 text-[var(--sea-ink)] shadow-sm focus:border-[var(--lagoon)] focus:outline-none focus:ring-1 focus:ring-[var(--lagoon)] sm:text-sm"
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
                  <label htmlFor={field.name} className="block text-sm font-medium text-[var(--sea-ink)]">
                    Senha
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-[var(--line)] px-3 py-2 text-[var(--sea-ink)] shadow-sm focus:border-[var(--lagoon)] focus:outline-none focus:ring-1 focus:ring-[var(--lagoon)] sm:text-sm"
                    placeholder="••••••••"
                    required
                  />
                  {field.state.meta.errors ? (
                    <em className="text-xs text-red-600">{field.state.meta.errors.join(', ')}</em>
                  ) : null}
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
                className="flex w-full justify-center rounded-lg bg-[var(--lagoon)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--lagoon-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lagoon)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>
            )}
          />
        </form>
      </div>
    </div>
  )
}
