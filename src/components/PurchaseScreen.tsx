import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CreditCard, X } from 'lucide-react';

interface PurchaseScreenProps {
  onPurchase: () => void;
  onClose: () => void;
}

const PurchaseScreen = ({ onPurchase, onClose }: PurchaseScreenProps) => {
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [error, setError] = useState('');

  const checkoutBaseUrl = (import.meta.env.VITE_ASAAS_CHECKOUT_URL ??
    import.meta.env.VITE_CHECKOUT_URL) as string | undefined;
  const checkoutUrl = checkoutBaseUrl
    ? `${checkoutBaseUrl}${checkoutBaseUrl.includes('?') ? '&' : '?'}email=${encodeURIComponent(email)}`
    : '';

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      const status = typeof data === 'string' ? data : data?.status;
      if (status === 'paid' || status === 'approved') {
        setShowSuccess(true);
        setIsProcessing(false);
        setTimeout(() => {
          onPurchase();
          onClose();
        }, 700);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose, onPurchase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isProcessing) return;

    if (!checkoutBaseUrl) {
      setError('Gateway Asaas não configurado. Defina VITE_ASAAS_CHECKOUT_URL.');
      return;
    }

    setError('');
    setIsProcessing(true);
    setIsCheckoutOpen(true);
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
            Menos que o valor de um lanche.
          </p>
          <p className="text-xs text-muted-foreground/80 font-body text-center mt-2">
            Método SINAL – Análise Completa de Relacionamento
          </p>
          <div className="mt-3 space-y-1 text-center">
            <p className="text-[11px] text-muted-foreground font-body">Acesso imediato e confidencial.</p>
            <p className="text-[11px] text-muted-foreground font-body">Resultado liberado em segundos.</p>
          </div>
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
            <label className="text-xs font-body text-muted-foreground">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full mt-1 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
              placeholder="seu@email.com"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={!email || isProcessing}
            className="w-full accent-gradient text-accent-foreground font-body font-semibold py-3.5 rounded-xl text-sm shadow-glow transition-all duration-300 disabled:opacity-60"
          >
            {isProcessing ? 'Aguardando pagamento...' : 'Desbloquear Diagnóstico Agora'}
          </motion.button>
        </form>

        <p className="text-xs text-muted-foreground mt-3 font-body text-center">
          Você está a um passo de visualizar sua análise completa.
        </p>

        {error && (
          <div className="mt-3 text-center text-[11px] text-muted-foreground font-body">
            {error}
          </div>
        )}

        {isCheckoutOpen && checkoutUrl && (
          <div className="mt-4 rounded-xl border border-border/60 overflow-hidden">
            <iframe
              title="Checkout seguro"
              src={checkoutUrl}
              className="w-full h-[420px] bg-background"
              allow="payment"
            />
          </div>
        )}

        <div className="mt-4 space-y-1 text-center">
          <p className="text-[11px] text-muted-foreground font-body">
            Acesso liberado automaticamente após confirmação
          </p>
          <p className="text-[11px] text-muted-foreground font-body">Ambiente seguro</p>
          <p className="text-[11px] text-muted-foreground font-body">Pagamento processado via Asaas</p>
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
          Acesso liberado automaticamente após confirmação
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseScreen;
