import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { questions, scaleLabels } from '@/data/questions';

interface QuizProps {
  onComplete: (answers: Record<number, number>) => void;
}

const Quiz = ({ onComplete }: QuizProps) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [finalAnswers, setFinalAnswers] = useState<Record<number, number>>({});
  const [targetPercent, setTargetPercent] = useState(0);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const question = questions[current];
  const progress = ((current) / questions.length) * 100;
  const hasAnswer = answers[question.id] !== undefined;

  const calculatePercent = (values: Record<number, number>) => {
    const sum = Object.values(values).reduce((acc, value) => acc + value, 0);
    const max = questions.length * 5;
    return Math.round((sum / max) * 100);
  };

  useEffect(() => {
    if (!isAnalyzing) return;

    setDisplayPercent(0);
    setAnalysisComplete(false);
    const target = targetPercent;
    const duration = 2600;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPercent(Math.round(eased * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [isAnalyzing, targetPercent]);

  useEffect(() => {
    if (!isAnalyzing) return;
    const timer = setTimeout(() => {
      onComplete(finalAnswers);
    }, 5200);

    return () => clearTimeout(timer);
  }, [isAnalyzing, finalAnswers, onComplete]);

  useEffect(() => {
    if (!isAnalyzing) return;
    if (displayPercent >= targetPercent) {
      setAnalysisComplete(true);
    }
  }, [displayPercent, targetPercent, isAnalyzing]);

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    // Auto-advance after brief delay
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(current + 1);
      } else {
        const calculated = calculatePercent(newAnswers);
        setFinalAnswers(newAnswers);
        setTargetPercent(calculated);
        setIsAnalyzing(true);
      }
    }, 400);
  };

  if (isAnalyzing) {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeOffset = circumference - (displayPercent / 100) * circumference;

    return (
      <div className="min-h-screen analysis-gradient flex items-center justify-center px-4 py-12 text-white">
        <div className="w-full max-w-xl flex flex-col items-center text-center gap-6">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="font-display text-2xl md:text-3xl font-semibold"
          >
            Analisando suas respostas…
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="text-sm md:text-base text-white/80 max-w-md"
          >
            Estamos cruzando seus dados com milhares de perfis semelhantes.
          </motion.p>

          <div className="flex items-center gap-2">
            <span className="analysis-dot" />
            <span className="analysis-dot analysis-dot-delay" />
            <span className="analysis-dot analysis-dot-delay-2" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className={`relative flex items-center justify-center mt-2 ${analysisComplete ? 'analysis-glow' : ''}`}
          >
            <svg width="180" height="180" className="-rotate-90">
              <defs>
                <linearGradient id="analysisStroke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
                  <stop offset="60%" stopColor="rgba(210,165,255,0.95)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
                </linearGradient>
              </defs>
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="url(#analysisStroke)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-4xl font-semibold">{displayPercent}%</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            className="glass rounded-2xl border border-white/20 px-6 py-5 text-left w-full"
          >
            <p className="text-sm md:text-base text-white/90 font-medium mb-4">
              + de 23.000 mulheres com resultados semelhantes ao seu conseguiram, através do Método Sinal:
            </p>
            <ul className="space-y-3 text-sm md:text-base text-white/85">
              <li className="flex items-start gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 border border-white/20">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3l2.1 4.3L19 8l-3.5 3.4L16.3 16 12 13.8 7.7 16l.8-4.6L5 8l4.9-.7L12 3z" />
                  </svg>
                </span>
                Identificar perfis abusivos
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 border border-white/20">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 12a8 8 0 1 1-8-8" />
                    <path d="M20 4v8h-8" />
                  </svg>
                </span>
                Entender se o relacionamento ainda tinha solução
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 border border-white/20">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s7-4.5 7-11a7 7 0 0 0-14 0c0 6.5 7 11 7 11z" />
                    <circle cx="12" cy="11" r="3" />
                  </svg>
                </span>
                Aprender como agir com segurança e clareza
              </li>
            </ul>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
            className="text-sm md:text-base text-white/90"
          >
            Você não está sozinha. Seu resultado pode trazer respostas importantes.
          </motion.p>

          <div className="w-full max-w-sm h-1.5 bg-white/15 rounded-full overflow-hidden">
            <div className="analysis-progress-bar h-full w-1/2" />
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
