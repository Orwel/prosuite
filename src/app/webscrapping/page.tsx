"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { 
  WebScrapingHeader, 
  StatsCards, 
  WebsiteList, 
  RealTimeData, 
  ScrapingLogs, 
  AddSiteModal,
  SystemStatus,
  AnalysisResults
} from "./components";
import type { Website } from "./components/WebsiteList";

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

export default function WebScrappingPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [realTimeData, setRealTimeData] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<{
    result: AnalysisResult | null;
    mode: 'real' | 'simulated';
  }>({ result: null, mode: 'real' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const stats = {
    totalSites: websites.length,
    activeSites: websites.filter(w => w.status === 'running').length,
    totalData: realTimeData.length,
    successRate: websites.length > 0 ? 
      Math.round((websites.filter(w => w.status !== 'error').length / websites.length) * 100) : 0
  };

  // Simular datos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      const activeSites = websites.filter(w => w.status === 'running');
      if (activeSites.length > 0) {
        const randomSite = activeSites[Math.floor(Math.random() * activeSites.length)];
        const newData = {
          id: Date.now().toString(),
          siteId: randomSite.id,
          siteName: randomSite.name,
          data: `Datos extraídos: ${Math.random().toFixed(2)}`,
          timestamp: new Date().toLocaleTimeString(),
          status: Math.random() > 0.1 ? 'success' : 'error'
        };
        
        setRealTimeData(prev => [newData, ...prev.slice(0, 49)]);
        
        // Agregar log
        const logEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          site: randomSite.name,
          action: 'Scraping realizado',
          status: newData.status,
          details: newData.data
        };
        setLogs(prev => [logEntry, ...prev.slice(0, 99)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [websites]);

  const handleAddSite = async (siteData: any) => {
    const newWebsite: Website = {
      id: Date.now().toString(),
      name: siteData.name,
      url: siteData.url,
      selector: siteData.selector,
      interval: siteData.interval,
      isActive: false,
      lastScrape: 'Nunca',
      status: 'idle',
      keywords: siteData.keywords,
      analysisOptions: siteData.analysisOptions
    };

    setWebsites(prev => [...prev, newWebsite]);
    
    // Log de creación
    const logEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      site: siteData.name,
      action: 'Sitio agregado',
      status: 'success',
      details: `URL: ${siteData.url}, Selector: ${siteData.selector}`
    };
    setLogs(prev => [logEntry, ...prev]);

    // Realizar análisis inicial si se especificaron opciones
    if (siteData.analysisOptions && Object.values(siteData.analysisOptions).some(Boolean)) {
      await performAnalysis(newWebsite.id, siteData);
    }
  };

  const handleToggleStatus = (id: string) => {
    setWebsites(prev => prev.map(site => 
      site.id === id 
        ? { 
            ...site, 
            status: site.status === 'running' ? 'paused' : 'running',
            isActive: site.status !== 'running',
            lastScrape: site.status !== 'running' ? new Date().toLocaleTimeString() : site.lastScrape
          }
        : site
    ));
  };

  const handleStartScraping = async (id: string) => {
    const website = websites.find(w => w.id === id);
    if (!website) return;

    try {
      const response = await fetch('/api/scraping/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: website.url,
          selector: website.selector,
          interval: website.interval
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setWebsites(prev => prev.map(site => 
          site.id === id 
            ? { ...site, status: 'running', isActive: true, lastScrape: new Date().toLocaleTimeString() }
            : site
        ));
        
        const logEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          site: website.name,
          action: 'Scraping iniciado',
          status: 'success',
          details: `Modo: ${result.mode}`
        };
        setLogs(prev => [logEntry, ...prev]);
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error al iniciar scraping:', error);
      
      setWebsites(prev => prev.map(site => 
        site.id === id ? { ...site, status: 'error' } : site
      ));
      
      const logEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        site: website.name,
        action: 'Error en scraping',
        status: 'error',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
      setLogs(prev => [logEntry, ...prev]);
    }
  };

  const handleDeleteSite = (id: string) => {
    const website = websites.find(w => w.id === id);
    if (!website) return;

    setWebsites(prev => prev.filter(site => site.id !== id));
    
    // Limpiar datos relacionados
    setRealTimeData(prev => prev.filter(data => data.siteId !== id));
    
    const logEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      site: website.name,
      action: 'Sitio eliminado',
      status: 'success',
      details: `Sitio ${website.name} eliminado permanentemente`
    };
    setLogs(prev => [logEntry, ...prev]);
  };

  const handleViewResults = (id: string) => {
    const website = websites.find(w => w.id === id);
    if (!website) return;

    const siteData = realTimeData.filter(data => data.siteId === id);
    
    if (siteData.length === 0) {
      alert('No hay datos disponibles para este sitio. Inicia el scraping primero.');
      return;
    }

    // Aquí podrías abrir un modal con los resultados
    console.log('Datos del sitio:', siteData);
    alert(`Datos encontrados: ${siteData.length} registros. Ver consola para detalles.`);
  };

  const performAnalysis = async (id: string, siteData?: any) => {
    const website = websites.find(w => w.id === id) || siteData;
    if (!website) return;

    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/scraping/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: website.url,
          selector: website.selector,
          keywords: website.keywords || [],
          analysisOptions: website.analysisOptions || {
            extractCSS: true,
            extractHTML: true,
            extractJS: true,
            extractImages: false,
            extractLinks: true,
            extractMetadata: true,
            deepScan: false
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setCurrentAnalysis({
          result: result.data,
          mode: result.mode
        });
        setIsAnalysisModalOpen(true);
        
        const logEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          site: website.name,
          action: 'Análisis completado',
          status: 'success',
          details: `Modo: ${result.mode}, Palabras clave encontradas: ${result.data.keywords.found.length}`
        };
        setLogs(prev => [logEntry, ...prev]);
      } else {
        throw new Error(result.error || 'Error en análisis');
      }
    } catch (error) {
      console.error('Error en análisis:', error);
      
      const logEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        site: website.name,
        action: 'Error en análisis',
        status: 'error',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
      setLogs(prev => [logEntry, ...prev]);
      
      alert('Error al realizar el análisis. Ver logs para más detalles.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = (id: string) => {
    performAnalysis(id);
  };

  const handleViewAnalysis = (id: string) => {
    // Si ya hay un análisis previo, mostrarlo
    if (currentAnalysis.result) {
      setIsAnalysisModalOpen(true);
    } else {
      // Realizar nuevo análisis
      performAnalysis(id);
    }
  };

  const handleExportData = (id: string) => {
    const website = websites.find(w => w.id === id);
    if (!website) return;

    const siteData = realTimeData.filter(data => data.siteId === id);
    
    if (siteData.length === 0) {
      alert('No hay datos para exportar. Inicia el scraping primero.');
      return;
    }

    const dataToExport = {
      website: {
        name: website.name,
        url: website.url,
        selector: website.selector
      },
      data: siteData,
      exportDate: new Date().toISOString(),
      totalRecords: siteData.length
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${website.name.replace(/\s+/g, '_')}_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const logEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      site: website.name,
      action: 'Datos exportados',
      status: 'success',
      details: `${siteData.length} registros exportados`
    };
    setLogs(prev => [logEntry, ...prev]);
  };

  const handleSettings = (id: string) => {
    // Aquí podrías abrir un modal de configuración
    alert('Funcionalidad de configuración en desarrollo');
  };

  return (
    <DashboardLayout activeSection="webscraping">
      <div className="space-y-8">
        <WebScrapingHeader onAddSite={() => setIsAddModalOpen(true)} />
        
        <StatsCards stats={stats} />
        
        <SystemStatus />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WebsiteList 
            websites={websites}
            onToggleStatus={handleToggleStatus}
            onStartScraping={handleStartScraping}
            onExportData={handleExportData}
            onSettings={handleSettings}
            onDelete={handleDeleteSite}
            onViewResults={handleViewResults}
            onAnalyze={handleAnalyze}
            onViewAnalysis={handleViewAnalysis}
          />
          
          <div className="space-y-8">
            <RealTimeData data={realTimeData} />
            <ScrapingLogs logs={logs} />
          </div>
        </div>
      </div>

      {/* Modales y overlays - estos necesitan estar fuera del layout */}
      <AddSiteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSite}
      />

      <AnalysisResults
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        result={currentAnalysis.result}
        mode={currentAnalysis.mode}
      />

      {isAnalyzing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-900 dark:text-white">
              Realizando análisis profundo con Puppeteer...
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
