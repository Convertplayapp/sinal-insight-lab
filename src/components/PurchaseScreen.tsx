import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CreditCard, X, Clock, QrCode } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

interface PurchaseScreenProps {
  onPurchase: () => void;
  onClose: () => void;
}

const PurchaseScreen = ({ onPurchase, onClose }: PurchaseScreenProps) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleSuccess = () => {
    setIsCheckoutOpen(false);
    onPurchase();
    onClose();
  };

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

          <div className="text-center mb-6">
            <img
              src="https://res.cloudinary.com/dsxqn2er7/image/upload/v1770687848/ChatGPT_Image_9_de_fev._de_2026_22_43_53_opkwkq.png"
              alt="Método SINAL"
              className="w-36 mx-auto mb-4 opacity-90"
              loading="lazy"
            />
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
              <QrCode className="w-3.5 h-3.5" />
              PIX
            </div>
            <div className="inline-flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" />
              Cartão de crédito
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full accent-gradient text-accent-foreground font-body font-semibold py-3.5 rounded-xl text-sm shadow-glow transition-all duration-300"
          >
            Desbloquear Diagnóstico Agora
          </motion.button>

          <p className="text-xs text-muted-foreground mt-3 font-body text-center">
            Você está a um passo de visualizar sua análise completa.
          </p>

          <div className="mt-4 space-y-1 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground font-body">
              <Clock className="w-3 h-3" /> Acesso liberado automaticamente após confirmação
            </div>
            <p className="text-[11px] text-muted-foreground font-body">Ambiente seguro</p>
            <p className="text-[11px] text-muted-foreground font-body">Pagamento processado via gateway seguro</p>
            <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground font-body">
              <Shield className="w-3 h-3" /> Garantia de 7 dias
            </div>
          </div>

          <div className="mt-5 text-center text-[11px] text-muted-foreground font-body">
            <Lock className="inline-block w-3 h-3 mr-1" />
            Acesso liberado automaticamente após confirmação
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
