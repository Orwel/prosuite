import { Eye } from "lucide-react";

export interface RealTimeDataItem {
  id: string;
  websiteId: string;
  timestamp: string;
  data: string;
  type: string;
}

interface RealTimeDataProps {
  data: RealTimeDataItem[];
}

export default function RealTimeData({ data }: RealTimeDataProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Datos en Tiempo Real
        </h3>
      </div>
      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.id} className="text-sm border-l-4 border-blue-500 pl-3">
              <div className="font-medium text-gray-900 dark:text-white">
                {item.data}
              </div>
              <div className="text-gray-500 text-xs">
                {item.timestamp} | {item.type}
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-center">
                No hay datos en tiempo real disponibles
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Los datos aparecerán aquí cuando inicies el scraping
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 