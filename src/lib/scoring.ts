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

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const calculatePercentage = (score: number, minScore: number, maxScore: number) => {
  if (maxScore === minScore) return 0;
  const safeScore = clamp(score, minScore, maxScore);
  return Math.round(((safeScore - minScore) / (maxScore - minScore)) * 100);
};

export function calculateResult(answers: Record<number, number>): Result {
  const pillars: Pillar[] = ['S', 'I', 'N', 'A', 'L'];
  const pillarScores: PillarScore[] = pillars.map((pillar) => {
    const pillarQuestions = questions.filter((q) => q.pillar === pillar);
    const maxScore = pillarQuestions.length * 5;
    const minScore = pillarQuestions.length * 1;
    const score = pillarQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    return {
      pillar,
      score,
      maxScore,
      percentage: calculatePercentage(score, minScore, maxScore),
    };
  });

  const totalScore = pillarScores.reduce((s, p) => s + p.score, 0);
  const maxTotal = pillarScores.reduce((s, p) => s + p.maxScore, 0);
  const minTotal = questions.length * 1;
  const percentage = calculatePercentage(totalScore, minTotal, maxTotal);

  let level: Level;
  if (percentage >= 80) level = 'desgaste';
  else if (percentage >= 60) level = 'atencao';
  else if (percentage >= 40) level = 'estavel';
  else level = 'harmonia';

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
