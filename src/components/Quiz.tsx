import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { questions, scaleLabels } from '@/data/questions';

interface QuizProps {
  onComplete: (answers: Record<number, number>) => void;
}

const Quiz = ({ onComplete }: QuizProps) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const question = questions[current];
  const progress = ((current) / questions.length) * 100;
  const hasAnswer = answers[question.id] !== undefined;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    // Auto-advance after brief delay
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(current + 1);
      } else {
        onComplete(newAnswers);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-body text-muted-foreground">
              Pergunta {current + 1} de {questions.length}
            </span>
            <span className="text-xs font-body text-muted-foreground">
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
              className="card-gradient rounded-2xl shadow-card p-8 md:p-10"
            >
              <p className="font-display text-xl md:text-2xl text-foreground leading-relaxed mb-10 text-center">
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
                      className={`w-full text-left px-5 py-3.5 rounded-xl border font-body text-sm transition-all duration-200 ${
                        isSelected
                          ? 'border-accent bg-accent/10 text-foreground font-medium'
                          : 'border-border bg-card text-muted-foreground hover:border-accent/40 hover:bg-accent/5'
                      }`}
                    >
                      <span className="inline-flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs transition-colors ${
                          isSelected ? 'border-accent bg-accent text-accent-foreground' : 'border-muted-foreground/30'
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
              className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors font-body mx-auto block"
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
