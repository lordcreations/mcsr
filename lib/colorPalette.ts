export const colorPalette = [
  '#003f5c', 
  '#2f4b7c',
  '#665191',
  '#a05195',
  '#d45087',
  '#f95d6a',
  '#ff7c43',
  '#ffa600', 
  '#ffd54f', 
  '#ffffb2'  
];
// valeu xetgepete
export const getColorForPlayerCount = (playerCount: number, maxPlayerCount: number): string => {
  if (playerCount <= 0) return colorPalette[0];

  const logPlayer = Math.log10(playerCount + 1); //+1 eh pra nao ter log(0)
  const logMax = Math.log10(maxPlayerCount + 1);

  const normalized = logPlayer / logMax;
  const index = Math.floor(normalized * (colorPalette.length - 1));

  return colorPalette[index];
};
