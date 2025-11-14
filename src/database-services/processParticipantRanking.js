// ./database-services/processParticipantRanking.js
const processParticipantRanking = (results) => {
  const participantData = {};
  let totalVictories = 0;

  
  // Primeiro passada: registrar todos os participantes
  results.forEach(page => {
    const participants = page.properties.Participantes;
    const resultado = page.properties.Resultado;

    if (participants && participants.multi_select) {
      participants.multi_select.forEach(participant => {
        const participantId = participant.id;
        const participantName = participant.name;
        
        if (!participantData[participantId]) {
          participantData[participantId] = {
            id: participantId,
            name: participantName,
            count: 0,
            victories: 0
          };
        }
        
        participantData[participantId].count += 1;
      });
    }

    if (resultado && resultado.select) {
      const textoResultado = resultado.select.name;      
      // Verifica se é uma vitória
      const isVictory = /Lugar/i.test(textoResultado);
      
      if (isVictory && participants && participants.multi_select) {
        
        participants.multi_select.forEach(participant => {
          const participantId = participant.id;
          if (participantData[participantId]) {
            participantData[participantId].victories += 1;
            totalVictories++;
            console.log(`🎯 Vitória contabilizada para: ${participant.name}`); // DEBUG
          }
        });
      }
    }

  });

  // DEBUG: Log final
  console.log('=== RESUMO FINAL ===');
  Object.values(participantData).forEach(p => {
    console.log(`${p.name}: ${p.count} eventos, ${p.victories} vitórias`);
  });
  
  const ranking = Object.values(participantData)
    .sort((a, b) => b.count - a.count);
  
  return {
    ranking,
    totalVictories
  };
}

export default processParticipantRanking;