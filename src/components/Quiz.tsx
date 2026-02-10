import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link2, Heart, LineChart } from 'lucide-react';
import { questions, scaleLabels } from '@/data/questions';

interface QuizProps {
  onComplete: (answers: Record<number, number>) => void;
}

const Quiz = ({ onComplete }: QuizProps) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisTarget, setAnalysisTarget] = useState(0);
  const [analysisDisplay, setAnalysisDisplay] = useState(0);
  const [finalAnswers, setFinalAnswers] = useState<Record<number, number>>({});

  const question = questions[current];
  const progress = ((current) / questions.length) * 100;
  const hasAnswer = answers[question.id] !== undefined;

  const calculateTarget = (data: Record<number, number>) => {
    const total = Object.values(data).reduce((acc, value) => acc + value, 0);
    const max = questions.length * 5;
    return Math.round((total / max) * 100);
  };

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    // Auto-advance after brief delay
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(current + 1);
      } else {
        setFinalAnswers(newAnswers);
        setAnalysisTarget(calculateTarget(newAnswers));
        setIsAnalyzing(true);
      }
    }, 400);
  };

  useEffect(() => {
    if (!isAnalyzing) return;

    setAnalysisDisplay(0);
    const duration = 2800;
    const start = performance.now();
    let raf = 0;

    const animate = (now: number) => {
      const progressTime = Math.min((now - start) / duration, 1);
      const value = Math.round(analysisTarget * progressTime);
      setAnalysisDisplay(value);
      if (progressTime < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf);
  }, [isAnalyzing, analysisTarget]);

  useEffect(() => {
    if (!isAnalyzing) return;
    const timeout = setTimeout(() => {
      onComplete(finalAnswers);
    }, 5200);

    return () => clearTimeout(timeout);
  }, [isAnalyzing, finalAnswers, onComplete]);

  if (isAnalyzing) {
    return (
      <div className="min-h-screen analysis-gradient flex items-center justify-center px-4 py-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)]" />
        <div className="relative max-w-md w-full text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-4xl font-semibold"
          >
            Analisando suas respostas…
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-body text-sm md:text-base text-purple-100/90"
          >
            Estamos cruzando seus dados com milhares de perfis semelhantes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="relative mx-auto w-44 h-44 flex items-center justify-center"
          >
            <svg className="w-44 h-44" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="6" />
              <motion.circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={264}
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 - (264 * analysisTarget) / 100 }}
                transition={{ duration: 2.8, ease: 'easeOut' }}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div
              className={`absolute flex flex-col items-center justify-center w-28 h-28 rounded-full bg-white/10 border border-white/20 ${
                analysisDisplay >= analysisTarget ? 'analysis-glow' : ''
              }`}
            >
              <span className="font-display text-3xl font-bold">{analysisDisplay}%</span>
              <span className="text-[11px] text-purple-100/80">concluído</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex items-center justify-center gap-4 text-purple-100/80 text-xs font-body"
          >
            <span className="flex items-center gap-2"><Link2 className="w-4 h-4" />Conexão</span>
            <span className="flex items-center gap-2"><LineChart className="w-4 h-4" />Análise</span>
            <span className="flex items-center gap-2"><Heart className="w-4 h-4" />Relacionamento</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="glass rounded-2xl p-6 text-left text-sm leading-relaxed border border-white/20"
          >
            <p className="font-body text-purple-50/90 mb-3">
              + de 23.000 mulheres com resultados semelhantes ao seu conseguiram, através do Método Sinal:
            </p>
            <ul className="space-y-2 text-purple-50/85">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 mt-2" />
                Identificar perfis abusivos
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 mt-2" />
                Entender se o relacionamento ainda tinha solução
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 mt-2" />
                Aprender como agir com segurança e clareza
              </li>
            </ul>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.6 }}
            className="font-body text-sm text-purple-50/90"
          >
            Você não está sozinha. Seu resultado pode trazer respostas importantes.
          </motion.p>

          <div className="flex items-center justify-center gap-2">
            <span className="pulse-dot" />
            <span className="pulse-dot pulse-delay-1" />
            <span className="pulse-dot pulse-delay-2" />
          </div>

          <div className="h-1 bg-white/20 rounded-full overflow-hidden mx-auto w-full max-w-xs">
            <motion.div
              className="h-full bg-white/70"
              animate={{ width: `${analysisDisplay}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-body text-muted-foreground font-medium">
              Pergunta {current + 1} de {questions.length}
            </span>
            <span className="text-xs font-body text-muted-foreground font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full progress-gradient rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="card-gradient rounded-2xl shadow-card p-8 md:p-10 border border-border/70"
            >
              <div className="flex justify-center mb-6">
                <img
                  src="https://res.cloudinary.com/dsxqn2er7/image/upload/v1770687848/ChatGPT_Image_9_de_fev._de_2026_22_43_53_opkwkq.png"
                  alt="Método SINAL"
                  className="w-32 md:w-36 opacity-95"
                  loading="lazy"
                />
              </div>
              <p className="font-display text-xl md:text-2xl text-foreground leading-relaxed mb-10 text-center font-semibold">
                "{question.text}"
              </p>

              <div className="flex flex-col gap-3">
                {scaleLabels.map((label, i) => {
                  const value = i + 1;
                  const isSelected = answers[question.id] === value;
                  return (
                    <motion.button
                      key={value}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(value)}
                      className={`w-full text-left px-5 py-3.5 rounded-xl border font-body text-sm transition-all duration-200 shadow-sm ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-glow'
                          : 'border-border/80 bg-white text-foreground/80 hover:border-accent hover:bg-accent/10 hover:text-foreground'
                      }`}
                    >
                      <span className="inline-flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs transition-colors ${
                          isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                        }`}>
                          {isSelected && '✓'}
                        </span>
                        {label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {current > 0 && (
            <button
              onClick={() => setCurrent(current - 1)}
              className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors font-body mx-auto block font-medium"
            >
              ← Voltar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
