// Mapeamento de itens de compra para emojis
const emojiMap = {
  // Carnes
  'frango': '🍗',
  'carne': '🥩',
  'boi': '🥩',
  'vaca': '🥩',
  'porco': '🥓',
  'bacon': '🥓',
  'linguiça': '🌭',
  'salsicha': '🌭',
  'hambúrguer': '🍔',
  'peixe': '🐟',
  'salmão': '🍣',
  'camarão': '🦐',
  
  // Laticínios
  'leite': '🥛',
  'queijo': '🧀',
  'iogurte': '🥤',
  'manteiga': '🧈',
  'creme': '🥛',
  'requeijão': '🧀',
  
  // Frutas
  'maçã': '🍎',
  'banana': '🍌',
  'laranja': '🍊',
  'limão': '🍋',
  'uva': '🍇',
  'morango': '🍓',
  'abacaxi': '🍍',
  'melancia': '🍉',
  'melão': '🍈',
  'pêra': '🍐',
  'pêssego': '🍑',
  'cereja': '🍒',
  'kiwi': '🥝',
  'manga': '🥭',
  
  // Vegetais e Legumes
  'tomate': '🍅',
  'batata': '🥔',
  'cebola': '🧅',
  'alho': '🧄',
  'cenoura': '🥕',
  'brócolis': '🥦',
  'alface': '🥬',
  'couve': '🥬',
  'espinafre': '🥬',
  'milho': '🌽',
  'pimentão': '🫑',
  'abóbora': '🎃',
  'cogumelo': '🍄',
  'berinjela': '🍆',
  'pepino': '🥒',
  'abobrinha': '🥒',
  
  // Pães e Grãos
  'pão': '🍞',
  'arroz': '🍚',
  'macarrão': '🍝',
  'pizza': '🍕',
  'torta': '🥧',
  'bolo': '🍰',
  'biscoito': '🍪',
  'pão de queijo': '🧀',
  
  // Bebidas
  'café': '☕',
  'chá': '🍵',
  'suco': '🧃',
  'refrigerante': '🥤',
  'água': '💧',
  'cerveja': '🍺',
  'vinho': '🍷',
  
  // Doces e Sobremesas
  'chocolate': '🍫',
  'doce': '🍬',
  'sorvete': '🍨',
  'gelado': '🍨',
  'pudim': '🍮',
  
  // Limpeza
  'sabão': '🧼',
  'detergente': '🧴',
  'papel': '🧻',
  'papel higiênico': '🧻',
  
  // Outros
  'ovo': '🥚',
  'sal': '🧂',
  'açúcar': '🍚',
  'óleo': '🧴',
  'azeite': '🫒',
  'farinha': '🌾',
  'feijão': '🫘',
  'ervilha': '🟢',
  'grão de bico': '🟤',
  'lentilha': '🟤',
  'noz': '🌰',
  'amendoim': '🥜',
  'castanha': '🌰',
  'amêndoa': '🌰',
  
  // Itens genéricos por categoria
  'fruta': '🍎',
  'legume': '🥕',
  'verdura': '🥬',
  'doce': '🍬',
  'salgado': '🍿',
  'bebida': '🥤',
  'comida': '🍽️',
  'lanche': '🍔',
  'sobremesa': '🍰',
  'limpeza': '🧹',
  'higiene': '🧼',
  'produto': '🛍️',
};

// Função para obter emoji baseado no nome do item
export function getItemEmoji(itemName) {
  if (!itemName) return '🛒';
  
  // Converte para minúsculas e remove acentos para melhor correspondência
  const normalizedItem = itemName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  // Procura correspondência exata
  if (emojiMap[normalizedItem]) {
    return emojiMap[normalizedItem];
  }
  
  // Procura por palavras-chave no nome do item
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (normalizedItem.includes(key) || key.includes(normalizedItem)) {
      return emoji;
    }
  }
  
  // Se não encontrar, tenta categorizar por palavras-chave
  if (normalizedItem.includes('carne') || normalizedItem.includes('bovina') || normalizedItem.includes('suina')) {
    return '🥩';
  }
  if (normalizedItem.includes('frango') || normalizedItem.includes('ave')) {
    return '🍗';
  }
  if (normalizedItem.includes('peixe') || normalizedItem.includes('marisco') || normalizedItem.includes('fruto do mar')) {
    return '🐟';
  }
  if (normalizedItem.includes('leite') || normalizedItem.includes('laticinio') || normalizedItem.includes('derivado')) {
    return '🥛';
  }
  if (normalizedItem.includes('fruta') || normalizedItem.includes('fruto')) {
    return '🍎';
  }
  if (normalizedItem.includes('legume') || normalizedItem.includes('verdura')) {
    return '🥕';
  }
  if (normalizedItem.includes('pão') || normalizedItem.includes('massa') || normalizedItem.includes('grao')) {
    return '🍞';
  }
  if (normalizedItem.includes('doce') || normalizedItem.includes('sobremesa')) {
    return '🍬';
  }
  if (normalizedItem.includes('bebida') || normalizedItem.includes('liquido')) {
    return '🥤';
  }
  if (normalizedItem.includes('limpeza') || normalizedItem.includes('higiene')) {
    return '🧼';
  }
  
  // Emoji padrão se não encontrar nada
  return '🛒';
}