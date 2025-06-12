import { Clock, CheckCircle, AlertTriangle } from "lucide-react";

export interface ScrapingLog {
  id: string;
  websiteId: string;
  timestamp: string;
  status: 'success' | 'error';
  dataCount: number;
  message: string;
}

interface ScrapingLogsProps {
  logs: ScrapingLog[];
}

export default function ScrapingLogs({ logs }: ScrapingLogsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Logs Recientes
        </h3>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="text-sm">
              <div className="flex items-center gap-2">
                {log.status === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
                <span className="font-medium text-gray-900 dark:text-white">
                  {log.message}
                </span>
              </div>
              <div className="text-gray-500 text-xs ml-6">
                {log.timestamp} | {log.dataCount} elementos
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No hay logs disponibles
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Los logs aparecerán aquí cuando se ejecuten las tareas de scraping
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 