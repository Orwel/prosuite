import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function getBrowser() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // Configuración para Vercel (producción)
    return await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
  } else {
    // Configuración para desarrollo local
    return await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
  }
}

export async function scrapeWithPuppeteer(url: string, selector: string) {
  let browser;
  
  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    
    // Configurar timeout y viewport
    await page.setDefaultTimeout(30000);
    await page.setViewport({ width: 1280, height: 720 });
    
    // Navegar a la URL
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Extraer datos usando el selector
    const data = await page.evaluate((sel) => {
      const elements = document.querySelectorAll(sel);
      return Array.from(elements).map((el, index) => ({
        index,
        text: el.textContent?.trim() || '',
        html: el.innerHTML,
        tagName: el.tagName.toLowerCase(),
        attributes: Array.from(el.attributes).reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {} as Record<string, string>)
      }));
    }, selector);
    
    return {
      success: true,
      data,
      url,
      timestamp: new Date().toISOString(),
      mode: process.env.NODE_ENV === 'production' ? 'vercel' : 'local'
    };
    
  } catch (error) {
    console.error('Error en scraping con Puppeteer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      url,
      timestamp: new Date().toISOString(),
      mode: process.env.NODE_ENV === 'production' ? 'vercel' : 'local'
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
} 