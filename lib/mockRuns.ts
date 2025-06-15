export type RunCategory = 'rsg' | 'ssg' | 'ranked';
export type RunVersion = '1.7' | '1.14' | '1.16';

export interface Run {
  id: string;
  playerName: string;
  time: string;
  category: RunCategory;
  version: RunVersion;
  state: string; // codigo do estado
  date: string; // ISO
  verified: boolean;
}

export const mockRuns: Run[] = [
  {
    id: '1',
    playerName: 'brahams',
    time: '08:11',
    category: 'rsg',
    version: '1.16',
    state: 'PA',
    date: '2025-06-10T14:30:00Z',
    verified: true,
  },
  {
    id: '2',
    playerName: 'SpeedRunner42',
    time: '10:49',
    category: 'rsg',
    version: '1.16',
    state: 'RJ',
    date: '2025-06-09T18:15:00Z',
    verified: true,
  },
  {
    id: '3',
    playerName: 'SpeedRunner54',
    time: '09:10',
    category: 'rsg',
    version: '1.16',
    state: 'SP',
    date: '2025-06-08T10:45:00Z',
    verified: true,
  },
  {
    id: '4',
    playerName: 'SpeedRunner22',
    time: '15:30',
    category: 'rsg',
    version: '1.16',
    state: 'SP',
    date: '2025-06-11T20:20:00Z',
    verified: false,
  },
];

const stateCodeToAbbr: Record<string, string> = {
  'BR-AC': 'AC', 'BR-AL': 'AL', 'BR-AP': 'AP', 'BR-AM': 'AM', 'BR-BA': 'BA',
  'BR-CE': 'CE', 'BR-DF': 'DF', 'BR-ES': 'ES', 'BR-GO': 'GO', 'BR-MA': 'MA',
  'BR-MT': 'MT', 'BR-MS': 'MS', 'BR-MG': 'MG', 'BR-PA': 'PA', 'BR-PB': 'PB',
  'BR-PR': 'PR', 'BR-PE': 'PE', 'BR-PI': 'PI', 'BR-RJ': 'RJ', 'BR-RN': 'RN',
  'BR-RS': 'RS', 'BR-RO': 'RO', 'BR-RR': 'RR', 'BR-SC': 'SC', 'BR-SP': 'SP',
  'BR-SE': 'SE', 'BR-TO': 'TO'
};

const stateNameToCode: Record<string, string> = {
  'Acre': 'BR-AC', 'Alagoas': 'BR-AL', 'Amapá': 'BR-AP', 'Amazonas': 'BR-AM',
  'Bahia': 'BR-BA', 'Ceará': 'BR-CE', 'Distrito Federal': 'BR-DF', 'Espírito Santo': 'BR-ES',
  'Goiás': 'BR-GO', 'Maranhão': 'BR-MA', 'Mato Grosso': 'BR-MT', 'Mato Grosso do Sul': 'BR-MS',
  'Minas Gerais': 'BR-MG', 'Pará': 'BR-PA', 'Paraíba': 'BR-PB', 'Paraná': 'BR-PR',
  'Pernambuco': 'BR-PE', 'Piauí': 'BR-PI', 'Rio de Janeiro': 'BR-RJ', 'Rio Grande do Norte': 'BR-RN',
  'Rio Grande do Sul': 'BR-RS', 'Rondônia': 'BR-RO', 'Roraima': 'BR-RR', 'Santa Catarina': 'BR-SC',
  'São Paulo': 'BR-SP', 'Sergipe': 'BR-SE', 'Tocantins': 'BR-TO'
};

export const getStateAbbreviation = (stateName: string): string | null => {
  if (stateName.length === 2) return stateName.toUpperCase();
  
  const stateCode = stateNameToCode[stateName];
  if (stateCode) {
    return stateCodeToAbbr[stateCode] || null;
  }
  
  return null;
};

export const getFilteredRuns = (
  category: RunCategory | null, 
  version: RunVersion | null, 
  stateName: string | null = null
): Run[] => {
  return mockRuns.filter(run => {
    const matchesCategory = !category || run.category === category;
    const matchesVersion = !version || run.version === version;
    
    // skip if no state is selected, so t will show brasils ranking
    if (stateName === 'Brasil' || stateName === null || stateName === undefined) {
      return matchesCategory && matchesVersion;
    }
    
    const stateAbbr = getStateAbbreviation(stateName);
    const matchesState = stateAbbr ? run.state === stateAbbr : false;
    
    return matchesCategory && matchesVersion && matchesState;
  });
};
