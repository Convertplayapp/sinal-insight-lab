import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CreditCard, X, Clock, QrCode, Check } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

interface PurchaseScreenProps {
  onPurchase: () => void;
  onClose: () => void;
}

const PurchaseScreen = ({ onPurchase, onClose }: PurchaseScreenProps) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  const handleSuccess = () => {
    setIsCheckoutOpen(false);
    onPurchase();
    onClose();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <>
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

          <div className="text-center mb-7">
            <img
              src="https://res.cloudinary.com/dsxqn2er7/image/upload/v1770687848/ChatGPT_Image_9_de_fev._de_2026_22_43_53_opkwkq.png"
              alt="Método SINAL"
              className="w-36 mx-auto mb-4 opacity-90"
              loading="lazy"
            />
            <span className="text-xs font-body tracking-[0.2em] uppercase text-accent mb-2 block">
              Checkout Seguro
            </span>
            <h2 className="font-display text-2xl font-extrabold text-foreground mb-2">
              Desbloquear Diagnóstico Completo
            </h2>
            <p className="font-body text-sm text-muted-foreground">
              Acesso imediato ao resultado detalhado e plano de ação personalizado.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 p-5 mb-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-sm text-muted-foreground font-body">R$</span>
              <span className="font-display text-5xl font-bold text-foreground">9,00</span>
            </div>
            <p className="text-xs text-muted-foreground font-body text-center mt-1">
              Menos que o valor de um lanche.
            </p>
            <p className="text-xs text-muted-foreground/80 font-body text-center mt-2">
              Método SINAL – Análise Completa de Relacionamento
            </p>
          </div>

          <div className="rounded-xl bg-purple-50/80 border border-purple-100 p-4 mb-5 text-left">
            <p className="text-xs font-semibold text-foreground mb-3">
              Comprando agora você também recebe:
            </p>
            <ul className="space-y-2 text-sm font-semibold text-foreground/90">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-purple-600 mt-0.5" />
                Guia rápido de sinais de alerta em relacionamentos
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-purple-600 mt-0.5" />
                Checklist prático em PDF
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-purple-600 mt-0.5" />
                Acesso a futuras atualizações sem custo
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-purple-600 mt-0.5" />
                Mini plano de ação imediato
              </li>
            </ul>
          </div>

          <div className="text-center mb-5">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Desconto válido por tempo limitado
            </p>
            <p className="text-sm font-semibold text-foreground mt-1">Oferta expira em:</p>
            <div className="text-3xl font-bold text-purple-600 animate-pulse">
              {minutes}:{seconds}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground font-body mb-6">
            <div className="inline-flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5" />
              PIX
            </div>
            <div className="inline-flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" />
              Cartão de crédito
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-gradient-to-r from-purple-500 via-violet-600 to-fuchsia-500 hover:from-purple-600 hover:via-violet-700 hover:to-fuchsia-600 text-white font-body font-semibold py-3.5 rounded-xl text-sm shadow-[0_0_18px_rgba(168,85,247,0.45)] transition-all duration-300"
          >
            Quero Meu Diagnóstico Agora
          </motion.button>

          <p className="text-xs text-muted-foreground mt-3 font-body text-center">
            Libere agora seu resultado completo com um clique.
          </p>

          <div className="mt-4 space-y-2 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground font-body">
              <Clock className="w-3 h-3" /> Liberação imediata após pagamento
            </div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground font-body">
              <Shield className="w-3 h-3" /> Pagamento 100% seguro
            </div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground font-body">
              <Lock className="w-3 h-3" /> Garantia de 7 dias
            </div>
          </div>
        </motion.div>
      </div>

      <CheckoutModal
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default PurchaseScreen;
