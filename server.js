// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// import { processParticipantRanking } from './src/database-services/processParticipantRanking.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const NOTION_KEY = process.env.NOTION_KEY;
const DATABASE_ID = process.env.NOTION_PAGE_ID;

// Cache em memória
let analyticsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 horas


/* MINHAS FUNÇÕES */
// Importar a função de processamento
import fetchFreshAnalytics from './src/database-services/fetchFreshAnalytics.js';



app.get('/api/notion/test', async(req, res) => {
  try {
    
    // Passando o ID da base
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      } 
    });

    const data = await response.json();
    return res.json(data)
  } catch{
      res.json({message: "Teste bem sucedido!"});
  }
  }
);


// Rota que retorna METADADOS da database do Notion
app.get('/api/notion/database', async (req, res) => {
  try {
    
    // Passando o ID da base
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      } 
    });

    const data = await response.json();
    
    // console.log('Resposta do Notion API:');
    // console.log(JSON.stringify(data, null, 2));
    
    res.json(data);

  } catch (err) {
    console.error('Erro ao consultar Notion:', err);
    res.status(500).json({ 
      error: err.message,
      details: err.body 
    });
  }
});

// Rota com cache
app.get('/api/notion/analytics', async (req, res) => {
  try {
    const now = Date.now();
    const useCache = req.query.cache !== 'false'; // Permite forçar refresh com ?cache=false
    
    // Se tem cache válido e não foi forçado refresh
    if (useCache && analyticsCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('⚡ Servindo dados do cache');
      res.json({
        ...analyticsCache,
        summary: {
          ...analyticsCache.summary,
          cache: 'hit',
          cachedAt: new Date(cacheTimestamp).toISOString()
        }
      });
      return;
    }
    
    // Busca dados frescos
    const freshAnalytics = await fetchFreshAnalytics();
    
    // Atualiza cache
    analyticsCache = freshAnalytics;
    cacheTimestamp = now;
    
    console.log('🔄 Cache atualizado');
    res.json(freshAnalytics);
    
  } catch (err) {
    console.error('Erro na rota /analytics:', err);
    
    // Se der erro mas tiver cache, serve o cache mesmo desatualizado
    if (analyticsCache) {
      console.log('⚠️  Erro na API, servindo cache desatualizado');
      res.json({
        ...analyticsCache,
        summary: {
          ...analyticsCache.summary,
          cache: 'stale',
          error: err.message
        }
      });
    } else {
      res.status(500).json({ 
        error: err.message,
        details: 'Falha ao processar analytics' 
      });
    }
  }
});

// Rota para forçar refresh do cache
app.post('/api/notion/refresh-cache', async (req, res) => {
  try {
    analyticsCache = null;
    cacheTimestamp = null;
    
    const freshData = await fetchFreshAnalytics();
    
    res.json({
      message: 'Cache atualizado com sucesso',
      data: freshData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para ver status do cache
app.get('/api/notion/cache-status', (req, res) => {
  const status = {
    hasCache: !!analyticsCache,
    cacheAge: cacheTimestamp ? Date.now() - cacheTimestamp : null,
    cacheDuration: CACHE_DURATION,
    isValid: cacheTimestamp ? (Date.now() - cacheTimestamp) < CACHE_DURATION : false
  };
  
  res.json(status);
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});