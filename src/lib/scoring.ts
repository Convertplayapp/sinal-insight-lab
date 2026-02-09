import { Pillar, questions } from '@/data/questions';

export type Level = 'harmonia' | 'estavel' | 'atencao' | 'desgaste';

export interface PillarScore {
  pillar: Pillar;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface Result {
  totalScore: number;
  maxTotal: number;
  percentage: number;
  level: Level;
  pillarScores: PillarScore[];
}

export const levelLabels: Record<Level, string> = {
  harmonia: 'Harmonia Alta',
  estavel: 'Estável',
  atencao: 'Atenção',
  desgaste: 'Desgaste Emocional',
};

export const levelColors: Record<Level, string> = {
  harmonia: 'hsl(150 60% 45%)',
  estavel: 'hsl(200 60% 50%)',
  atencao: 'hsl(40 90% 50%)',
  desgaste: 'hsl(0 70% 55%)',
};

export function calculateResult(answers: Record<number, number>): Result {
  const pillars: Pillar[] = ['S', 'I', 'N', 'A', 'L'];
  const pillarScores: PillarScore[] = pillars.map((pillar) => {
    const pillarQuestions = questions.filter((q) => q.pillar === pillar);
    const maxScore = pillarQuestions.length * 5;
    const score = pillarQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    return { pillar, score, maxScore, percentage: Math.round((score / maxScore) * 100) };
  });

  const totalScore = pillarScores.reduce((s, p) => s + p.score, 0);
  const maxTotal = pillarScores.reduce((s, p) => s + p.maxScore, 0);
  const percentage = Math.round((totalScore / maxTotal) * 100);

  let level: Level;
  if (percentage >= 80) level = 'harmonia';
  else if (percentage >= 60) level = 'estavel';
  else if (percentage >= 40) level = 'atencao';
  else level = 'desgaste';

  return { totalScore, maxTotal, percentage, level, pillarScores };
}

export function getPersonalizedMessage(level: Level): string {
  const messages: Record<Level, string> = {
    harmonia: 'Seu relacionamento demonstra uma base sólida de confiança, respeito e comunicação. Continue cultivando esses pilares para manter a harmonia.',
    estavel: 'Seu relacionamento possui bons fundamentos, mas algumas áreas podem ser fortalecidas. Pequenos ajustes podem trazer grandes transformações.',
    atencao: 'Seu relacionamento demonstra sinais que merecem atenção. Existem áreas importantes que, se trabalhadas, podem restaurar o equilíbrio emocional.',
    desgaste: 'Seu relacionamento apresenta sinais significativos de desgaste emocional. É importante buscar diálogo e, se necessário, apoio profissional.',
  };
  return messages[level];
}
