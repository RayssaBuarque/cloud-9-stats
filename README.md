# ☁️ Cloud 9 Stats Dashboard

![Dashboard Preview](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![Notion API](https://img.shields.io/badge/Notion-API-purple)

Um dashboard interativo que transforma dados do Notion em insights visuais sobre a participação do grupo **Cloud 9** em eventos de tecnologia, hackathons e competições de inovação.


---
## 🎯 Sobre o Projeto

O **Cloud 9 Stats** nasceu da necessidade de acompanhar e celebrar as conquistas de um grupo de amigos apaixonados por tecnologia. Através de uma integração direta com o Notion, transformamos nossa base de dados de eventos em:

- 📊 **Ranking de participação** - Quem mais contribui para o grupo
- 🏆 **Contagem de vitórias** - Eventos onde nos destacamos
- 📈 **Métricas gerais** - Estatísticas de engajamento do time

## ✨ Funcionalidades

#### 🥇 Ranking Interativo
- Top 5 participantes por engajamento
- Medalhas visuais para os 3 primeiros colocados
- Barras de progresso comparativas
- Dados em cache para performance

#### 📊 Dashboard de Métricas
- **Total de Eventos** - Todos os eventos registrados
- **Vitórias** - Eventos com colocação (1º, 2º ou 3º lugar)
- **Membros** - Quantidade de participantes ativos

#### 🔄 Integração Inteligente
- Cache automático para reduzir chamadas à API
- Atualização em background
- Tratamento de erros elegante
- Dados sempre atualizados

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Interface moderna e reativa
- **TypeScript** - Tipagem estática para maior confiabilidade
- **CSS Modules** - Estilização componentizada
- **SWR** - Cache inteligente e revalidação

### Backend
- **Node.js + Express** - API robusta e escalável
- **Notion API** - Integração direta com nossa base de dados
- **CORS** - Comunicação segura entre frontend e backend

### Infraestrutura
- **Environment Variables** - Configurações sensíveis protegidas
- **Cookie Storage** - Cache no cliente para otimização
- **RESTful API** - Arquitetura limpa e organizada

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/cloud9-stats.git
cd cloud9-stats
```

### 2. Configure as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
NOTION_KEY=notion_integration_key
NOTION_PAGE_ID=cloud9_database_id
```

### 3. Instale as Dependências
```bash
npm install
```

### 4. Execute a Aplicação
```bash
# Front-end
npm run dev

# Backend
node server.js
```

### 5. Acesse o Dashboard
Abra [http://localhost:5173](http://localhost:5173) no navegador.

## 📋 Estrutura do Banco de Dados no Notion

Para que a aplicação funcione corretamente, sua database no Notion deve conter:

### Propriedades Necessárias
- **`Participantes`** (Multi-select) - Lista de membros do Cloud 9
- **`Resultado`** (Select) - Colocação no evento (ex: "1º Lugar", "2º Lugar")
- **`Categoria`** (Select) - Tipo do evento
- **`Tipo`** (Select) - Natureza da participação

### Exemplo de Entrada
| Nome do Evento | Participantes | Resultado | Categoria |
|---------------|---------------|-----------|-----------|
| Hackathon USP | Rayssa 🍒, Camila | 1º Lugar | Inovathon |

## 🎨 Personalização

### Adicionar Novas Métricas
```typescript
// No backend, adicione novas funções de processamento
const newAnalytics = {
  participantRanking: processParticipantRanking(results),
  categoryStats: processCategoryStats(results),
  // Sua nova métrica aqui
}
```

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Veja como ajudar:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Time Cloud 9


Um grupo de amigos unidos pela paixão por tecnologia, inovação e aprendizado contínuo. Já participamos de diversos hackathons, competições e eventos tech, sempre buscando evoluir e fazer a diferença.

**Desenvolvido com ☕ e 🚀 por**
[Rayssa Buarque](https://www.linkedin.com/in/rayssabuarque/)