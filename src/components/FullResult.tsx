import { motion } from 'framer-motion';
import { Download, CheckCircle2 } from 'lucide-react';
import { Result, levelLabels, levelColors } from '@/lib/scoring';
import { pillarLabels, pillarIcons, pillarDescriptions } from '@/data/questions';

interface FullResultProps {
  result: Result;
  showSuccess?: boolean;
}

const actionPlans: Record<string, string[]> = {
  S: [
    'Reserve 10 minutos diários para conversar sobre sentimentos sem julgamento.',
    'Pratique demonstrar vulnerabilidade em pequenas doses.',
    'Crie rituais de reconexão, como um abraço ao se reencontrar.',
  ],
  I: [
    'Mantenha pelo menos uma atividade que seja só sua.',
    'Respeite e incentive os interesses individuais do(a) parceiro(a).',
    'Evite cobranças por tempo separado — é saudável.',
  ],
  N: [
    'Use frases com "eu sinto" em vez de "você sempre".',
    'Estabeleça um código para pausar discussões que estão escalando.',
    'Agendem conversas importantes em momentos calmos.',
  ],
  A: [
    'Celebre as pequenas conquistas um do outro com genuinidade.',
    'Pratique a escuta ativa: repita o que ouviu antes de responder.',
    'Evite comparações com outros relacionamentos.',
  ],
  L: [
    'Converse sobre expectativas e limites pessoais regularmente.',
    'Permita que cada um cresça sem medo de distanciamento.',
    'Apoie mudanças de opinião e evolução pessoal.',
  ],
};

const assertivePhrases = [
  '"Preciso te falar algo importante. Podemos conversar com calma?"',
  '"Quando isso acontece, eu me sinto... e gostaria que pudéssemos..."',
  '"Eu valorizo nosso relacionamento e quero que a gente encontre um caminho juntos."',
  '"Preciso de um tempo para organizar meus pensamentos. Podemos retomar depois?"',
  '"Eu entendo seu ponto de vista, e ao mesmo tempo, sinto que..."',
];

const getResultMessage = (percentage: number) => {
  if (percentage <= 39) {
    return 'Seu resultado sugere uma base relativamente estável. Isso pode ajudar a entender o que você vem sentindo e indicar ajustes leves, caso queira evoluir.';
  }
  if (percentage <= 69) {
    return 'Há sinais moderados que convidam à reflexão. Este diagnóstico pode organizar o que você vem sentindo e inspirar pequenos passos de cuidado.';
  }
  return 'Há indícios importantes que merecem atenção cuidadosa. O resultado pode esclarecer sensações recentes e apoiar escolhas mais conscientes.';
};

const FullResult = ({ result, showSuccess }: FullResultProps) => {
  const levelColor = levelColors[result.level];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {showSuccess && (
          <div className="mb-6 text-center text-xs text-accent font-body">
            Diagnóstico completo liberado com sucesso.
          </div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="text-xs font-body tracking-[0.2em] uppercase text-accent mb-2 block">
            Análise Completa
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Seu Diagnóstico SINAL
          </h2>
          <p className="font-body text-muted-foreground text-sm max-w-md mx-auto">
            {getResultMessage(result.percentage)}
          </p>
        </motion.div>

        {/* Score circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
              <motion.circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke={levelColor}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={264}
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 - (264 * result.percentage) / 100 }}
                transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute text-center">
              <span className="font-display text-3xl font-bold text-foreground block">{result.percentage}%</span>
              <span className="font-body text-xs text-muted-foreground">{levelLabels[result.level]}</span>
            </div>
          </div>
        </motion.div>

        {/* All Pillars */}
        <div className="space-y-4 mb-12">
          {result.pillarScores.map((p, i) => (
            <motion.div
              key={p.pillar}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="card-gradient rounded-xl shadow-card p-5"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-body text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="text-lg">{pillarIcons[p.pillar]}</span>
                  {pillarLabels[p.pillar]}
                </span>
                <span className="font-body text-sm font-bold text-accent">{p.percentage}%</span>
              </div>
              <p className="font-body text-xs text-muted-foreground mb-3">{pillarDescriptions[p.pillar]}</p>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${levelColor}, hsl(var(--accent)))` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${p.percentage}%` }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-12"
        >
          <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
            Plano de Ação Personalizado
          </h3>
          <div className="space-y-6">
            {result.pillarScores
              .sort((a, b) => b.percentage - a.percentage)
              .slice(0, 3)
              .map((p) => (
                <div key={p.pillar} className="card-gradient rounded-xl shadow-card p-6">
                  <h4 className="font-body text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span>{pillarIcons[p.pillar]}</span>
                    {pillarLabels[p.pillar]} — {p.percentage}%
                  </h4>
                  <ul className="space-y-2">
                    {actionPlans[p.pillar]?.map((action, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span className="font-body text-sm text-muted-foreground">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </motion.div>

        {/* Assertive Phrases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mb-12"
        >
          <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
            Frases para Conversas Difíceis
          </h3>
          <div className="card-gradient rounded-xl shadow-card p-6 space-y-4">
            {assertivePhrases.map((phrase, i) => (
              <p key={i} className="font-body text-sm text-foreground/80 italic border-l-2 border-accent/40 pl-4">
                {phrase}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="mb-12"
        >
          <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
            Checklist de Limites Saudáveis
          </h3>
          <div className="card-gradient rounded-xl shadow-card p-6 space-y-3">
            {[
              'Comunico minhas necessidades com clareza e respeito',
              'Respeito os limites do(a) meu(minha) parceiro(a)',
              'Não abro mão dos meus valores para evitar conflitos',
              'Permito que ambos tenham tempo e espaço individual',
              'Busco resolver conflitos de forma construtiva',
              'Reconheço sinais de desrespeito e ajo com firmeza',
            ].map((item, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                />
                <span className="font-body text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </motion.div>

        {/* Download */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="accent-gradient text-accent-foreground font-body font-semibold px-8 py-4 rounded-full text-base shadow-glow transition-all duration-300 inline-flex items-center gap-2"
            onClick={() => window.print()}
          >
            <Download className="w-5 h-5" />
            Salvar Resultado (PDF)
          </motion.button>
          <p className="text-xs text-muted-foreground mt-3 font-body">
            Use Ctrl+P ou Cmd+P para salvar como PDF
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FullResult;
