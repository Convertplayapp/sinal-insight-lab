import { motion } from 'framer-motion';
import { Check, Shield, FileText, MessageCircle, CheckSquare } from 'lucide-react';

interface PurchaseScreenProps {
  onPurchase: () => void;
  onBack: () => void;
}

const benefits = [
  { icon: FileText, text: 'Diagnóstico completo dos 5 pilares' },
  { icon: MessageCircle, text: 'Frases prontas para conversas difíceis' },
  { icon: CheckSquare, text: 'Checklist de limites saudáveis' },
  { icon: Check, text: 'Plano de ação personalizado em etapas' },
];

const PurchaseScreen = ({ onPurchase, onBack }: PurchaseScreenProps) => {
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
          <div className="text-center mb-8">
            <div className="inline-flex items-baseline gap-1">
              <span className="text-sm text-muted-foreground font-body">R$</span>
              <span className="font-display text-5xl font-bold text-foreground">17</span>
            </div>
            <p className="text-xs text-muted-foreground font-body mt-1">Pagamento único</p>
          </div>

          {/* Benefits */}
          <div className="space-y-4 mb-8">
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

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPurchase}
            className="w-full accent-gradient text-accent-foreground font-body font-semibold py-4 rounded-xl text-base shadow-glow transition-all duration-300"
          >
            Desbloquear Agora
          </motion.button>

          {/* Guarantee */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="font-body text-xs text-muted-foreground">
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
