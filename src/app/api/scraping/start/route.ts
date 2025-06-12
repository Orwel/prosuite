import { NextRequest, NextResponse } from 'next/server';

// Simulamos una base de datos en memoria (en producción usarías una BD real)
let websites: any[] = [];
let scrapingData: any[] = [];
let scrapingJobs: Map<string, any> = new Map();

export async function POST(request: NextRequest) {
  try {
    const { websiteId } = await request.json();
    
    console.log('Iniciando scraping para websiteId:', websiteId);
    
    // Buscar el sitio web (en producción vendría de la BD)
    const website = websites.find(w => w.id === websiteId) || {
      id: websiteId,
      url: 'https://example.com',
      selector: '.price',
      interval: 300000,
      name: 'Sitio de prueba'
    };

    // Verificar si ya hay un job corriendo para este sitio
    if (scrapingJobs.has(websiteId)) {
      return NextResponse.json(
        { error: 'El scraping ya está en curso para este sitio' },
        { status: 400 }
      );
    }

    // Intentar iniciar el scraping real, pero si falla usar simulación
    try {
      const scrapingJob = await startRealScraping(website);
      scrapingJobs.set(websiteId, scrapingJob);
    } catch (puppeteerError) {
      console.log('Puppeteer no disponible, usando modo simulación:', puppeteerError);
      const simulatedJob = await startSimulatedScraping(website);
      scrapingJobs.set(websiteId, simulatedJob);
    }

    return NextResponse.json({
      success: true,
      message: 'Scraping iniciado correctamente',
      websiteId: websiteId
    });

  } catch (error) {
    console.error('Error en el scraping:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Función para scraping simulado (para desarrollo)
async function startSimulatedScraping(website: any) {
  const scrapingJob = {
    websiteId: website.id,
    status: 'running',
    startTime: new Date(),
    interval: null as any,
    mode: 'simulated'
  };

  const simulatePage = async () => {
    try {
      // Simular datos extraídos
      const mockData = [
        {
          index: 0,
          text: `$${(Math.random() * 1000).toFixed(2)}`,
          html: `<span class="price">$${(Math.random() * 1000).toFixed(2)}</span>`,
          attributes: { class: 'price' },
          tagName: 'span'
        },
        {
          index: 1,
          text: `Producto ${Math.floor(Math.random() * 100)}`,
          html: `<h2>Producto ${Math.floor(Math.random() * 100)}</h2>`,
          attributes: { class: 'title' },
          tagName: 'h2'
        }
      ];

      const scrapedData = {
        id: Date.now().toString(),
        websiteId: website.id,
        websiteName: website.name,
        url: website.url,
        selector: website.selector,
        timestamp: new Date().toISOString(),
        data: mockData,
        dataCount: mockData.length,
        status: 'success',
        mode: 'simulated'
      };

      scrapingData.push(scrapedData);

      // Mantener solo los últimos 1000 registros
      if (scrapingData.length > 1000) {
        scrapingData = scrapingData.slice(-1000);
      }

      console.log(`Scraping simulado exitoso para ${website.name}: ${mockData.length} elementos`);

      return scrapedData;

    } catch (error) {
      console.error(`Error en scraping simulado de ${website.name}:`, error);
      
      const errorData = {
        id: Date.now().toString(),
        websiteId: website.id,
        websiteName: website.name,
        url: website.url,
        timestamp: new Date().toISOString(),
        status: 'error',
        error: error instanceof Error ? error.message : 'Error desconocido',
        dataCount: 0,
        mode: 'simulated'
      };

      scrapingData.push(errorData);
      throw error;
    }
  };

  // Realizar el primer scraping simulado
  await simulatePage();

  // Configurar scraping periódico simulado
  scrapingJob.interval = setInterval(async () => {
    try {
      await simulatePage();
    } catch (error) {
      console.error('Error en scraping simulado periódico:', error);
    }
  }, website.interval);

  return scrapingJob;
}

// Función para scraping real con Puppeteer
async function startRealScraping(website: any) {
  // Importar Puppeteer dinámicamente
  const puppeteer = await import('puppeteer');
  let browser: any = null;
  
  const scrapingJob = {
    websiteId: website.id,
    status: 'running',
    startTime: new Date(),
    interval: null as any,
    mode: 'real'
  };

  try {
    // Lanzar navegador en modo headless
    browser = await puppeteer.default.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    const scrapePage = async () => {
      let page: any = null;
      try {
        page = await browser.newPage();
        
        // Configurar headers para parecer un navegador real
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        // Navegar a la página
        await page.goto(website.url, { 
          waitUntil: 'networkidle2',
          timeout: 30000 
        });

        // Esperar a que aparezca el selector
        await page.waitForSelector(website.selector, { timeout: 10000 });

        // Extraer datos usando el selector
        const data = await page.evaluate((selector: string) => {
          const elements = document.querySelectorAll(selector);
          const results: any[] = [];
          
          elements.forEach((element, index) => {
            results.push({
              index: index,
              text: element.textContent?.trim() || '',
              html: element.innerHTML,
              attributes: Array.from(element.attributes).reduce((acc: any, attr) => {
                acc[attr.name] = attr.value;
                return acc;
              }, {}),
              tagName: element.tagName.toLowerCase()
            });
          });
          
          return results;
        }, website.selector);

        // Almacenar los datos extraídos
        const scrapedData = {
          id: Date.now().toString(),
          websiteId: website.id,
          websiteName: website.name,
          url: website.url,
          selector: website.selector,
          timestamp: new Date().toISOString(),
          data: data,
          dataCount: data.length,
          status: 'success',
          mode: 'real'
        };

        scrapingData.push(scrapedData);

        // Mantener solo los últimos 1000 registros
        if (scrapingData.length > 1000) {
          scrapingData = scrapingData.slice(-1000);
        }

        console.log(`Scraping real exitoso para ${website.name}: ${data.length} elementos extraídos`);

        return scrapedData;

      } catch (error) {
        console.error(`Error en scraping real de ${website.name}:`, error);
        
        // Registrar error
        const errorData = {
          id: Date.now().toString(),
          websiteId: website.id,
          websiteName: website.name,
          url: website.url,
          timestamp: new Date().toISOString(),
          status: 'error',
          error: error instanceof Error ? error.message : 'Error desconocido',
          dataCount: 0,
          mode: 'real'
        };

        scrapingData.push(errorData);
        
        throw error;
      } finally {
        if (page) {
          await page.close();
        }
      }
    };

    // Realizar el primer scraping
    await scrapePage();

    // Configurar scraping periódico
    scrapingJob.interval = setInterval(async () => {
      try {
        await scrapePage();
      } catch (error) {
        console.error('Error en scraping real periódico:', error);
      }
    }, website.interval);

    return scrapingJob;

  } catch (error) {
    console.error('Error al iniciar el scraping real:', error);
    
    if (browser) {
      await browser.close();
    }
    
    scrapingJob.status = 'error';
    throw error;
  }
}

// Endpoint para detener el scraping
export async function DELETE(request: NextRequest) {
  try {
    const { websiteId } = await request.json();
    
    const job = scrapingJobs.get(websiteId);
    if (job) {
      if (job.interval) {
        clearInterval(job.interval);
      }
      job.status = 'stopped';
      scrapingJobs.delete(websiteId);
      
      return NextResponse.json({
        success: true,
        message: 'Scraping detenido correctamente'
      });
    }

    return NextResponse.json(
      { error: 'No se encontró un job activo para este sitio' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error deteniendo scraping:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para obtener el estado de los jobs
export async function GET() {
  try {
    const jobsStatus = Array.from(scrapingJobs.entries()).map(([id, job]) => ({
      websiteId: id,
      status: job.status,
      startTime: job.startTime,
      mode: job.mode || 'unknown'
    }));

    return NextResponse.json({
      success: true,
      jobs: jobsStatus,
      totalJobs: scrapingJobs.size,
      recentData: scrapingData.slice(-10)
    });

  } catch (error) {
    console.error('Error obteniendo estado de jobs:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 