import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';

interface HeroSectionProps {
  onStart: () => void;
}

const logoUrl = '/logo-sinal.png';

const HeroSection = ({ onStart }: HeroSectionProps) => {
  return (
    <div className="hero-gradient min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient circles */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center max-w-2xl relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <img
            src={logoUrl}
            alt="Método SINAL"
            className="h-14 w-auto mx-auto mb-4"
          />
          <span className="text-primary-foreground/50 font-body text-sm tracking-[0.3em] uppercase">
            Método SINAL
          </span>
        </motion.div>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
          Seu relacionamento te{' '}
          <span className="italic text-accent">fortalece</span> ou te{' '}
          <span className="italic text-accent/70">desgasta</span>?
        </h1>

        <p className="font-body text-primary-foreground/70 text-lg md:text-xl mb-10 leading-relaxed max-w-lg mx-auto">
          Descubra em 2 minutos com o Método SINAL — uma análise baseada em 5 pilares essenciais do relacionamento.
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="accent-gradient text-accent-foreground font-body font-semibold px-10 py-4 rounded-full text-lg shadow-glow transition-all duration-300 hover:shadow-[0_0_40px_-5px_hsl(260_45%_65%_/_0.5)]"
        >
          Iniciar Análise Gratuita
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-6 mt-10"
        >
          <span className="trust-badge">
            <Lock className="w-3 h-3" />
            100% privado
          </span>
          <span className="trust-badge">
            <Shield className="w-3 h-3" />
            Resultado imediato
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
