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
  { id: 1, text: 'Eu me sinto à vontade para ser vulnerável com meu(minha) parceiro(a).', pillar: 'S' },
  { id: 2, text: 'Confio que meu(minha) parceiro(a) não usará minhas fraquezas contra mim.', pillar: 'S' },
  { id: 3, text: 'Sinto que posso contar com meu(minha) parceiro(a) em momentos difíceis.', pillar: 'S' },

  // I – Independência
  { id: 4, text: 'Mantenho minhas amizades e interesses pessoais sem culpa.', pillar: 'I' },
  { id: 5, text: 'Sinto que posso tomar decisões importantes sobre minha vida sem pedir permissão.', pillar: 'I' },
  { id: 6, text: 'Meu(minha) parceiro(a) respeita meu tempo e espaço individual.', pillar: 'I' },

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
