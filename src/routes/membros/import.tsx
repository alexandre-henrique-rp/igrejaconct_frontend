import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/membros/import")({
  component: MembrosImportPage,
});

function MembrosImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    imported?: number;
    errors?: string[];
  } | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.type === "text/csv" ||
        droppedFile.type === "application/vnd.ms-excel" ||
        droppedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    ) {
      setFile(droppedFile);
      setUploadResult(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      // TODO: Implement actual upload logic
      // This is a placeholder for the actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setUploadResult({
        success: true,
        message: "Membros importados com sucesso!",
        imported: 42,
      });
    } catch (error) {
      setUploadResult({
        success: false,
        message: "Erro ao importar membros",
        errors: [
          "Formato de arquivo inválido",
          'Coluna obrigatória "nome" não encontrada',
        ],
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Importar Membros
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Importe membros em massa usando um arquivo CSV ou Excel
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />

          <div className="mb-4">
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Arraste seu arquivo para cá
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ou clique para selecionar um arquivo
            </p>
          </div>

          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />

          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            Selecionar Arquivo
          </label>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Formatos aceitos: CSV, XLS, XLSX
          </p>
        </div>

        {/* Selected File */}
        {file && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setFile(null);
                  setUploadResult(null);
                }}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Remover
              </button>
            </div>
          </div>
        )}

        {/* Upload Button */}
        {file && (
          <div className="mt-6">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isUploading ? "Importando..." : "Importar Membros"}
            </button>
          </div>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              uploadResult.success
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex items-start">
              {uploadResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5" />
              )}

              <div>
                <p
                  className={`font-medium ${
                    uploadResult.success
                      ? "text-green-900 dark:text-green-100"
                      : "text-red-900 dark:text-red-100"
                  }`}
                >
                  {uploadResult.message}
                </p>

                {uploadResult.success && uploadResult.imported && (
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    {uploadResult.imported} membros importados com sucesso
                  </p>
                )}

                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <ul className="mt-2 text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                    {uploadResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Instruções de Importação
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>
              • O arquivo deve conter as colunas: nome, email, telefone,
              data_nascimento
            </li>
            <li>• A coluna "nome" é obrigatória</li>
            <li>• Datas devem estar no formato DD/MM/AAAA</li>
            <li>• Membros com emails duplicados serão ignorados</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
