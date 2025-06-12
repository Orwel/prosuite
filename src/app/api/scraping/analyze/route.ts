import { NextRequest, NextResponse } from 'next/server';

interface AnalysisOptions {
  extractCSS: boolean;
  extractHTML: boolean;
  extractJS: boolean;
  extractImages: boolean;
  extractLinks: boolean;
  extractMetadata: boolean;
  deepScan: boolean;
}

interface AnalysisResult {
  url: string;
  timestamp: string;
  basicInfo: {
    title: string;
    description: string;
    favicon: string;
    language: string;
  };
  content: {
    text: string;
    html: string;
    structure: any;
  };
  keywords: {
    found: string[];
    positions: Array<{
      keyword: string;
      element: string;
      text: string;
      selector: string;
      position: number;
    }>;
  };
  assets: {
    images: Array<{ src: string; alt: string; title: string }>;
    links: Array<{ href: string; text: string; type: string }>;
    scripts: string[];
    stylesheets: string[];
  };
  technical: {
    frameworks: string[];
    technologies: string[];
    performance: {
      loadTime: number;
      domElements: number;
      requests: number;
    };
  };
  seo: {
    metaTags: Array<{ name: string; content: string }>;
    headings: Array<{ level: number; text: string }>;
    altTexts: string[];
  };
  errors: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { url, selector, keywords = [], analysisOptions } = await request.json();

    console.log('🚀 Iniciando análisis profundo para:', url);
    console.log('📋 Opciones:', { selector, keywords, analysisOptions });

    // Lista de sitios problemáticos conocidos
    const problematicSites = [
      'secretariasenado.gov.co',
      'senado.gov.co',
      'congreso.gov.co'
    ];

    // Verificar si es un sitio problemático
    const isProblematicSite = problematicSites.some(site => url.includes(site));
    
    if (isProblematicSite) {
      console.log('⚠️ Sitio problemático detectado, usando análisis alternativo...');
      const result = await performAlternativeAnalysis(url, selector, keywords, analysisOptions);
      return NextResponse.json({
        success: true,
        mode: 'alternative',
        data: result,
        warning: 'Sitio problemático detectado, usando análisis alternativo'
      });
    }

    // Intentar análisis real con Puppeteer para sitios normales
    try {
      const result = await performRealAnalysis(url, selector, keywords, analysisOptions);
      console.log('✅ Análisis real completado exitosamente');
      return NextResponse.json({
        success: true,
        mode: 'real',
        data: result
      });
    } catch (puppeteerError) {
      console.error('❌ Error con Puppeteer:', puppeteerError);
      
      // Si falla Puppeteer, intentar análisis alternativo
      console.log('🔄 Fallback a análisis alternativo...');
      try {
        const result = await performAlternativeAnalysis(url, selector, keywords, analysisOptions);
        return NextResponse.json({
          success: true,
          mode: 'alternative',
          data: result,
          warning: 'Puppeteer falló, usando análisis alternativo'
        });
      } catch (alternativeError) {
        console.error('❌ Error en análisis alternativo:', alternativeError);
        console.log('🔄 Fallback final a modo simulación');
        const result = await performSimulatedAnalysis(url, selector, keywords, analysisOptions);
        return NextResponse.json({
          success: true,
          mode: 'simulated',
          data: result,
          warning: 'Todos los métodos fallaron, usando simulación'
        });
      }
    }

  } catch (error) {
    console.error('💥 Error general en análisis:', error);
    return NextResponse.json(
      { 
        error: 'Error en el análisis',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

async function performRealAnalysis(
  url: string, 
  selector: string, 
  keywords: string[], 
  options: AnalysisOptions
): Promise<AnalysisResult> {
  console.log('🔧 Iniciando análisis real con Puppeteer...');
  
  let puppeteer;
  let browser: any = null;
  let page: any = null;

  try {
    // Importar Puppeteer dinámicamente
    puppeteer = await import('puppeteer');
    console.log('📦 Puppeteer importado correctamente');
    
    const startTime = Date.now();
    
    // Configuración optimizada para Windows
    const launchOptions = {
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
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-field-trial-config',
        '--disable-ipc-flooding-protection',
        '--enable-features=NetworkService,NetworkServiceInProcess',
        '--force-color-profile=srgb',
        '--metrics-recording-only',
        '--use-mock-keychain',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-sync',
        '--disable-translate',
        '--disable-background-networking',
        '--disable-background-downloads',
        '--disable-add-to-shelf',
        '--disable-client-side-phishing-detection',
        '--disable-datasaver-prompt',
        '--disable-default-apps',
        '--disable-domain-reliability',
        '--disable-component-update'
      ],
      ignoreDefaultArgs: ['--disable-extensions'],
      timeout: 30000
    };

    console.log('🌐 Lanzando navegador...');
    browser = await puppeteer.default.launch(launchOptions);
    
    console.log('📄 Creando nueva página...');
    page = await browser.newPage();
    
    // Configurar navegador para simular usuario real
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Configurar timeouts más cortos para evitar desconexiones
    await page.setDefaultNavigationTimeout(15000);
    await page.setDefaultTimeout(10000);

    // Interceptar requests para análisis de performance (simplificado)
    const requests: string[] = [];
    await page.setRequestInterception(true);
    page.on('request', (request: any) => {
      requests.push(request.url());
      // Bloquear recursos pesados para acelerar
      const resourceType = request.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // Manejar errores de página
    page.on('error', (error: any) => {
      console.warn('⚠️ Error en página:', error);
    });

    console.log(`🔗 Navegando a: ${url}`);
    
    // Estrategia de navegación más simple y robusta
    try {
      await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 15000 
      });
      console.log('✅ Navegación exitosa');
    } catch (navError) {
      console.warn('⚠️ Error en navegación inicial, intentando con load:', navError);
      try {
        await page.goto(url, { 
          waitUntil: 'load',
          timeout: 10000 
        });
        console.log('✅ Navegación exitosa con load');
      } catch (secondError) {
        throw new Error(`Navegación falló: ${secondError}`);
      }
    }

    console.log('⏳ Esperando estabilización...');
    await page.waitForTimeout(2000);

    const loadTime = Date.now() - startTime;
    console.log(`⚡ Tiempo de carga: ${loadTime}ms`);

    // Inicializar resultado con valores por defecto
    const result: AnalysisResult = {
      url,
      timestamp: new Date().toISOString(),
      basicInfo: {
        title: '',
        description: '',
        favicon: '',
        language: 'unknown'
      },
      content: {
        text: '',
        html: '',
        structure: {}
      },
      keywords: {
        found: [],
        positions: []
      },
      assets: {
        images: [],
        links: [],
        scripts: [],
        stylesheets: []
      },
      technical: {
        frameworks: [],
        technologies: [],
        performance: {
          loadTime,
          domElements: 0,
          requests: requests.length
        }
      },
      seo: {
        metaTags: [],
        headings: [],
        altTexts: []
      },
      errors: []
    };

    // Función para ejecutar evaluaciones de manera segura
    const safeEvaluate = async (fn: Function, timeout = 5000, ...args: any[]) => {
      try {
        return await Promise.race([
          page.evaluate(fn, ...args),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout en evaluación')), timeout)
          )
        ]);
      } catch (error) {
        console.warn('⚠️ Error en evaluación segura:', error);
        throw error;
      }
    };

    // Extraer información básica
    console.log('📊 Extrayendo información básica...');
    try {
      result.basicInfo = await safeEvaluate(() => {
        return {
          title: document.title || '',
          description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
          favicon: document.querySelector('link[rel="icon"], link[rel="shortcut icon"]')?.getAttribute('href') || '',
          language: document.documentElement.lang || document.querySelector('html')?.getAttribute('lang') || 'unknown'
        };
      });
    } catch (error) {
      console.warn('⚠️ Error extrayendo información básica:', error);
      result.errors.push('Error extrayendo información básica');
    }

    // Extraer contenido principal
    if (options.extractHTML) {
      console.log('📝 Extrayendo contenido...');
      try {
        result.content = await safeEvaluate((sel: string) => {
          const element = document.querySelector(sel);
          if (element) {
            return {
              text: element.textContent?.trim() || '',
              html: element.innerHTML || '',
              structure: {
                tagName: element.tagName.toLowerCase(),
                className: element.className || '',
                id: element.id || '',
                attributes: {}
              }
            };
          }
          return {
            text: document.body.textContent?.trim() || '',
            html: document.body.innerHTML || '',
            structure: { tagName: 'body' }
          };
        }, 3000, selector);
      } catch (error) {
        console.warn('⚠️ Error extrayendo contenido:', error);
        result.errors.push('Error extrayendo contenido');
      }
    }

    // Buscar palabras clave
    if (keywords.length > 0) {
      console.log('🔍 Buscando palabras clave...');
      try {
        result.keywords = await safeEvaluate((keywords: string[]) => {
          const found: string[] = [];
          const positions: Array<{
            keyword: string;
            element: string;
            text: string;
            selector: string;
            position: number;
          }> = [];

          const bodyText = document.body.textContent?.toLowerCase() || '';
          
          keywords.forEach(keyword => {
            const keywordLower = keyword.toLowerCase();
            if (bodyText.includes(keywordLower)) {
              found.push(keyword);
              
              // Buscar en elementos específicos (simplificado)
              const elements = document.querySelectorAll('p, div, span, h1, h2, h3');
              for (let i = 0; i < Math.min(elements.length, 20); i++) {
                const element = elements[i];
                const text = element.textContent?.toLowerCase() || '';
                if (text.includes(keywordLower)) {
                  positions.push({
                    keyword,
                    element: element.tagName.toLowerCase(),
                    text: element.textContent?.substring(0, 100) || '',
                    selector: element.tagName.toLowerCase(),
                    position: text.indexOf(keywordLower)
                  });
                  break;
                }
              }
            }
          });

          return { found: [...new Set(found)], positions };
        }, 3000, keywords);
      } catch (error) {
        console.warn('⚠️ Error buscando palabras clave:', error);
        result.errors.push('Error buscando palabras clave');
      }
    }

    // Extraer assets básicos
    if (options.extractImages || options.extractLinks) {
      console.log('🖼️ Extrayendo recursos...');
      try {
        result.assets = await safeEvaluate((extractImages: boolean, extractLinks: boolean) => {
          const result: any = { images: [], links: [], scripts: [], stylesheets: [] };
          
          if (extractImages) {
            const images = document.querySelectorAll('img');
            result.images = Array.from(images).slice(0, 10).map(img => ({
              src: img.src || '',
              alt: img.alt || '',
              title: img.title || ''
            }));
          }

          if (extractLinks) {
            const links = document.querySelectorAll('a[href]');
            result.links = Array.from(links).slice(0, 15).map(link => {
              const anchor = link as HTMLAnchorElement;
              return {
                href: anchor.href || '',
                text: anchor.textContent?.trim() || '',
                type: anchor.href.startsWith('mailto:') ? 'email' : 
                      anchor.href.startsWith('tel:') ? 'phone' : 'url'
              };
            });
          }

          return result;
        }, 3000, options.extractImages, options.extractLinks);
      } catch (error) {
        console.warn('⚠️ Error extrayendo recursos:', error);
        result.errors.push('Error extrayendo recursos');
      }
    }

    // Análisis técnico básico
    console.log('⚙️ Analizando tecnologías...');
    try {
      const technicalData = await safeEvaluate(() => {
        const frameworks: string[] = [];
        const technologies: string[] = [];

        try {
          // Detectar frameworks básicos
          if ((window as any).React) frameworks.push('React');
          if ((window as any).Vue) frameworks.push('Vue.js');
          if ((window as any).jQuery || (window as any).$) frameworks.push('jQuery');
          if (document.querySelector('[data-reactroot]')) frameworks.push('React');
          if (document.querySelector('script[src*="react"]')) frameworks.push('React');
          if (document.querySelector('script[src*="vue"]')) frameworks.push('Vue.js');
          if (document.querySelector('script[src*="bootstrap"]')) frameworks.push('Bootstrap');

          // Detectar CMS básicos
          if (document.querySelector('script[src*="wp-content"]')) technologies.push('WordPress');
          if (document.querySelector('meta[name="generator"][content*="WordPress"]')) technologies.push('WordPress');
        } catch (e) {
          console.warn('Error detectando tecnologías:', e);
        }

        return {
          frameworks: [...new Set(frameworks)],
          technologies: [...new Set(technologies)],
          performance: {
            loadTime: 0,
            domElements: document.querySelectorAll('*').length,
            requests: 0
          }
        };
      }, 3000);

      result.technical = {
        ...technicalData,
        performance: {
          ...technicalData.performance,
          loadTime,
          requests: requests.length
        }
      };
    } catch (error) {
      console.warn('⚠️ Error analizando tecnologías:', error);
      result.errors.push('Error analizando tecnologías');
      result.technical.performance.loadTime = loadTime;
      result.technical.performance.requests = requests.length;
    }

    // Análisis SEO básico
    console.log('🔍 Analizando SEO...');
    try {
      result.seo = await safeEvaluate(() => {
        const metaTags = Array.from(document.querySelectorAll('meta')).slice(0, 10).map(meta => ({
          name: meta.name || meta.getAttribute('property') || 'unknown',
          content: meta.content || ''
        })).filter(tag => tag.content);

        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).slice(0, 10).map(heading => ({
          level: parseInt(heading.tagName.charAt(1)),
          text: heading.textContent?.trim() || ''
        })).filter(h => h.text);

        const altTexts = Array.from(document.querySelectorAll('img[alt]')).slice(0, 10)
          .map(img => img.getAttribute('alt'))
          .filter(alt => alt && alt.trim());

        return { metaTags, headings, altTexts };
      }, 3000);
    } catch (error) {
      console.warn('⚠️ Error analizando SEO:', error);
      result.errors.push('Error analizando SEO');
    }

    console.log('✅ Análisis completado exitosamente');
    console.log(`📊 Resultados: ${result.keywords.found.length} palabras clave encontradas, ${result.technical.frameworks.length} frameworks detectados`);
    
    if (result.errors.length > 0) {
      console.log(`⚠️ Errores encontrados: ${result.errors.length}`);
    }

    return result;

  } catch (error) {
    console.error('❌ Error en análisis real:', error);
    throw error;
  } finally {
    // Cerrar recursos de manera más segura
    if (page) {
      try {
        if (!page.isClosed()) {
          await page.close();
          console.log('📄 Página cerrada');
        }
      } catch (e) {
        console.warn('⚠️ Error cerrando página:', e);
      }
    }
    if (browser) {
      try {
        await browser.close();
        console.log('🌐 Navegador cerrado');
      } catch (e) {
        console.warn('⚠️ Error cerrando navegador:', e);
      }
    }
  }
}

async function performAlternativeAnalysis(
  url: string, 
  selector: string, 
  keywords: string[], 
  options: AnalysisOptions
): Promise<AnalysisResult> {
  console.log('🌐 Ejecutando análisis alternativo con fetch...');
  
  try {
    const startTime = Date.now();
    
    // Usar fetch para obtener el HTML con timeout manual
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const loadTime = Date.now() - startTime;
    
    console.log(`📄 HTML obtenido: ${html.length} caracteres en ${loadTime}ms`);

    // Usar JSDOM para parsear el HTML (simulado con regex básico)
    const result: AnalysisResult = {
      url,
      timestamp: new Date().toISOString(),
      basicInfo: {
        title: extractWithRegex(html, /<title[^>]*>([^<]+)<\/title>/i) || 'Sin título',
        description: extractWithRegex(html, /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) || '',
        favicon: extractWithRegex(html, /<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i) || '',
        language: extractWithRegex(html, /<html[^>]*lang=["']([^"']+)["']/i) || 'unknown'
      },
      content: {
        text: '',
        html: '',
        structure: {}
      },
      keywords: {
        found: [],
        positions: []
      },
      assets: {
        images: [],
        links: [],
        scripts: [],
        stylesheets: []
      },
      technical: {
        frameworks: [],
        technologies: [],
        performance: {
          loadTime,
          domElements: (html.match(/<[^>]+>/g) || []).length,
          requests: 1
        }
      },
      seo: {
        metaTags: [],
        headings: [],
        altTexts: []
      },
      errors: []
    };

    // Extraer contenido de texto básico
    if (options.extractHTML) {
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        result.content.html = bodyMatch[1];
        result.content.text = bodyMatch[1]
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        result.content.structure = { tagName: 'body' };
      }
    }

    // Buscar palabras clave en el texto
    if (keywords.length > 0) {
      const textContent = result.content.text.toLowerCase();
      keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        if (textContent.includes(keywordLower)) {
          result.keywords.found.push(keyword);
          const position = textContent.indexOf(keywordLower);
          result.keywords.positions.push({
            keyword,
            element: 'body',
            text: textContent.substring(Math.max(0, position - 30), position + 50),
            selector: 'body',
            position
          });
        }
      });
    }

    // Extraer imágenes básicas
    if (options.extractImages) {
      const imgMatches = html.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/gi);
      for (const match of imgMatches) {
        result.assets.images.push({
          src: match[1] || '',
          alt: match[2] || '',
          title: ''
        });
        if (result.assets.images.length >= 10) break;
      }
    }

    // Extraer enlaces básicos
    if (options.extractLinks) {
      const linkMatches = html.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi);
      for (const match of linkMatches) {
        const href = match[1] || '';
        result.assets.links.push({
          href,
          text: match[2]?.trim() || '',
          type: href.startsWith('mailto:') ? 'email' : 
                href.startsWith('tel:') ? 'phone' : 'url'
        });
        if (result.assets.links.length >= 15) break;
      }
    }

    // Detectar frameworks básicos
    const frameworks: string[] = [];
    if (html.includes('react') || html.includes('React')) frameworks.push('React');
    if (html.includes('vue') || html.includes('Vue')) frameworks.push('Vue.js');
    if (html.includes('jquery') || html.includes('jQuery')) frameworks.push('jQuery');
    if (html.includes('bootstrap')) frameworks.push('Bootstrap');
    if (html.includes('wp-content') || html.includes('WordPress')) frameworks.push('WordPress');
    
    result.technical.frameworks = [...new Set(frameworks)];

    // Extraer meta tags básicos
    const metaMatches = html.matchAll(/<meta[^>]*name=["']([^"']+)["'][^>]*content=["']([^"']+)["'][^>]*>/gi);
    for (const match of metaMatches) {
      result.seo.metaTags.push({
        name: match[1] || '',
        content: match[2] || ''
      });
      if (result.seo.metaTags.length >= 10) break;
    }

    // Extraer headings básicos
    const headingMatches = html.matchAll(/<(h[1-6])[^>]*>([^<]+)<\/h[1-6]>/gi);
    for (const match of headingMatches) {
      result.seo.headings.push({
        level: parseInt(match[1].charAt(1)),
        text: match[2]?.trim() || ''
      });
      if (result.seo.headings.length >= 10) break;
    }

    console.log('✅ Análisis alternativo completado');
    console.log(`📊 Resultados: ${result.keywords.found.length} palabras clave, ${result.technical.frameworks.length} frameworks`);

    return result;

  } catch (error) {
    console.error('❌ Error en análisis alternativo:', error);
    throw error;
  }
}

// Función auxiliar para extraer con regex
function extractWithRegex(html: string, regex: RegExp): string | null {
  const match = html.match(regex);
  return match ? match[1] : null;
}

async function performSimulatedAnalysis(
  url: string, 
  selector: string, 
  keywords: string[], 
  options: AnalysisOptions
): Promise<AnalysisResult> {
  console.log('🎭 Ejecutando análisis simulado...');
  // Simulación para desarrollo cuando Puppeteer no está disponible
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simular tiempo de carga

  const mockKeywordsFound = keywords.filter(() => Math.random() > 0.3);
  
  const result: AnalysisResult = {
    url,
    timestamp: new Date().toISOString(),
    basicInfo: {
      title: `Análisis Simulado - ${new URL(url).hostname}`,
      description: 'Descripción simulada del sitio web para pruebas de desarrollo',
      favicon: '/favicon.ico',
      language: 'es'
    },
    content: {
      text: `Contenido simulado extraído del selector ${selector}. Este es un ejemplo de texto que contendría el elemento seleccionado con información relevante sobre ${keywords.join(', ')}.`,
      html: `<div class="content">${selector} - Contenido HTML simulado con datos de prueba</div>`,
      structure: {
        tagName: 'div',
        className: 'content',
        id: '',
        attributes: { class: 'content' }
      }
    },
    keywords: {
      found: mockKeywordsFound,
      positions: mockKeywordsFound.map((keyword, index) => ({
        keyword,
        element: 'span',
        text: `Texto simulado que contiene ${keyword} para pruebas de funcionalidad`,
        selector: '.content span',
        position: index * 15
      }))
    },
    assets: {
      images: options.extractImages ? [
        { src: '/image1.jpg', alt: 'Imagen simulada 1', title: 'Título 1' },
        { src: '/image2.jpg', alt: 'Imagen simulada 2', title: 'Título 2' },
        { src: '/image3.jpg', alt: 'Imagen simulada 3', title: 'Título 3' }
      ] : [],
      links: options.extractLinks ? [
        { href: '/link1', text: 'Enlace simulado 1', type: 'url' },
        { href: 'mailto:test@example.com', text: 'Contacto', type: 'email' },
        { href: 'tel:+1234567890', text: 'Teléfono', type: 'phone' }
      ] : [],
      scripts: ['/js/app.js', '/js/vendor.js', '/js/analytics.js'],
      stylesheets: ['/css/main.css', '/css/vendor.css', '/css/responsive.css']
    },
    technical: {
      frameworks: ['React', 'Next.js', 'Tailwind CSS'],
      technologies: ['Webpack', 'Babel', 'TypeScript'],
      performance: {
        loadTime: 1200 + Math.random() * 800,
        domElements: 180 + Math.floor(Math.random() * 150),
        requests: 28 + Math.floor(Math.random() * 12)
      }
    },
    seo: {
      metaTags: [
        { name: 'description', content: 'Descripción meta simulada para SEO' },
        { name: 'keywords', content: 'simulado, prueba, desarrollo, webscraping' },
        { name: 'author', content: 'ProSuite Demo' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      headings: [
        { level: 1, text: 'Título Principal Simulado' },
        { level: 2, text: 'Subtítulo de Sección' },
        { level: 3, text: 'Subsección Importante' },
        { level: 2, text: 'Otra Sección Principal' }
      ],
      altTexts: ['Alt text descriptivo 1', 'Alt text descriptivo 2', 'Alt text descriptivo 3']
    },
    errors: ['⚠️ Modo simulación: Puppeteer no disponible en este entorno']
  };

  console.log('🎭 Análisis simulado completado');
  return result;
} 