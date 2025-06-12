"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProSuiteDashboard() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const router = useRouter();

  const services = [
    {
      id: "webscraping",
      title: "Web Scraping",
      description: "Extracción automatizada de datos de sitios web con alta precisión",
      icon: "🌐",
      color: "bg-blue-500",
      features: ["Extracción de datos en tiempo real", "Bypass de anti-bot", "Procesamiento masivo", "API REST integrada"],
      route: "/webscrapping"
    },
    {
      id: "ai-investigation",
      title: "Investigación con AI",
      description: "Análisis inteligente de datos y generación de insights",
      icon: "🤖",
      color: "bg-purple-500", 
      features: ["Análisis de sentimientos", "Detección de patrones", "Generación de reportes", "Machine Learning"],
      route: null
    },
    {
      id: "data-processing",
      title: "Procesamiento de Datos",
      description: "Limpieza, transformación y análisis de grandes volúmenes de datos",
      icon: "📊",
      color: "bg-green-500",
      features: ["ETL automatizado", "Validación de datos", "Transformaciones complejas", "Exportación múltiple"],
      route: null
    },
    {
      id: "monitoring",
      title: "Monitoreo 24/7",
      description: "Vigilancia continua de sitios web y APIs",
      icon: "👁️",
      color: "bg-red-500",
      features: ["Alertas en tiempo real", "Métricas de disponibilidad", "Detección de cambios", "Dashboard personalizado"],
      route: null
    },
    {
      id: "automation",
      title: "Automatización",
      description: "Flujos de trabajo automatizados para tareas repetitivas",
      icon: "⚡",
      color: "bg-yellow-500",
      features: ["Workflows personalizados", "Integración con APIs", "Programación de tareas", "Notificaciones automáticas"],
      route: null
    },
    {
      id: "analytics",
      title: "Análisis Avanzado",
      description: "Insights profundos y visualizaciones de datos",
      icon: "📈",
      color: "bg-indigo-500",
      features: ["Dashboards interactivos", "Análisis predictivo", "Visualizaciones avanzadas", "Reportes personalizados"],
      route: null
    }
  ];

  const stats = [
    { label: "Datos Procesados", value: "2.5M+", color: "text-blue-600" },
    { label: "Sitios Monitoreados", value: "150+", color: "text-green-600" },
    { label: "Uptime", value: "99.9%", color: "text-purple-600" },
    { label: "Clientes Satisfechos", value: "50+", color: "text-red-600" }
  ];

  const handleServiceClick = (service: any) => {
    if (service.route) {
      router.push(service.route);
    } else {
      setActiveService(activeService === service.id ? null : service.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ProSuite
              </div>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                Professional Data Solutions
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#servicios" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Servicios
              </a>
              <a href="#estadisticas" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Estadísticas
              </a>
              <a href="#contacto" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Contacto
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Soluciones Inteligentes de
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Procesamiento de Datos
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Automatiza, analiza y optimiza tus procesos de datos con nuestra suite completa de herramientas profesionales
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
            Comenzar Demo
          </button>
        </div>

        {/* Stats Section */}
        <div id="estadisticas" className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg border border-gray-200 dark:border-gray-700">
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Services Section */}
        <div id="servicios" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Nuestros Servicios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => setActiveService(activeService === service.id ? null : service.id)}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center text-white text-2xl mr-4`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {service.description}
                </p>
                
                {activeService === service.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Características principales:
                    </h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServiceClick(service);
                  }}
                  className={`w-full mt-4 ${service.color} text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity`}
                >
                  {service.route ? 'Acceder al Sistema' : 'Explorar Servicio'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-16">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para probar ProSuite?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Experimenta el poder de nuestras herramientas con una demostración personalizada
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Solicitar Demo
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Ver Documentación
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">ProSuite</div>
              <p className="text-gray-400">
                Soluciones profesionales para el procesamiento inteligente de datos
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Servicios</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => router.push('/webscrapping')} className="hover:text-white transition-colors">Web Scraping</button></li>
                <li>Investigación AI</li>
                <li>Procesamiento de Datos</li>
                <li>Monitoreo</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre Nosotros</li>
                <li>Casos de Éxito</li>
                <li>Blog</li>
                <li>Contacto</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentación</li>
                <li>API Reference</li>
                <li>Centro de Ayuda</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ProSuite. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
