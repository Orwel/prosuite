import { NextRequest, NextResponse } from 'next/server';

// Simulamos datos en memoria (en producción vendrían de una BD)
let scrapingData: any[] = [
  {
    id: '1',
    websiteId: '1',
    websiteName: 'Ejemplo Sitio 1',
    url: 'https://example.com',
    selector: '.price',
    timestamp: new Date().toISOString(),
    data: [
      { index: 0, text: '$299.99', html: '<span class="price">$299.99</span>', tagName: 'span' },
      { index: 1, text: '$399.99', html: '<span class="price">$399.99</span>', tagName: 'span' }
    ],
    dataCount: 2,
    status: 'success'
  },
  {
    id: '2',
    websiteId: '2',
    websiteName: 'Hacker News',
    url: 'https://news.ycombinator.com',
    selector: '.storylink',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    data: [
      { index: 0, text: 'Show HN: My new project', html: '<a class="storylink">Show HN: My new project</a>', tagName: 'a' },
      { index: 1, text: 'Ask HN: Best practices', html: '<a class="storylink">Ask HN: Best practices</a>', tagName: 'a' }
    ],
    dataCount: 2,
    status: 'success'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    const from = searchParams.get('from'); // fecha desde
    const to = searchParams.get('to'); // fecha hasta

    let filteredData = [...scrapingData];

    // Filtrar por websiteId
    if (websiteId) {
      filteredData = filteredData.filter(item => item.websiteId === websiteId);
    }

    // Filtrar por estado
    if (status) {
      filteredData = filteredData.filter(item => item.status === status);
    }

    // Filtrar por rango de fechas
    if (from) {
      const fromDate = new Date(from);
      filteredData = filteredData.filter(item => new Date(item.timestamp) >= fromDate);
    }

    if (to) {
      const toDate = new Date(to);
      filteredData = filteredData.filter(item => new Date(item.timestamp) <= toDate);
    }

    // Ordenar por timestamp (más reciente primero)
    filteredData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Paginación
    const paginatedData = filteredData.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedData,
      pagination: {
        total: filteredData.length,
        limit: limit,
        offset: offset,
        hasMore: offset + limit < filteredData.length
      },
      stats: {
        totalRecords: scrapingData.length,
        successfulScrapes: scrapingData.filter(item => item.status === 'success').length,
        failedScrapes: scrapingData.filter(item => item.status === 'error').length,
        totalDataPoints: scrapingData.reduce((sum, item) => sum + item.dataCount, 0)
      }
    });

  } catch (error) {
    console.error('Error obteniendo datos de scraping:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const newData = await request.json();
    
    // Validar datos requeridos
    if (!newData.websiteId || !newData.data) {
      return NextResponse.json(
        { error: 'websiteId y data son requeridos' },
        { status: 400 }
      );
    }

    // Agregar timestamp si no existe
    if (!newData.timestamp) {
      newData.timestamp = new Date().toISOString();
    }

    // Generar ID único
    newData.id = Date.now().toString();

    // Agregar los datos
    scrapingData.push(newData);

    // Mantener solo los últimos 1000 registros
    if (scrapingData.length > 1000) {
      scrapingData = scrapingData.slice(-1000);
    }

    return NextResponse.json({
      success: true,
      message: 'Datos agregados correctamente',
      data: newData
    });

  } catch (error) {
    console.error('Error agregando datos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 