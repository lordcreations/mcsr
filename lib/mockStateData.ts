export type StatePlayerCount = {
  stateCode: string;
  playerCount: number;
};

// Mock data representing player counts per state
export const mockStatePlayerCounts: StatePlayerCount[] = [
  { stateCode: "BR-SP", playerCount: 20 }, // São Paulo
  { stateCode: "BR-RJ", playerCount: 10 },  // Rio de Janeiro
  { stateCode: "BR-MG", playerCount: 6 },  // Minas Gerais
  { stateCode: "BR-BA", playerCount: 2 },  // Bahia
  { stateCode: "BR-PR", playerCount: 4 },  // Paraná
  { stateCode: "BR-RS", playerCount: 8 },  // Rio Grande do Sul
  { stateCode: "BR-SC", playerCount: 3 },  // Santa Catarina
  { stateCode: "BR-PE", playerCount: 2 },  // Pernambuco
  { stateCode: "BR-ES", playerCount: 1 },  // Espírito Santo
  { stateCode: "BR-DF", playerCount: 2 },  // Distrito Federal
  { stateCode: "BR-GO", playerCount: 2 },  // Goiás
  { stateCode: "BR-MT", playerCount: 1 },  // Mato Grosso
  { stateCode: "BR-MS", playerCount: 1 },  // Mato Grosso do Sul
  { stateCode: "BR-AM", playerCount: 0 },  // Amazonas
  { stateCode: "BR-PA", playerCount: 1 },   // Pará
  { stateCode: "BR-CE", playerCount: 0 },   // Ceará
  { stateCode: "BR-MA", playerCount: 0 },   // Maranhão
  { stateCode: "BR-PI", playerCount: 1 },   // Piauí
  { stateCode: "BR-AC", playerCount: 1 },   // Acre
  { stateCode: "BR-AL", playerCount: 0 },   // Alagoas
  { stateCode: "BR-AP", playerCount: 0 },   // Amapá
  { stateCode: "BR-RO", playerCount: 0 },   // Rondônia
  { stateCode: "BR-RR", playerCount: 1 },   // Roraima
  { stateCode: "BR-RN", playerCount: 2 },   // Rio Grande do Norte
  { stateCode: "BR-PB", playerCount: 2 },   // Paraíba
  { stateCode: "BR-SE", playerCount: 1 },   // Sergipe
  { stateCode: "BR-TO", playerCount: 0 }    // Tocantins
];
