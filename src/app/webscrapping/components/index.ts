// Componentes principales del sistema de webscraping
export { default as WebScrapingHeader } from './WebScrapingHeader';
export { default as StatsCards } from './StatsCards';
export { default as WebsiteList } from './WebsiteList';
export { default as RealTimeData } from './RealTimeData';
export { default as ScrapingLogs } from './ScrapingLogs';
export { default as AddSiteModal } from './AddSiteModal';
export { default as SystemStatus } from './SystemStatus';
export { default as AnalysisResults } from './AnalysisResults';

// Exportar también los tipos e interfaces
export type { Website } from './WebsiteList';
export type { RealTimeDataItem } from './RealTimeData';
export type { ScrapingLog } from './ScrapingLogs'; 