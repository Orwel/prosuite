import { Globe, Plus } from "lucide-react";

interface WebScrapingHeaderProps {
  onAddSite: () => void;
}

export default function WebScrapingHeader({ onAddSite }: WebScrapingHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Globe className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sistema de Web Scraping
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Monitoreo y extracción de datos en tiempo real
              </p>
            </div>
          </div>
          <button
            onClick={onAddSite}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Agregar Sitio
          </button>
        </div>
      </div>
    </div>
  );
} 