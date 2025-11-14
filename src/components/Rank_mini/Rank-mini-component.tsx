import React from 'react';
import './Rank-mini-component.css';

interface Participant {
  id: string;
  name: string;
  count: number;
  victories: number;
}

interface RankingData {
  participantRanking: Participant[];
  summary: {
    totalEvents: number;
    processedAt: string;
    cache?: string;
  };
}

interface RankMiniProps {
  title?: string;
  maxItems?: number;
  showMedals?: boolean;
}

interface RankMiniState {
  rankingData: RankingData | null;
  loading: boolean;
  error: string | null;
}

class RankMini extends React.Component<RankMiniProps, RankMiniState> {
  constructor(props: RankMiniProps) {
    super(props);
    this.state = {
      rankingData: null,
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.fetchRankingData();
  }

  fetchRankingData = async () => {
    try {
      this.setState({ loading: true, error: null });
      
      const response = await fetch('http://localhost:4000/api/notion/analytics');
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      this.setState({ 
        rankingData: data, 
        loading: false 
      });
      
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
      this.setState({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido', 
        loading: false 
      });
    }
  };

  renderRankingList() {
    const { rankingData } = this.state;
    const { maxItems = 5, showMedals = true } = this.props;
    
    if (!rankingData?.participantRanking) {
      return <span>Nenhum dado disponível</span>;
    }

    const topParticipants = rankingData.participantRanking.slice(0, maxItems);

    if (topParticipants.length === 0) {
      return <span>Nenhum participante encontrado</span>;
    }

    return (
      <div id='rank-mini-lines'>
        {topParticipants.map((participant, index) => (
          <div className='rank-mini-line'  key={participant.id}>
            <div className={`rank-mini-score ${showMedals ? 'show-medals' : ''}`}>
              <span className={`rank-item-score rank-${index + 1}`}>{index + 1}</span>
              <h3>{participant.name}</h3>
            </div>
            
            <div className='rank-mini-info'>
              <span className='rank-mini-event-total'>{participant.count} evento{participant.count !== 1 ? 's' : ''}</span>
              <span className='rank-mini-victory-total'>{participant.victories} vitória{participant.victories !== 1 ? 's' : ''}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { title = "🏆 Top Participantes" } = this.props;
    const { loading, error, rankingData } = this.state;

    return (
      <div id='Rankmini'>
        <div className='rank-mini-header'>
          <h3 id='rank-mini-title'>{title}</h3>
          {rankingData && (
            <span  id='rank-mini-under-title'>
              Total: {rankingData.summary?.totalEvents || 0} eventos
            </span>
          )}
        </div>

        <div id='rank-mini-loadingBox'>
          {loading && (
            <div id='rank-mini-loadingText'>
              <p>Carregando ranking...</p>
            </div>
          )}

          {error && (
            <div id='rank-mini-errorBox'>
              <p>❌ Erro ao carregar</p>
              <p className='discrete-error'>{error}</p>
                <button className='discrete-button' onClick={this.fetchRankingData}>
                  Tentar novamente
                </button>
              </div>
          )}

          {!loading && !error && this.renderRankingList()}
        </div>

        {rankingData?.summary?.cache && (
          <div id='rank-mini-cache-indicator'>
            {rankingData.summary.cache === 'fresh' ? '🔄 Atualizado agora' : '⚡ Dados em cache'}
          </div>
        )}
      </div>
    );
  }
}

export default RankMini;