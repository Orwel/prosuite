"use client";

import DashboardLayout from "./components/DashboardLayout";

export default function ProSuiteDashboard() {
  const DashboardContent = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Principal</h1>
        <p className="text-gray-600 dark:text-gray-400">Resumen general de todos tus procesos de datos</p>
      </div>
      
      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Web Scraping</h3>
          <p className="text-3xl font-bold">3</p>
          <p className="text-blue-100">Sitios activos</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Procesamiento</h3>
          <p className="text-3xl font-bold">2.5M+</p>
          <p className="text-purple-100">Registros procesados</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Uptime</h3>
          <p className="text-3xl font-bold">99.9%</p>
          <p className="text-green-100">Disponibilidad</p>
        </div>
      </div>

      {/* Cards adicionales con información */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Servicios Disponibles</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Web Scraping</span>
              <span className="text-green-600 font-medium">Activo</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Investigación AI</span>
              <span className="text-yellow-600 font-medium">En desarrollo</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Procesamiento de Datos</span>
              <span className="text-yellow-600 font-medium">En desarrollo</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Monitoreo 24/7</span>
              <span className="text-yellow-600 font-medium">En desarrollo</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Sistema iniciado</span>
              </div>
              <p className="text-xs ml-4">Hace 2 horas</p>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Dashboard cargado</span>
              </div>
              <p className="text-xs ml-4">Hace 1 minuto</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout activeSection="dashboard">
      <DashboardContent />
    </DashboardLayout>
  );
}
