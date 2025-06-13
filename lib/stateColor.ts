import { mockRuns } from './mockRuns';

export type StatePlayerCount = {
  stateCode: string;
  playerCount: number;
};

// ApenasK
const stateCodeToName: Record<string, string> = {
  'BR-AC': 'Acre', 'BR-AL': 'Alagoas', 'BR-AP': 'Amapá', 'BR-AM': 'Amazonas',
  'BR-BA': 'Bahia', 'BR-CE': 'Ceará', 'BR-DF': 'Distrito Federal', 'BR-ES': 'Espírito Santo',
  'BR-GO': 'Goiás', 'BR-MA': 'Maranhão', 'BR-MT': 'Mato Grosso', 'BR-MS': 'Mato Grosso do Sul',
  'BR-MG': 'Minas Gerais', 'BR-PA': 'Pará', 'BR-PB': 'Paraíba', 'BR-PR': 'Paraná',
  'BR-PE': 'Pernambuco', 'BR-PI': 'Piauí', 'BR-RJ': 'Rio de Janeiro', 'BR-RN': 'Rio Grande do Norte',
  'BR-RS': 'Rio Grande do Sul', 'BR-RO': 'Rondônia', 'BR-RR': 'Roraima', 'BR-SC': 'Santa Catarina',
  'BR-SP': 'São Paulo', 'BR-SE': 'Sergipe', 'BR-TO': 'Tocantins'
};

const stateAbbrToCode: Record<string, string> = {
  'AC': 'BR-AC', 'AL': 'BR-AL', 'AP': 'BR-AP', 'AM': 'BR-AM', 'BA': 'BR-BA',
  'CE': 'BR-CE', 'DF': 'BR-DF', 'ES': 'BR-ES', 'GO': 'BR-GO', 'MA': 'BR-MA',
  'MT': 'BR-MT', 'MS': 'BR-MS', 'MG': 'BR-MG', 'PA': 'BR-PA', 'PB': 'BR-PB',
  'PR': 'BR-PR', 'PE': 'BR-PE', 'PI': 'BR-PI', 'RJ': 'BR-RJ', 'RN': 'BR-RN',
  'RS': 'BR-RS', 'RO': 'BR-RO', 'RR': 'BR-RR', 'SC': 'BR-SC', 'SP': 'BR-SP',
  'SE': 'BR-SE', 'TO': 'BR-TO'
};

// size of unique runs set per state
const countPlayersPerState = (): Record<string, number> => {
  const playerCounts: Record<string, Set<string>> = {};
  
  mockRuns.forEach(run => {
    const stateCode = stateAbbrToCode[run.state];
    if (!stateCode) return;
    
    if (!playerCounts[stateCode]) {
      playerCounts[stateCode] = new Set();
    }
    playerCounts[stateCode].add(run.playerName);
  });
  
  const result: Record<string, number> = {};
  Object.entries(playerCounts).forEach(([stateCode, players]) => {
    result[stateCode] = players.size;
  });
  
  return result;
};

// Generate 
const playerCounts = countPlayersPerState();

export const mockStatePlayerCounts: StatePlayerCount[] = Object.entries(stateCodeToName)
  .map(([stateCode]) => ({
    stateCode,
    playerCount: playerCounts[stateCode] || 0,
  }))
  .sort((a, b) => b.playerCount - a.playerCount || a.stateCode.localeCompare(b.stateCode));
