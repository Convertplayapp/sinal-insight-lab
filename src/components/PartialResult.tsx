import { motion } from 'framer-motion';
import { Lock, Eye } from 'lucide-react';
import { Result, levelLabels, levelColors } from '@/lib/scoring';
import { pillarLabels, pillarIcons, type Pillar } from '@/data/questions';

interface PartialResultProps {
  result: Result;
  onUnlock: () => void;
}

const visiblePillars: Pillar[] = ['S', 'I'];
const lockedPillars: Pillar[] = ['N', 'A', 'L'];

const lockedPillarLabels: Record<Pillar, string> = {
  N: 'Padrões de Diálogo',
  A: 'Vínculo e Autonomia',
  L: 'Sensibilidades do Dia a Dia',
  S: pillarLabels.S,
  I: pillarLabels.I,
};

const lockedPillarSubtitles: Record<Pillar, string> = {
  N: 'Perceba quando as conversas ficam confusas ou circulares.',
  A: 'Reflita sobre o equilíbrio entre proximidade e liberdade.',
  L: 'Pequenos gatilhos podem revelar necessidades importantes.',
  S: '',
  I: '',
};

const getSummaryTitle = (percentage: number) => {
  if (percentage >= 70) {
    return 'Você merece se sentir segura';
  }
  if (percentage >= 40) {
    return 'Aquilo que você sente tem nome';
  }
  return 'Seu relacionamento tem boas bases';
};

const getSummaryMessage = (percentage: number) => {
  if (percentage >= 70) {
    return 'O que você vem sentindo não é exagero. Esse resultado confirma padrões que muitas mulheres demoram anos para reconhecer. Você já deu o primeiro passo — e isso exige muita coragem.';
  }
  if (percentage >= 40) {
    return 'Talvez você já tenha se perguntado se estava imaginando coisas, ou se era "só impressão". Não é. Seu resultado mostra sinais reais que merecem atenção — e entender exatamente quais são pode mudar a forma como você se posiciona.';
  }
  return 'Seu relacionamento apresenta fundamentos positivos. Ainda assim, pequenos padrões podem passar despercebidos no dia a dia. Entender seus pontos de atenção pode fortalecer ainda mais sua conexão.';
};

const getEmotionalCTA = (percentage: number) => {
  if (percentage >= 70) {
    return 'Você não precisa continuar com dúvidas. O diagnóstico completo vai te mostrar exatamente quais áreas estão sendo mais afetadas — e o que você pode fazer a partir de agora.';
  }
  if (percentage >= 40) {
    return 'Quando a gente entende o que está acontecendo, para de se culpar. O resultado completo revela os padrões específicos do seu relacionamento e oferece um caminho claro de ação.';
  }
  return 'Conhecer seus pontos fortes e áreas de atenção pode te ajudar a manter e fortalecer o que já funciona bem no seu relacionamento.';
};

const PartialResult = ({ result, onUnlock }: PartialResultProps) => {
  const levelColor = levelColors[result.level];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <img
            src="https://res.cloudinary.com/dsxqn2er7/image/upload/v1770686747/ChatGPT_Image_9_de_fev._de_2026_22_19_32_t54d6l.png"
            alt="Método SINAL"
            className="w-40 md:w-44 mx-auto mb-4 opacity-90"
            loading="lazy"
          />
          <span className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground mb-2 block">
            Resultado da Análise
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Método SINAL
          </h2>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="card-gradient rounded-2xl shadow-elevated p-8 text-center mb-8"
        >
          <div className="relative inline-flex items-center justify-center mb-4">
            <svg className="w-28 h-28" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
              <motion.circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke={levelColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={264}
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 - (264 * result.percentage) / 100 }}
                transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <span className="absolute font-display text-2xl font-bold text-foreground">
              {result.percentage}%
            </span>
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-1">
            {getSummaryTitle(result.percentage)}
          </h3>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            {getSummaryMessage(result.percentage)}
          </p>
        </motion.div>

        {/* Visible Pillars */}
        <div className="space-y-4 mb-4">
          {result.pillarScores
            .filter((p) => visiblePillars.includes(p.pillar))
            .map((p, i) => (
              <motion.div
                key={p.pillar}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.15 }}
                className="card-gradient rounded-xl shadow-card p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-body text-sm font-medium text-foreground flex items-center gap-2">
                    <span>{pillarIcons[p.pillar]}</span>
                    {pillarLabels[p.pillar]}
                  </span>
                  <span className="font-body text-sm font-semibold text-accent">{p.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full progress-gradient rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${p.percentage}%` }}
                    transition={{ delay: 0.8 + i * 0.15, duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ))}
        </div>

        {/* Locked Pillars */}
        <div className="space-y-4 mb-8">
          {result.pillarScores
            .filter((p) => lockedPillars.includes(p.pillar))
            .map((p) => (
              <div
                key={p.pillar}
                className="card-gradient rounded-xl shadow-card p-5 relative overflow-hidden"
              >
                <div className="blur-sm select-none pointer-events-none">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-body text-sm font-medium text-foreground flex items-center gap-2">
                      <span>{pillarIcons[p.pillar]}</span>
                      {lockedPillarLabels[p.pillar]}
                    </span>
                    <span className="font-body text-sm font-semibold">--%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 font-body">
                    {lockedPillarSubtitles[p.pillar]}
                  </p>
                  <div className="w-full h-2 bg-muted rounded-full" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-muted-foreground/60" />
                </div>
              </div>
            ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <p className="font-body text-sm text-foreground/80 leading-relaxed max-w-sm mx-auto mb-5">
            {getEmotionalCTA(result.percentage)}
          </p>
          <p className="text-xs text-muted-foreground mb-2 font-body">
            💜 Acesso imediato e 100% confidencial
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUnlock}
            className="accent-gradient text-accent-foreground font-body font-semibold px-10 py-4 rounded-full text-lg shadow-glow transition-all duration-300 inline-flex items-center gap-2"
          >
            <Eye className="w-5 h-5" />
            Quero Entender Meu Resultado Completo
          </motion.button>
          <p className="text-xs text-muted-foreground mt-3 font-body">
            Por apenas R$ 9 · Acesso imediato · Garantia de 7 dias
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PartialResult;
