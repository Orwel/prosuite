import { useState } from "react";
import { X, ChevronDown, ChevronRight, Copy, ExternalLink, Image, Link, Code, Search, BarChart3, Globe, Clock, Zap } from "lucide-react";

interface AnalysisResult {
  url: string;
  timestamp: string;
  basicInfo: {
    title: string;
    description: string;
    favicon: string;
    language: string;
  };
  content: {
    text: string;
    html: string;
    structure: any;
  };
  keywords: {
    found: string[];
    positions: Array<{
      keyword: string;
      element: string;
      text: string;
      selector: string;
      position: number;
    }>;
  };
  assets: {
    images: Array<{ src: string; alt: string; title: string }>;
    links: Array<{ href: string; text: string; type: string }>;
    scripts: string[];
    stylesheets: string[];
  };
  technical: {
    frameworks: string[];
    technologies: string[];
    performance: {
      loadTime: number;
      domElements: number;
      requests: number;
    };
  };
  seo: {
    metaTags: Array<{ name: string; content: string }>;
    headings: Array<{ level: number; text: string }>;
    altTexts: string[];
  };
  errors: string[];
}

interface AnalysisResultsProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult | null;
  mode: 'real' | 'simulated';
}

export default function AnalysisResults({ isOpen, onClose, result, mode }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    basicInfo: true,
    keywords: true,
    performance: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Aquí podrías agregar una notificación de éxito
  };

  if (!isOpen || !result) return null;

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'content', label: 'Contenido', icon: Code },
    { id: 'keywords', label: 'Palabras Clave', icon: Search },
    { id: 'assets', label: 'Recursos', icon: Image },
    { id: 'technical', label: 'Técnico', icon: Zap },
    { id: 'seo', label: 'SEO', icon: Globe }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Análisis Profundo - {result.basicInfo.title}
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {result.url}
              </p>
              <span className={`px-2 py-1 text-xs rounded-full ${
                mode === 'real' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {mode === 'real' ? 'Análisis Real' : 'Modo Simulación'}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(result.timestamp).toLocaleString('es-ES')}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Información Básica */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <button
                  onClick={() => toggleSection('basicInfo')}
                  className="flex items-center gap-2 w-full text-left"
                >
                  {expandedSections.basicInfo ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Información Básica
                  </h3>
                </button>
                {expandedSections.basicInfo && (
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Título</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{result.basicInfo.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Idioma</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{result.basicInfo.language}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{result.basicInfo.description || 'No disponible'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Performance */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <button
                  onClick={() => toggleSection('performance')}
                  className="flex items-center gap-2 w-full text-left"
                >
                  {expandedSections.performance ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Rendimiento
                  </h3>
                </button>
                {expandedSections.performance && (
                  <div className="mt-3 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(result.technical.performance.loadTime)}ms
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Tiempo de Carga</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {result.technical.performance.domElements}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Elementos DOM</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {result.technical.performance.requests}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Requests</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Palabras Clave Encontradas */}
              {result.keywords.found.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Palabras Clave Encontradas ({result.keywords.found.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.found.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tecnologías Detectadas */}
              {(result.technical.frameworks.length > 0 || result.technical.technologies.length > 0) && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Tecnologías Detectadas
                  </h3>
                  <div className="space-y-2">
                    {result.technical.frameworks.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Frameworks:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {result.technical.frameworks.map((framework, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                            >
                              {framework}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.technical.technologies.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Tecnologías:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {result.technical.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Contenido Extraído</h3>
                  <button
                    onClick={() => copyToClipboard(result.content.text)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded border p-3 max-h-64 overflow-y-auto">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {result.content.text}
                  </pre>
                </div>
              </div>

              {result.content.html && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">HTML Extraído</h3>
                    <button
                      onClick={() => copyToClipboard(result.content.html)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded border p-3 max-h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-700 dark:text-gray-300">
                      {result.content.html}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'keywords' && (
            <div className="space-y-4">
              {result.keywords.found.length > 0 ? (
                <>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      Palabras Clave Encontradas ({result.keywords.found.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords.found.map((keyword, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Posiciones Encontradas
                    </h3>
                    {result.keywords.positions.map((position, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {position.keyword}
                          </span>
                          <span className="text-sm text-gray-500">
                            en {position.element}
                          </span>
                          <code className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                            {position.selector}
                          </code>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          "{position.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No se encontraron las palabras clave especificadas
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-6">
              {/* Imágenes */}
              {result.assets.images.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Imágenes ({result.assets.images.length})
                  </h3>
                  <div className="space-y-2">
                    {result.assets.images.map((image, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                        <Image className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {image.alt || 'Sin alt text'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {image.src}
                          </p>
                        </div>
                        <button
                          onClick={() => window.open(image.src, '_blank')}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enlaces */}
              {result.assets.links.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Enlaces ({result.assets.links.length})
                  </h3>
                  <div className="space-y-2">
                    {result.assets.links.slice(0, 10).map((link, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                        <Link className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {link.text || 'Sin texto'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {link.href}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${
                          link.type === 'email' ? 'bg-blue-100 text-blue-800' :
                          link.type === 'phone' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {link.type}
                        </span>
                        <button
                          onClick={() => window.open(link.href, '_blank')}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {result.assets.links.length > 10 && (
                      <p className="text-sm text-gray-500 text-center">
                        ... y {result.assets.links.length - 10} enlaces más
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="space-y-6">
              {/* Performance */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Métricas de Rendimiento
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(result.technical.performance.loadTime)}ms
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Tiempo de Carga</div>
                  </div>
                  <div className="text-center">
                    <Code className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {result.technical.performance.domElements}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Elementos DOM</div>
                  </div>
                  <div className="text-center">
                    <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {result.technical.performance.requests}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Requests HTTP</div>
                  </div>
                </div>
              </div>

              {/* Scripts y Stylesheets */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Scripts ({result.assets.scripts.length})
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {result.assets.scripts.map((script, index) => (
                      <p key={index} className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {script}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Stylesheets ({result.assets.stylesheets.length})
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {result.assets.stylesheets.map((stylesheet, index) => (
                      <p key={index} className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {stylesheet}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              {/* Meta Tags */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Meta Tags ({result.seo.metaTags.length})
                </h3>
                <div className="space-y-2">
                  {result.seo.metaTags.map((meta, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {meta.name}
                        </code>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {meta.content}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Headings */}
              {result.seo.headings.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Estructura de Encabezados ({result.seo.headings.length})
                  </h3>
                  <div className="space-y-2">
                    {result.seo.headings.map((heading, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className={`px-2 py-1 text-xs rounded font-mono ${
                          heading.level === 1 ? 'bg-red-100 text-red-800' :
                          heading.level === 2 ? 'bg-orange-100 text-orange-800' :
                          heading.level === 3 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          H{heading.level}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {heading.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Errores */}
          {result.errors.length > 0 && (
            <div className="mt-6 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                Errores y Advertencias
              </h3>
              <ul className="space-y-1">
                {result.errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700 dark:text-red-400">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 