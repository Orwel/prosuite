import { Database, Activity, CheckCircle, Bell } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalSites: number;
    activeSites: number;
    totalData: number;
    successRate: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  // Validación de seguridad
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-pulse">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="ml-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      icon: Database,
      label: "Total Sitios",
      value: (stats.totalSites || 0).toString(),
      color: "text-blue-500"
    },
    {
      icon: Activity,
      label: "Sitios Activos",
      value: (stats.activeSites || 0).toString(),
      color: "text-green-500"
    },
    {
      icon: CheckCircle,
      label: "Datos Extraídos",
      value: (stats.totalData || 0).toString(),
      color: "text-purple-500"
    },
    {
      icon: Bell,
      label: "Tasa de Éxito",
      value: `${stats.successRate || 0}%`,
      color: "text-red-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <IconComponent className={`h-8 w-8 ${stat.color}`} />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 