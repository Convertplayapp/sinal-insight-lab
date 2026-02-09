import { motion } from 'framer-motion';
import { Check, Shield, FileText, MessageCircle, CheckSquare, Lock, Clock } from 'lucide-react';
import { type Result } from '@/lib/scoring';

const pillarNames: Record<string, string> = {
  S: 'Segurança Emocional',
  I: 'Independência',
  N: 'Comunicação',
  A: 'Apoio e Respeito',
  L: 'Liberdade Pessoal',
};

interface PurchaseScreenProps {
  result: Result;
  onPurchase: () => void;
  onBack: () => void;
}

const benefits = [
  { icon: FileText, text: 'Diagnóstico completo dos 5 pilares' },
  { icon: MessageCircle, text: 'Frases prontas para conversas difíceis' },
  { icon: CheckSquare, text: 'Checklist de limites saudáveis' },
  { icon: Check, text: 'Plano de ação personalizado em etapas' },
];

function getDynamicPhrase(result: Result): string {
  const lowest = [...result.pillarScores].sort((a, b) => a.percentage - b.percentage)[0];
  
  if (result.percentage >= 75) {
    return 'Você demonstra boa maturidade emocional, e entender seus pontos fortes pode ampliar ainda mais sua qualidade de conexão.';
  }
  if (result.percentage >= 50) {
    return 'Seu relacionamento apresenta bons fundamentos, e alguns refinamentos podem fortalecer ainda mais a harmonia.';
  }
  return `Com base nas suas respostas, pequenos ajustes na área de ${pillarNames[lowest.pillar]} podem gerar grande impacto positivo.`;
}

const PurchaseScreen = ({ result, onPurchase, onBack }: PurchaseScreenProps) => {
  // Get the 3 locked pillars (indices 2,3,4)
  const lockedPillars = result.pillarScores.slice(2, 5);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="card-gradient rounded-2xl shadow-elevated p-8 md:p-10">
          <div className="text-center mb-8">
            <span className="text-xs font-body tracking-[0.2em] uppercase text-accent mb-2 block">
              Análise Completa
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Desbloqueie seu diagnóstico
            </h2>
            <p className="font-body text-sm text-muted-foreground">
              Acesse o resultado detalhado e seu plano de ação personalizado.
            </p>
          </div>

          {/* Price */}
          <div className="text-center mb-2">
            <div className="inline-flex items-baseline gap-1">
              <span className="text-sm text-muted-foreground font-body">R$</span>
              <span className="font-display text-5xl font-bold text-foreground">17</span>
            </div>
            <p className="text-xs text-muted-foreground font-body mt-1">Pagamento único</p>
          </div>

          {/* Comparação de valor suave */}
          <p className="text-center text-xs text-muted-foreground/70 font-body mb-8">
            Menos que o valor de um lanche.
          </p>

          {/* Benefits */}
          <div className="space-y-4 mb-6">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-4 h-4 text-accent" />
                </div>
                <span className="font-body text-sm text-foreground">{b.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Frase dinâmica personalizada */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="rounded-xl bg-accent/5 border border-accent/10 p-4 mb-6"
          >
            <p className="font-body text-sm text-foreground/80 text-center italic leading-relaxed">
              "{getDynamicPhrase(result)}"
            </p>
          </motion.div>

          {/* Mini preview conteúdo bloqueado */}
          <div className="rounded-xl border border-border/50 p-4 mb-6 space-y-2.5">
            <p className="font-body text-xs text-muted-foreground mb-3 text-center">
              Conteúdo bloqueado na sua análise:
            </p>
            {lockedPillars.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="font-body text-sm text-foreground/70">{pillarNames[p.pillar]}</span>
                <Lock className="w-3.5 h-3.5 text-muted-foreground/50" />
              </div>
            ))}
            <p className="font-body text-xs text-muted-foreground/70 text-center pt-2">
              Desbloqueie para visualizar seu nível detalhado e recomendações personalizadas.
            </p>
          </div>

          {/* Micro prova social */}
          <p className="text-center text-xs text-muted-foreground/60 font-body mb-6">
            Milhares de análises realizadas · Ferramenta utilizada diariamente
          </p>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPurchase}
            className="w-full accent-gradient text-accent-foreground font-body font-semibold py-4 rounded-xl text-base shadow-glow transition-all duration-300"
          >
            Desbloquear Agora
          </motion.button>

          {/* Tempo de entrega */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
            <span className="font-body text-xs text-muted-foreground/70">
              Acesso imediato após confirmação
            </span>
          </div>

          {/* Garantia com contraste melhorado */}
          <div className="flex items-center justify-center gap-2 mt-4 bg-accent/5 rounded-lg py-2.5 px-4">
            <Shield className="w-4 h-4 text-accent/70" />
            <span className="font-body text-xs text-foreground/60 font-medium">
              Garantia de 7 dias — satisfação ou reembolso
            </span>
          </div>
        </div>

        <button
          onClick={onBack}
          className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors font-body mx-auto block"
        >
          ← Voltar ao resultado
        </button>
      </motion.div>
    </div>
  );
};

export default PurchaseScreen;
