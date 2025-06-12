import { useState } from "react";
import { X, Plus, Trash2, HelpCircle } from "lucide-react";

interface NewSiteData {
  name: string;
  url: string;
  selector: string;
  interval: number;
  keywords: string[];
  analysisOptions: {
    extractCSS: boolean;
    extractHTML: boolean;
    extractJS: boolean;
    extractImages: boolean;
    extractLinks: boolean;
    extractMetadata: boolean;
    deepScan: boolean;
  };
  alerts: {
    email: string;
    webhook: string;
    conditions: string[];
  };
}

interface AddSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (siteData: NewSiteData) => void;
}

export default function AddSiteModal({ isOpen, onClose, onAdd }: AddSiteModalProps) {
  const [formData, setFormData] = useState<NewSiteData>({
    name: '',
    url: '',
    selector: '',
    interval: 300000,
    keywords: [],
    analysisOptions: {
      extractCSS: true,
      extractHTML: true,
      extractJS: true,
      extractImages: false,
      extractLinks: true,
      extractMetadata: true,
      deepScan: false
    },
    alerts: {
      email: '',
      webhook: '',
      conditions: []
    }
  });

  const [currentKeyword, setCurrentKeyword] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [useAdvancedSelector, setUseAdvancedSelector] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('');

  // Selectores predefinidos para usuarios no técnicos
  const selectorPresets = [
    { 
      name: 'Contenido General', 
      value: 'body', 
      description: 'Extrae todo el contenido visible de la página' 
    },
    { 
      name: 'Títulos Principales', 
      value: 'h1, h2, h3', 
      description: 'Extrae todos los títulos y subtítulos' 
    },
    { 
      name: 'Párrafos de Texto', 
      value: 'p', 
      description: 'Extrae todos los párrafos de texto' 
    },
    { 
      name: 'Enlaces', 
      value: 'a', 
      description: 'Extrae todos los enlaces de la página' 
    },
    { 
      name: 'Listas', 
      value: 'ul, ol, li', 
      description: 'Extrae listas y elementos de lista' 
    },
    { 
      name: 'Contenido Principal', 
      value: 'main, article, .content, #content', 
      description: 'Busca el área de contenido principal' 
    },
    { 
      name: 'Precios (Común)', 
      value: '.price, .precio, [data-price], .cost', 
      description: 'Busca elementos que suelen contener precios' 
    },
    { 
      name: 'Productos', 
      value: '.product, .item, .card', 
      description: 'Busca elementos que suelen ser productos o tarjetas' 
    }
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.url.trim()) {
      newErrors.url = 'La URL es requerida';
    } else if (!/^https?:\/\/.+/.test(formData.url)) {
      newErrors.url = 'Debe ser una URL válida (http:// o https://)';
    }
    
    // El selector ya no es obligatorio - se usará 'body' por defecto
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Si no hay selector, usar 'body' por defecto
      const finalData = {
        ...formData,
        selector: formData.selector.trim() || 'body'
      };
      
      onAdd(finalData);
      setFormData({
        name: '',
        url: '',
        selector: '',
        interval: 300000,
        keywords: [],
        analysisOptions: {
          extractCSS: true,
          extractHTML: true,
          extractJS: true,
          extractImages: false,
          extractLinks: true,
          extractMetadata: true,
          deepScan: false
        },
        alerts: { email: '', webhook: '', conditions: [] }
      });
      setErrors({});
      setUseAdvancedSelector(false);
      setSelectedPreset('');
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    const presetData = selectorPresets.find(p => p.value === preset);
    if (presetData) {
      setFormData(prev => ({
        ...prev,
        selector: preset
      }));
    }
  };

  const addKeyword = () => {
    if (currentKeyword.trim() && !formData.keywords.includes(currentKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, currentKeyword.trim()]
      }));
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const handleAnalysisOptionChange = (option: keyof typeof formData.analysisOptions) => {
    setFormData(prev => ({
      ...prev,
      analysisOptions: {
        ...prev.analysisOptions,
        [option]: !prev.analysisOptions[option]
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Agregar Nuevo Sitio Web con Análisis Avanzado
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre del Sitio *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Amazon Precios"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Intervalo de Análisis
                </label>
                <select
                  value={formData.interval}
                  onChange={(e) => handleInputChange('interval', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value={60000}>1 minuto</option>
                  <option value={300000}>5 minutos</option>
                  <option value={600000}>10 minutos</option>
                  <option value={1800000}>30 minutos</option>
                  <option value={3600000}>1 hora</option>
                  <option value={7200000}>2 horas</option>
                  <option value={21600000}>6 horas</option>
                  <option value={86400000}>24 horas</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL del Sitio *
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.url ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://ejemplo.com"
              />
              {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
            </div>
          </div>

          {/* Configuración de Extracción */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                ¿Qué Contenido Extraer?
              </h3>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-4 mb-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="selectorType"
                    checked={!useAdvancedSelector}
                    onChange={() => setUseAdvancedSelector(false)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Usar opciones predefinidas (Recomendado)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="selectorType"
                    checked={useAdvancedSelector}
                    onChange={() => setUseAdvancedSelector(true)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Configuración avanzada
                  </span>
                </label>
              </div>

              {!useAdvancedSelector ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Contenido a Extraer
                  </label>
                  <select
                    value={selectedPreset}
                    onChange={(e) => handlePresetChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Seleccionar tipo de contenido...</option>
                    {selectorPresets.map((preset, index) => (
                      <option key={index} value={preset.value}>
                        {preset.name}
                      </option>
                    ))}
                  </select>
                  {selectedPreset && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectorPresets.find(p => p.value === selectedPreset)?.description}
                    </p>
                  )}
                  {!selectedPreset && (
                    <p className="text-xs text-blue-600 mt-1">
                      💡 Si no seleccionas nada, se extraerá todo el contenido visible de la página
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Selector CSS Personalizado
                  </label>
                  <input
                    type="text"
                    value={formData.selector}
                    onChange={(e) => handleInputChange('selector', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder=".price, #content, h1.title, [data-price]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Para usuarios avanzados: Especifica selectores CSS personalizados
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Palabras Clave */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Palabras Clave para Rastreo (Opcional)
            </h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Agregar palabra clave (ej: precio, oferta, descuento)"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="hover:text-blue-900"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            {formData.keywords.length === 0 && (
              <p className="text-gray-500 text-sm mt-2">
                💡 Las palabras clave te ayudan a encontrar contenido específico en la página
              </p>
            )}
          </div>

          {/* Opciones de Análisis */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Opciones de Análisis con Puppeteer
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.analysisOptions.extractHTML}
                  onChange={() => handleAnalysisOptionChange('extractHTML')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Extraer HTML</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.analysisOptions.extractCSS}
                  onChange={() => handleAnalysisOptionChange('extractCSS')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Extraer CSS</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.analysisOptions.extractJS}
                  onChange={() => handleAnalysisOptionChange('extractJS')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Ejecutar JavaScript</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.analysisOptions.extractImages}
                  onChange={() => handleAnalysisOptionChange('extractImages')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Extraer Imágenes</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.analysisOptions.extractLinks}
                  onChange={() => handleAnalysisOptionChange('extractLinks')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Extraer Enlaces</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.analysisOptions.extractMetadata}
                  onChange={() => handleAnalysisOptionChange('extractMetadata')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Extraer Metadatos</span>
              </label>
            </div>

            <div className="mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.analysisOptions.deepScan}
                  onChange={() => handleAnalysisOptionChange('deepScan')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Análisis Profundo (puede tomar más tiempo)
                </span>
              </label>
              <p className="text-xs text-gray-500 ml-6 mt-1">
                Incluye análisis de contenido dinámico, frameworks JS, APIs y elementos cargados asíncronamente
              </p>
            </div>
          </div>

          {/* Alertas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Configuración de Alertas (Opcional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email para Alertas
                </label>
                <input
                  type="email"
                  value={formData.alerts.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    alerts: { ...prev.alerts, email: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Webhook URL
                </label>
                <input
                  type="url"
                  value={formData.alerts.webhook}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    alerts: { ...prev.alerts, webhook: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="https://webhook.com/tu-endpoint"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-1"
            >
              Agregar Sitio y Comenzar Análisis
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 