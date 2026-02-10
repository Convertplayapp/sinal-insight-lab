import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, QrCode, Shield, Clock, Copy, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentMethod = 'pix' | 'credit-card';
type Step = 'info' | 'payment' | 'processing' | 'success';

const PRODUCT_VALUE = 9.0;
const PRODUCT_DESCRIPTION = 'Método SINAL – Análise Completa de Relacionamento';

const isValidCpf = (value: string) => {
  const cpfClean = value.replace(/\D/g, '');
  if (cpfClean.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpfClean)) return false;
  const calcCheck = (factor: number) => {
    let total = 0;
    for (let i = 0; i < factor - 1; i++) {
      total += Number(cpfClean.charAt(i)) * (factor - i);
    }
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  const digit1 = calcCheck(10);
  const digit2 = calcCheck(11);
  return digit1 === Number(cpfClean.charAt(9)) && digit2 === Number(cpfClean.charAt(10));
};

const CheckoutModal = ({ open, onClose, onSuccess }: CheckoutModalProps) => {
  const [step, setStep] = useState<Step>('info');
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // PIX state
  const [pixQrCode, setPixQrCode] = useState('');
  const [pixPayload, setPixPayload] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [copied, setCopied] = useState(false);

  // Credit card state
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cpf, setCpf] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  const cpfIsValid = isValidCpf(cpf);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setStep('info');
      setError('');
      setLoading(false);
      setPixQrCode('');
      setPixPayload('');
      setPaymentId('');
    }
  }, [open]);

  // Poll payment status for PIX
  useEffect(() => {
    if (step !== 'payment' || method !== 'pix' || !paymentId) return;

    const interval = setInterval(async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke('asaas-payment', {
          body: { action: 'check-status', paymentId },
        });
        if (fnError) return;
        if (data?.status === 'RECEIVED' || data?.status === 'CONFIRMED') {
          clearInterval(interval);
          setStep('success');
          setTimeout(() => onSuccess(), 1500);
        }
      } catch {
        // silently retry
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [step, method, paymentId, onSuccess]);

  const callAsaas = useCallback(async (body: Record<string, unknown>) => {
    const { data, error: fnError } = await supabase.functions.invoke('asaas-payment', { body });
    if (fnError) throw new Error(fnError.message || 'Erro ao processar pagamento');
    if (data?.error) throw new Error(data.error);
    return data;
  }, []);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !cpf.trim()) return;
    if (!cpfIsValid) {
      setError('CPF inválido. Use um número de CPF válido.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      if (method === 'pix') {
        const pixData = await callAsaas({
          action: 'create-pix',
          value: PRODUCT_VALUE,
          description: PRODUCT_DESCRIPTION,
          customerData: {
            name: name.trim(),
            email: email.trim(),
            cpfCnpj: cpf.replace(/\D/g, ''),
          },
        });
        setPixQrCode(pixData.qrCodeImage);
        setPixPayload(pixData.qrCodePayload);
        setPaymentId(pixData.paymentId);
        setStep('payment');
      } else {
        setStep('payment');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleCreditCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpfIsValid) {
      setError('CPF inválido. Use um número de CPF válido.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const [expiryMonth, expiryYear] = cardExpiry.split('/');

      const result = await callAsaas({
        action: 'create-credit-card',
        value: PRODUCT_VALUE,
        description: PRODUCT_DESCRIPTION,
        customerData: {
          name: name.trim(),
          email: email.trim(),
          cpfCnpj: cpf.replace(/\D/g, ''),
          phone: phone.replace(/\D/g, ''),
          postalCode: postalCode.replace(/\D/g, ''),
        },
        creditCard: {
          holderName: cardHolder,
          number: cardNumber.replace(/\s/g, ''),
          expiryMonth,
          expiryYear: expiryYear?.length === 2 ? `20${expiryYear}` : expiryYear,
          ccv: cardCvv,
        },
        creditCardHolderInfo: {
          name: cardHolder,
          email: email.trim(),
          cpfCnpj: cpf.replace(/\D/g, ''),
          postalCode: postalCode.replace(/\D/g, ''),
          addressNumber: '0',
          phone: phone.replace(/\D/g, ''),
        },
      });

      if (result.status === 'CONFIRMED' || result.status === 'RECEIVED') {
        setStep('success');
        setTimeout(() => onSuccess(), 1500);
      } else {
        setError('Pagamento não confirmado. Verifique os dados do cartão.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar cartão');
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md card-gradient rounded-2xl shadow-elevated p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <span className="text-xs font-body tracking-[0.2em] uppercase text-accent mb-1 block">
            Checkout Seguro
          </span>
          <h2 className="font-display text-xl font-bold text-foreground mb-1">
            Desbloquear Diagnóstico Completo
          </h2>
          <p className="text-xs text-muted-foreground font-body">
            Acesso imediato ao resultado detalhado e plano de ação personalizado.
          </p>
        </div>

        {/* Price */}
        <div className="text-center mb-5">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-sm text-muted-foreground font-body">R$</span>
            <span className="font-display text-3xl font-bold text-foreground">9,00</span>
          </div>
          <p className="text-[11px] text-muted-foreground font-body mt-0.5">pagamento único</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'info' && (
            <motion.form
              key="info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleInfoSubmit}
              className="space-y-3"
            >
              {/* Payment method tabs */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setMethod('pix')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-body font-medium transition-all border ${
                    method === 'pix'
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-muted-foreground hover:border-accent/40'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" /> PIX
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('credit-card')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-body font-medium transition-all border ${
                    method === 'credit-card'
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-muted-foreground hover:border-accent/40'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" /> Cartão
                </button>
              </div>

              <div>
                <label className="text-xs font-body text-muted-foreground">Nome</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full mt-1 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                  placeholder="Seu nome completo"
                />
              </div>

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

              <div>
                <label className="text-xs font-body text-muted-foreground">CPF</label>
                <input
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                  className="w-full mt-1 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                  placeholder="000.000.000-00"
                />
              </div>

              {error && (
                <p className="text-xs text-destructive font-body text-center">{error}</p>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={!name || !email || !cpf || !cpfIsValid || loading}
                className="w-full accent-gradient text-accent-foreground font-body font-semibold py-3 rounded-xl text-sm shadow-glow transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processando...
                  </>
                ) : method === 'pix' ? (
                  'Gerar QR Code PIX'
                ) : (
                  'Continuar para Pagamento'
                )}
              </motion.button>
            </motion.form>
          )}

          {step === 'payment' && method === 'pix' && (
            <motion.div
              key="pix"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <p className="text-xs text-muted-foreground font-body text-center">
                Escaneie o QR Code ou copie o código PIX para pagar.
              </p>

              {pixQrCode && (
                <div className="flex justify-center">
                  <img
                    src={`data:image/png;base64,${pixQrCode}`}
                    alt="QR Code PIX"
                    className="w-48 h-48 rounded-lg border border-border"
                  />
                </div>
              )}

              {pixPayload && (
                <button
                  onClick={copyPixCode}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-body text-foreground hover:bg-accent/5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-accent" /> Código copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copiar código PIX
                    </>
                  )}
                </button>
              )}

              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-body">
                <Loader2 className="w-3 h-3 animate-spin" />
                Aguardando confirmação do pagamento...
              </div>
            </motion.div>
          )}

          {step === 'payment' && method === 'credit-card' && (
            <motion.form
              key="cc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleCreditCardSubmit}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-body text-muted-foreground">Nome no cartão</label>
                <input
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  required
                  className="w-full mt-1 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                  placeholder="Nome impresso no cartão"
                />
              </div>

              <div>
                <label className="text-xs font-body text-muted-foreground">Número do cartão</label>
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  required
                  maxLength={19}
                  className="w-full mt-1 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                  placeholder="0000 0000 0000 0000"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-body text-muted-foreground">Validade</label>
                  <input
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    required
                    maxLength={5}
                    className="w-full mt-1 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                    placeholder="MM/AA"
                  />
                </div>
                <div>
                  <label className="text-xs font-body text-muted-foreground">CVV</label>
                  <input
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    required
                    maxLength={4}
                    className="w-full mt-1 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                    placeholder="000"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-body text-muted-foreground">CPF</label>
                <input
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                  className="w-full mt-1 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                  placeholder="000.000.000-00"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-body text-muted-foreground">CEP</label>
                  <input
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    className="w-full mt-1 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                    placeholder="00000-000"
                  />
                </div>
                <div>
                  <label className="text-xs font-body text-muted-foreground">Telefone</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full mt-1 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-destructive font-body text-center">{error}</p>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full accent-gradient text-accent-foreground font-body font-semibold py-3 rounded-xl text-sm shadow-glow transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processando pagamento...
                  </>
                ) : (
                  `Pagar R$ 9,00`
                )}
              </motion.button>

              <button
                type="button"
                onClick={() => { setStep('info'); setError(''); }}
                className="w-full text-xs text-muted-foreground font-body hover:text-foreground transition-colors py-1"
              >
                ← Voltar
              </button>
            </motion.form>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <Check className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-1">
                Pagamento Confirmado
              </h3>
              <p className="text-xs text-muted-foreground font-body">
                Diagnóstico completo liberado com sucesso.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust signals */}
        {step !== 'success' && (
          <div className="mt-4 space-y-1 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground font-body">
              <Clock className="w-3 h-3" /> Acesso liberado automaticamente após pagamento
            </div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground font-body">
              <Shield className="w-3 h-3" /> Ambiente seguro · Garantia de 7 dias
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CheckoutModal;
