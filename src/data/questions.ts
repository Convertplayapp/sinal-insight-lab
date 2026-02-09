export type Pillar = 'S' | 'I' | 'N' | 'A' | 'L';

export interface Question {
  id: number;
  text: string;
  pillar: Pillar;
}

export const pillarLabels: Record<Pillar, string> = {
  S: 'Segurança Emocional',
  I: 'Independência',
  N: 'Nível de Comunicação',
  A: 'Apoio e Respeito',
  L: 'Liberdade Pessoal',
};

export const pillarDescriptions: Record<Pillar, string> = {
  S: 'O quanto você se sente emocionalmente seguro(a) na relação.',
  I: 'O quanto você mantém sua individualidade e autonomia.',
  N: 'A qualidade e profundidade da comunicação entre vocês.',
  A: 'O nível de apoio mútuo e respeito que existe na relação.',
  L: 'O espaço que você tem para ser quem é e viver sua vida.',
};

export const pillarIcons: Record<Pillar, string> = {
  S: '🛡️',
  I: '🌱',
  N: '💬',
  A: '🤝',
  L: '🕊️',
};

export const questions: Question[] = [
  // S – Segurança Emocional
  { id: 1, text: 'Você tem medo de contar como realmente se sente para ele?', pillar: 'S' },
  { id: 2, text: 'Já aconteceu dele usar algo que você contou em confiança contra você em uma discussão?', pillar: 'S' },
  { id: 3, text: 'Quando você está passando por um momento difícil, ele é a primeira pessoa que você quer procurar?', pillar: 'S' },

  // I – Independência
  { id: 4, text: 'Você já deixou de fazer algo que gostava porque sabia que ele não ia gostar?', pillar: 'I' },
  { id: 5, text: 'Precisa \'preparar o terreno\' antes de contar que vai sair com suas amigas?', pillar: 'I' },
  { id: 6, text: 'Sente que precisa da aprovação dele para tomar decisões sobre sua própria vida?', pillar: 'I' },

  // N – Nível de Comunicação
  { id: 7, text: 'Você \'engole\' o que sente para evitar uma briga?', pillar: 'N' },
  { id: 8, text: 'Quando você tenta conversar sobre algo que te incomoda, a discussão vira sobre outra coisa ou sobre você?', pillar: 'N' },
  { id: 9, text: 'Ele realmente escuta o que você diz ou só espera a vez dele falar?', pillar: 'N' },

  // A – Apoio e Respeito
  { id: 10, text: 'Quando você conquista algo importante, ele fica genuinamente feliz ou meio que ignora?', pillar: 'A' },
  { id: 11, text: 'Você sente que está sempre \'dando um jeitinho\' de não contrariá-lo?', pillar: 'A' },
  { id: 12, text: 'Nas decisões do casal, você sente que a opinião dele vale mais que a sua?', pillar: 'A' },

  // L – Liberdade Pessoal
  { id: 13, text: 'Ele mexe no seu celular, redes sociais ou quer saber detalhes de tudo que você faz?', pillar: 'L' },
  { id: 14, text: 'Você já mudou seu jeito de ser, se vestir ou agir para não \'causar problemas\'?', pillar: 'L' },
  { id: 15, text: 'Tem a sensação de que está \'andando em ovos\' ao redor dele?', pillar: 'L' },
];

export const scaleLabels = ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'];
