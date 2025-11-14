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
console.log(DATABASE_ID)
console.log(DATABASE_ID)

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

// Processando dados no backend
app.get('/api/notion/analytics', async (req, res) => {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    // PRÉ-PROCESSAMENTO no backend (evita trabalho no frontend)
    const analytics = {
      // Gráfico de eventos por categoria
      participantRanking: processParticipantRanking(data.results)
      // eventsByCategory: processEventsByCategory(data.results),
      
      // Gráfico de participantes por evento
      // participantsByEvent: processParticipants(data.results),
      
      // // Gráfico de resultados
      // resultsDistribution: processResults(data.results),
      
      // Estatísticas gerais
      // stats: {
      //   totalEvents: data.results.length,
      //   totalParticipants: calculateTotalParticipants(data.results),
      //   winRate: calculateWinRate(data.results)
      // }
    };
    
    res.json(analytics);
    
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});