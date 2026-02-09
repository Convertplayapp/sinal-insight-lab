import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CreditCard, X } from 'lucide-react';

interface PurchaseScreenProps {
  onPurchase: () => void;
  onClose: () => void;
}

const PurchaseScreen = ({ onPurchase, onClose }: PurchaseScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || isProcessing) return;

    setIsProcessing(true);
    setTimeout(() => {
      setShowSuccess(true);
      setIsProcessing(false);
      setTimeout(() => {
        onPurchase();
        onClose();
      }, 700);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md card-gradient rounded-2xl shadow-elevated p-6 md:p-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <span className="text-xs font-body tracking-[0.2em] uppercase text-accent mb-2 block">
            Checkout Seguro
          </span>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Desbloquear Diagnóstico Completo
          </h2>
          <p className="font-body text-sm text-muted-foreground">
            Acesso imediato ao resultado detalhado e plano de ação personalizado.
          </p>
        </div>

        <div className="rounded-xl border border-border/60 p-4 mb-5">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-sm text-muted-foreground font-body">R$</span>
            <span className="font-display text-4xl font-bold text-foreground">9,00</span>
          </div>
          <p className="text-xs text-muted-foreground font-body text-center mt-1">
            Pagamento único
          </p>
          <p className="text-xs text-muted-foreground/80 font-body text-center mt-2">
            Método SINAL – Análise Completa de Relacionamento
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground font-body mb-5">
          <div className="inline-flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5" />
            PIX
          </div>
          <div className="inline-flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5" />
            Cartão de crédito
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-body text-muted-foreground">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="text-xs font-body text-muted-foreground">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full mt-1 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
              placeholder="seu@email.com"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={!name || !email || isProcessing}
            className="w-full accent-gradient text-accent-foreground font-body font-semibold py-3.5 rounded-xl text-sm shadow-glow transition-all duration-300 disabled:opacity-60"
          >
            {isProcessing ? 'Processando...' : 'Confirmar pagamento'}
          </motion.button>
        </form>

        <div className="mt-4 space-y-1 text-center">
          <p className="text-[11px] text-muted-foreground font-body">
            Acesso liberado automaticamente após pagamento
          </p>
          <p className="text-[11px] text-muted-foreground font-body">Ambiente seguro</p>
          <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground font-body">
            <Shield className="w-3 h-3" /> Garantia de 7 dias
          </div>
        </div>

        {showSuccess && (
          <div className="mt-4 text-center text-xs text-accent font-body">
            Diagnóstico completo liberado com sucesso.
          </div>
        )}

        <div className="mt-5 text-center text-[11px] text-muted-foreground font-body">
          <Lock className="inline-block w-3 h-3 mr-1" />
          Pagamento processado via ASAAS ou Cartpanda
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseScreen;
