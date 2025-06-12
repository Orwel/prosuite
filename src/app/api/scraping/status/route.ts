import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Verificando estado del sistema...');
    
    let puppeteerStatus = 'checking';
    let puppeteerDetails = '';
    
    // Verificar Puppeteer
    try {
      console.log('🔧 Probando Puppeteer...');
      const puppeteer = await import('puppeteer');
      
      // Intentar lanzar navegador rápidamente
      const browser = await puppeteer.default.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ],
        timeout: 10000 // 10 segundos máximo
      });
      
      await browser.close();
      puppeteerStatus = 'available';
      puppeteerDetails = 'Puppeteer funcionando correctamente';
      console.log('✅ Puppeteer disponible');
      
    } catch (puppeteerError) {
      console.log('❌ Puppeteer no disponible:', puppeteerError);
      puppeteerStatus = 'unavailable';
      puppeteerDetails = puppeteerError instanceof Error ? puppeteerError.message : 'Error desconocido';
    }

    const systemStatus = {
      timestamp: new Date().toISOString(),
      api: {
        status: 'online',
        version: '1.0.0'
      },
      puppeteer: {
        status: puppeteerStatus,
        details: puppeteerDetails
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        }
      },
      activeJobs: 0, // Aquí podrías conectar con una base de datos real
      totalJobs: 0
    };

    console.log('📊 Estado del sistema:', {
      api: systemStatus.api.status,
      puppeteer: systemStatus.puppeteer.status
    });

    return NextResponse.json({
      success: true,
      data: systemStatus
    });

  } catch (error) {
    console.error('💥 Error verificando estado del sistema:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error verificando estado del sistema',
      details: error instanceof Error ? error.message : 'Error desconocido',
      data: {
        timestamp: new Date().toISOString(),
        api: {
          status: 'online',
          version: '1.0.0'
        },
        puppeteer: {
          status: 'unavailable',
          details: 'Error al verificar Puppeteer'
        },
        system: {
          platform: process.platform,
          nodeVersion: process.version
        },
        activeJobs: 0,
        totalJobs: 0
      }
    });
  }
} 