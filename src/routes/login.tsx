import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export const Route = createFileRoute("/login" as any)({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setError(null);
        await login(value.email, value.password);
        navigate({ to: "/" });
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Erro ao realizar login. Verifique suas credenciais.",
        );
      }
    },
  });

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 bg-white">
      {/* Logo no canto superior esquerdo - apenas texto */}
      <div className="fixed top-6 left-6">
        <span className="text-2xl font-bold text-blue-600">IgrejaConnect</span>
      </div>

      {/* Theme toggler no canto superior direito */}
      <div className="fixed top-6 right-6">
        <AnimatedThemeToggler />
      </div>

      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-300">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Login
          </h2>
          <p className="mt-2 text-base text-gray-700">
            Acesse sua conta para gerenciar a igreja
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-base font-medium text-red-800 border-2 border-red-300">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            <form.Field
              name="email"
              validators={{
                onChange: z.string().email("Email inválido"),
              }}
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-base font-semibold text-gray-900"
                  >
                    Email
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 sm:text-base"
                    placeholder="seu@email.com"
                    required
                  />
                  {field.state.meta.errors ? (
                    <em className="text-sm font-medium text-red-600">
                      {field.state.meta.errors.join(", ")}
                    </em>
                  ) : null}
                </div>
              )}
            />

            <form.Field
              name="password"
              validators={{
                onChange: z
                  .string()
                  .min(6, "A senha deve ter pelo menos 6 caracteres"),
              }}
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-base font-semibold text-gray-900"
                  >
                    Senha
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 sm:text-base"
                    placeholder="••••••••"
                    required
                  />
                  {field.state.meta.errors ? (
                    <em className="text-sm font-medium text-red-600">
                      {field.state.meta.errors.join(", ")}
                    </em>
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
                className="flex w-full justify-center rounded-lg bg-teal-600 px-4 py-3 text-base font-bold text-white shadow-lg shadow-teal-600/25 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-600/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </button>
            )}
          />
        </form>
      </div>
    </div>
  );
}
