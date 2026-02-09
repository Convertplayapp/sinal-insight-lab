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
  { id: 7, text: 'Conseguimos conversar sobre assuntos difíceis sem que a discussão escale.', pillar: 'N' },
  { id: 8, text: 'Sinto que sou ouvido(a) quando expresso minhas necessidades.', pillar: 'N' },
  { id: 9, text: 'Nossos conflitos são resolvidos de forma respeitosa e construtiva.', pillar: 'N' },

  // A – Apoio e Respeito
  { id: 10, text: 'Meu(minha) parceiro(a) celebra minhas conquistas genuinamente.', pillar: 'A' },
  { id: 11, text: 'Sinto que sou tratado(a) como igual na relação.', pillar: 'A' },
  { id: 12, text: 'Há respeito mútuo mesmo quando discordamos.', pillar: 'A' },

  // L – Liberdade Pessoal
  { id: 13, text: 'Sinto que posso expressar minhas opiniões livremente, mesmo que sejam diferentes.', pillar: 'L' },
  { id: 14, text: 'Não me sinto controlado(a) em relação às minhas escolhas pessoais.', pillar: 'L' },
  { id: 15, text: 'Tenho liberdade para crescer e mudar dentro da relação.', pillar: 'L' },
];

export const scaleLabels = ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'];
