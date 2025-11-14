import { useEffect, useState } from 'react';
import CountItem from './components/Count_item/Count-item-component'
import RankMini from './components/Rank_mini/Rank-mini-component'
import './App.css'

// Função para ler cookies
const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return JSON.parse(decodeURIComponent(cookieValue));
    }
  }
  return null;
};


function App() {
  const [membrosCount, setMembrosCount] = useState<number>(0);
  const [eventosCount, setEventosCount] = useState<number>(0);
  const [vitoriasCount, setVitoriasCount] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      // Se as informações gerais de propriedades da base não estiverem nos cookies do navegador, nós colocamos elas lá.
      if(!getCookie('participantes') && !getCookie('categoria') && !getCookie('resultado') && !getCookie('tipo')){
        try {
          const res = await fetch('http://localhost:4000/api/notion/database'); 
          const data = await res.json();
          console.log(data)

          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 1);

          if (data.properties.Participantes) {
            const cookieValue = JSON.stringify(data.properties.Participantes);
            document.cookie = `participantes=${encodeURIComponent(cookieValue)}; expires=${expirationDate.toUTCString()}; path=/`;
          }
          if (data.properties.Categoria) {
            const cookieValue = JSON.stringify(data.properties.Categoria);
            document.cookie = `categoria=${encodeURIComponent(cookieValue)}; expires=${expirationDate.toUTCString()}; path=/`;
          }
          if (data.properties.Resultado) {
            const cookieValue = JSON.stringify(data.properties.Resultado);
            document.cookie = `resultado=${encodeURIComponent(cookieValue)}; expires=${expirationDate.toUTCString()}; path=/`;
          }
          if (data.properties.Tipo) {
            const cookieValue = JSON.stringify(data.properties.Tipo);
            document.cookie = `tipo=${encodeURIComponent(cookieValue)}; expires=${expirationDate.toUTCString()}; path=/`;
          }
        } catch (error) {
          console.error("Erro ao buscar Notion:", error);
        }
      }

      // BUSCAR DADOS DE ANALYTICS PARA EVENTOS E VITÓRIAS
      try {
        const analyticsRes = await fetch('http://localhost:4000/api/notion/analytics');
        const analyticsData = await analyticsRes.json();
        
        console.log('Dados de analytics:', analyticsData);
        
        // Atualizar os states com os dados do analytics
        if (analyticsData.summary) {
          setEventosCount(analyticsData.summary.totalEvents || 0);
          setVitoriasCount(analyticsData.summary.totalVictories || 0);
        }
      } catch (error) {
        console.error("Erro ao buscar analytics:", error);
      }
    }

    loadData();

   setMembrosCount(getCookie('participantes') ? getCookie('participantes').multi_select.options.length : 0);
  }, []);


  return (
    <>
      <div>
        <div className='count-bar'>
          <div className='count-items'>
            <CountItem title="Eventos" count={eventosCount}/>
            <CountItem title='Vitórias' count={vitoriasCount}/>
            <CountItem title='Membros' count={membrosCount}/>
          </div>
        </div>

        <h1>Cloud 9 Stats</h1>

        <RankMini 
          title="🏆 Top 5 Nuvens-nove"
          maxItems={5}
          showMedals={true}
        />      



      </div>
    </>
  )
}

export default App
