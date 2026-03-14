interface TitleComponentProps {
  title: string;
  description?: string;
}

/**
 * Componente de título com descrição
 * Segue o style guide: display-title text-gray-900 para título
 * e text-sm text-gray-600 mt-1 para descrição
 */
export const TitleComponent = ({ title, description }: TitleComponentProps) => {
  return (
    <div>
      <h1 className="text-2xl font-bold display-title text-blue-600">{title}</h1>
      {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
    </div>
  );
};