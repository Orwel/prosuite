import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, Server, RefreshCw } from 'lucide-react';

interface SystemStatusProps {
  className?: string;
}

interface SystemState {
  apiStatus: 'online' | 'offline' | 'checking';
  puppeteerStatus: 'available' | 'unavailable' | 'checking';
  activeJobs: number;
  lastCheck: string;
  systemInfo?: {
    platform: string;
    nodeVersion: string;
    memory: {
      used: number;
      total: number;
    };
  };
}

export default function SystemStatus({ className = '' }: SystemStatusProps) {
  const [systemState, setSystemState] = useState<SystemState>({
    apiStatus: 'checking',
    puppeteerStatus: 'checking',
    activeJobs: 0,
    lastCheck: 'Nunca'
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkSystemStatus = async () => {
    if (isChecking) return; // Evitar múltiples verificaciones simultáneas
    
    setIsChecking(true);
    console.log('🔍 Verificando estado del sistema...');
    
    try {
      // Usar AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos timeout

      const response = await fetch('/api/scraping/status', {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Estado recibido:', result);
        
        if (result.success && result.data) {
          setSystemState({
            apiStatus: 'online',
            puppeteerStatus: result.data.puppeteer.status,
            activeJobs: result.data.activeJobs || 0,
            lastCheck: new Date().toLocaleTimeString(),
            systemInfo: result.data.system
          });
        } else {
          throw new Error(result.error || 'Respuesta inválida');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Error verificando estado:', error);
      
      // Si es un error de abort (timeout), mantener estado anterior pero marcar como offline
      if (error instanceof Error && error.name === 'AbortError') {
        setSystemState(prev => ({
          ...prev,
          apiStatus: 'offline',
          puppeteerStatus: 'checking',
          lastCheck: new Date().toLocaleTimeString()
        }));
      } else {
        setSystemState(prev => ({
          ...prev,
          apiStatus: 'offline',
          puppeteerStatus: 'unavailable',
          lastCheck: new Date().toLocaleTimeString()
        }));
      }
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Verificación inicial
    checkSystemStatus();
    
    // Verificación periódica cada 60 segundos (reducido de 30 para evitar sobrecarga)
    const interval = setInterval(checkSystemStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'offline':
      case 'unavailable':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusText = (status: string, type: 'api' | 'puppeteer') => {
    if (type === 'api') {
      switch (status) {
        case 'online': return 'API Online';
        case 'offline': return 'API Offline';
        default: return 'Verificando API...';
      }
    } else {
      switch (status) {
        case 'available': return 'Puppeteer Disponible';
        case 'unavailable': return 'Modo Simulación';
        default: return 'Verificando Puppeteer...';
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'available':
        return 'text-green-600 dark:text-green-400';
      case 'offline':
      case 'unavailable':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Server className="h-4 w-4" />
          Estado del Sistema
        </h3>
        <button
          onClick={checkSystemStatus}
          disabled={isChecking}
          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
          {isChecking ? 'Verificando...' : 'Actualizar'}
        </button>
      </div>

      <div className="space-y-3">
        {/* Estado API */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(systemState.apiStatus)}
            <span className={`text-sm font-medium ${getStatusColor(systemState.apiStatus)}`}>
              {getStatusText(systemState.apiStatus, 'api')}
            </span>
          </div>
          {systemState.apiStatus === 'online' && (
            <span className="text-xs text-gray-500 dark:text-gray-400">v1.0.0</span>
          )}
        </div>

        {/* Estado Puppeteer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(systemState.puppeteerStatus)}
            <span className={`text-sm font-medium ${getStatusColor(systemState.puppeteerStatus)}`}>
              {getStatusText(systemState.puppeteerStatus, 'puppeteer')}
            </span>
          </div>
          {systemState.puppeteerStatus === 'available' && (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Real</span>
          )}
          {systemState.puppeteerStatus === 'unavailable' && (
            <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">⚠ Simulado</span>
          )}
        </div>

        {/* Información del sistema */}
        {systemState.systemInfo && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div>
                <span className="font-medium">Plataforma:</span> {systemState.systemInfo.platform}
              </div>
              <div>
                <span className="font-medium">Node:</span> {systemState.systemInfo.nodeVersion}
              </div>
              <div>
                <span className="font-medium">Memoria:</span> {systemState.systemInfo.memory.used}MB / {systemState.systemInfo.memory.total}MB
              </div>
              <div>
                <span className="font-medium">Jobs:</span> {systemState.activeJobs} activos
              </div>
            </div>
          </div>
        )}

        {/* Última verificación */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Última verificación:</span>
            <span>{systemState.lastCheck}</span>
          </div>
        </div>
      </div>

      {/* Mensajes informativos */}
      {systemState.puppeteerStatus === 'unavailable' && (
        <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            💡 Puppeteer no está disponible. El sistema funciona en modo simulación para desarrollo.
          </p>
        </div>
      )}

      {systemState.puppeteerStatus === 'available' && (
        <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
          <p className="text-xs text-green-800 dark:text-green-200">
            🚀 Puppeteer funcionando correctamente. Análisis real disponible.
          </p>
        </div>
      )}

      {systemState.apiStatus === 'offline' && (
        <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
          <p className="text-xs text-red-800 dark:text-red-200">
            ⚠️ API no disponible. Verifica la conexión del servidor.
          </p>
        </div>
      )}
    </div>
  );
} 