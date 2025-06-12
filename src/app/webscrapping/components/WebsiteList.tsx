import { Play, Pause, Download, Settings, Trash2, Eye, Search, BarChart3 } from "lucide-react";

export interface Website {
  id: string;
  url: string;
  name: string;
  selector: string;
  interval: number;
  isActive: boolean;
  lastScrape: string;
  status: 'running' | 'paused' | 'error' | 'idle';
  data?: Array<{
    index: number;
    text: string;
    html: string;
    tagName: string;
  }>;
  keywords?: string[];
  analysisOptions?: {
    extractCSS: boolean;
    extractHTML: boolean;
    extractJS: boolean;
    extractImages: boolean;
    extractLinks: boolean;
    extractMetadata: boolean;
    deepScan: boolean;
  };
}

interface WebsiteListProps {
  websites: Website[];
  onToggleStatus: (id: string) => void;
  onStartScraping: (id: string) => void;
  onExportData: (id: string) => void;
  onSettings: (id: string) => void;
  onDelete: (id: string) => void;
  onViewResults: (id: string) => void;
  onAnalyze: (id: string) => void;
  onViewAnalysis: (id: string) => void;
}

export default function WebsiteList({
  websites,
  onToggleStatus,
  onStartScraping,
  onExportData,
  onSettings,
  onDelete,
  onViewResults,
  onAnalyze,
  onViewAnalysis
}: WebsiteListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar "' + name + '"? Esta acción no se puede deshacer.')) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Sitios Web Configurados
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Gestiona tus sitios web y análisis de contenido
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {websites.map((website) => (
            <div
              key={website.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(website.status)}`} />
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {website.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(website.status)}`}>
                      {website.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">URL:</span> {website.url}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Selector:</span> {website.selector}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Intervalo:</span> {website.interval / 60000} minutos
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Último scraping:</span> {website.lastScrape}
                    </p>
                    
                    {website.keywords && website.keywords.length > 0 && (
                      <div className="mt-2">
                        <p className="text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">
                          Palabras clave:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {website.keywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {website.analysisOptions && (
                      <div className="mt-2">
                        <p className="text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">
                          Análisis habilitado:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {website.analysisOptions.extractHTML && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded">HTML</span>
                          )}
                          {website.analysisOptions.extractCSS && (
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 text-xs rounded">CSS</span>
                          )}
                          {website.analysisOptions.extractJS && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded">JS</span>
                          )}
                          {website.analysisOptions.extractImages && (
                            <span className="bg-pink-100 text-pink-800 px-2 py-1 text-xs rounded">Imágenes</span>
                          )}
                          {website.analysisOptions.extractLinks && (
                            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 text-xs rounded">Enlaces</span>
                          )}
                          {website.analysisOptions.deepScan && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded">Análisis Profundo</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  {/* Controles principales */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => website.status === 'running' ? 
                        onToggleStatus(website.id) : 
                        onStartScraping(website.id)
                      }
                      className={`p-2 rounded-lg transition-colors ${
                        website.status === 'running' 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                      title={website.status === 'running' ? 'Pausar scraping' : 'Iniciar scraping'}
                    >
                      {website.status === 'running' ? 
                        <Pause className="h-4 w-4" /> : 
                        <Play className="h-4 w-4" />
                      }
                    </button>
                    
                    <button
                      onClick={() => onSettings(website.id)}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      title="Configurar sitio"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(website.id, website.name)}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      title="Eliminar sitio"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Opciones de análisis y resultados */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewResults(website.id)}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      title="Ver datos extraídos"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => onAnalyze(website.id)}
                      className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                      title="Realizar análisis profundo"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => onViewAnalysis(website.id)}
                      className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                      title="Ver análisis completo"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => onExportData(website.id)}
                      className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                      title="Exportar datos"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {websites.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay sitios web configurados
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Comienza agregando tu primer sitio web para análisis y scraping.
              </p>
              <p className="text-sm text-gray-400">
                Haz clic en &quot;Agregar Sitio&quot; para comenzar con el análisis profundo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 