import { useState, useEffect } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membrosService } from "../../membros-service";
import { arquivosService } from "#/features/arquivos/arquivos-service";
import type { CreateMembroDto } from "../../types";
import { useToast } from "@/contexts/ToastContext";
import { Upload, X, User, Loader2 } from "lucide-react";
import { SkeletonCard } from "@/components/skeleton/SkeletonCard";
import { TitleComponent } from "#/components/TitleComponent";

export function MemberForm() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/membros/$id/edit" });
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const isEditing = Boolean(id);

  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<CreateMembroDto>({
    nome_completo: "",
    cpf: "",
    email: "",
    telefone: "",
    whatsapp: "",
    data_nascimento: "",
    genero: "",
    estado_civil: "",
    profissao: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    tipo_membro: "CONGREGADO",
  });

  const { data: membro, isLoading } = useQuery({
    queryKey: ["membro", id],
    queryFn: () => membrosService.getById(id),
    enabled: isEditing,
  });

  useEffect(() => {
    if (membro) {
      setFormData({
        nome_completo: membro.nome_completo,
        cpf: membro.cpf || "",
        email: membro.email || "",
        telefone: membro.telefone,
        whatsapp: membro.whatsapp || "",
        data_nascimento: membro.data_nascimento?.split("T")[0] || "",
        genero: membro.genero || "",
        estado_civil: membro.estado_civil || "",
        profissao: membro.profissao || "",
        cep: membro.cep || "",
        endereco: membro.endereco || "",
        numero: membro.numero || "",
        complemento: membro.complemento || "",
        bairro: membro.bairro || "",
        cidade: membro.cidade || "",
        estado: membro.estado || "",
        tipo_membro: membro.tipo_membro,
        foto_url: membro.foto_url || "",
      });
      if (membro.foto_url) {
        setPhotoPreview(membro.foto_url);
      }
    }
  }, [membro]);

  const createMutation = useMutation({
    mutationFn: membrosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membros"] });
      success("Membro criado com sucesso!");
      navigate({ to: "/membros" });
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || "Erro ao criar membro");
      setSaving(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateMembroDto) => membrosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membros"] });
      queryClient.invalidateQueries({ queryKey: ["membro", id] });
      success("Membro atualizado com sucesso!");
      navigate({ to: "/membros/$id", params: { id } });
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || "Erro ao atualizar membro");
      setSaving(false);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let fotoUrl = formData.foto_url || "";

      if (photoFile) {
        setUploadingPhoto(true);
        try {
          const uploaded = await arquivosService.upload(photoFile, "fotos");
          fotoUrl = uploaded.url;
        } catch (uploadErr) {
          showError("Erro ao fazer upload da foto");
          setSaving(false);
          setUploadingPhoto(false);
          return;
        }
        setUploadingPhoto(false);
      }

      const dataToSubmit = { ...formData, foto_url: fotoUrl };

      if (isEditing) {
        updateMutation.mutate(dataToSubmit);
      } else {
        createMutation.mutate(dataToSubmit);
      }
    } catch (err) {
      showError("Erro ao salvar membro");
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <TitleComponent title={isEditing ? "Editar Membro" : "Novo Membro"} />
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-24 h-24 rounded-full bg-teal-600/10 overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-200">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Foto"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-teal-600" />
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg cursor-pointer hover:bg-teal-700 transition-colors">
              <Upload className="w-4 h-4" />
              {uploadingPhoto ? "Enviando..." : "Enviar Foto"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPhotoFile(file);
                    setPhotoPreview(URL.createObjectURL(file));
                  }
                }}
                className="hidden"
                disabled={uploadingPhoto}
              />
            </label>
            {photoPreview && photoPreview !== formData.foto_url && (
              <button
                type="button"
                onClick={() => {
                  setPhotoFile(null);
                  setPhotoPreview(null);
                  setFormData({ ...formData, foto_url: "" });
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Remover
              </button>
            )}
            <p className="text-xs text-gray-600 mt-1">JPG, PNG até 5MB</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Nome Completo *
              </label>
              <input
                type="text"
                name="nome_completo"
                value={formData.nome_completo}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                CPF
              </label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Telefone *
              </label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                WhatsApp
              </label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Data de Nascimento
              </label>
              <input
                type="date"
                name="data_nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Gênero
              </label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Estado Civil
              </label>
              <select
                name="estado_civil"
                value={formData.estado_civil}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="SOLTEIRO">Solteiro</option>
                <option value="CASADO">Casado</option>
                <option value="DIVORCIADO">Divorciado</option>
                <option value="VIUVO">Viúvo</option>
                <option value="UNIAO_ESTAVEL">União Estável</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Profissão
              </label>
              <input
                type="text"
                name="profissao"
                value={formData.profissao}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Tipo de Membro
              </label>
              <select
                name="tipo_membro"
                value={formData.tipo_membro}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              >
                <option value="CONGREGADO">Congregado</option>
                <option value="ATIVO">Ativo</option>
                <option value="VISITANTE">Visitante</option>
                <option value="AFASTADO">Afastado</option>
                <option value="TRANSFERIDO">Transferido</option>
                <option value="FALECIDO">Falecido</option>
              </select>
            </div>
          </div>

          <fieldset className="border border-gray-200 p-4 rounded-lg">
            <legend className="font-semibold px-2 text-gray-900">
              Endereço
            </legend>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900">
                  CEP
                </label>
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-900">
                  Endereço
                </label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900">
                  Número
                </label>
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900">
                  Complemento
                </label>
                <input
                  type="text"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900">
                  Bairro
                </label>
                <input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900">
                  Cidade
                </label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900">
                  Estado
                </label>
                <input
                  type="text"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>
            </div>
          </fieldset>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving || uploadingPhoto}
              className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              {saving || uploadingPhoto ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </button>
            <button
              type="button"
              onClick={() =>
                navigate({
                  to: isEditing ? "/membros/$id" : "/membros",
                  params: isEditing ? { id } : {},
                })
              }
              className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-teal-600/5 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
