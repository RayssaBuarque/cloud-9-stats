
// Funções de analytics
import processParticipantRanking from './processParticipantRanking.js';

// Função para buscar dados frescos do Notion
async function fetchFreshAnalytics () {
  console.log('🔄 Buscando dados frescos do Notion...');
  
  const NOTION_KEY = process.env.NOTION_KEY;
  const DATABASE_ID = process.env.NOTION_PAGE_ID;

  const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  const data = await response.json();
  const {ranking, totalVictories} = processParticipantRanking(data.results || []);
  
  const analytics = {
    participantRanking: ranking,
    summary: {
      totalEvents: data.results ? data.results.length : 0,
      totalVictories: totalVictories,
      processedAt: new Date().toISOString(),
      cache: 'fresh' // Identifica que são dados frescos
    }
  };
  
  return analytics;
}

export default fetchFreshAnalytics;