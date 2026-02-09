import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import Quiz from '@/components/Quiz';
import PartialResult from '@/components/PartialResult';
import PurchaseScreen from '@/components/PurchaseScreen';
import FullResult from '@/components/FullResult';
import { calculateResult, type Result } from '@/lib/scoring';

type Screen = 'hero' | 'quiz' | 'partial' | 'purchase' | 'full';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('hero');
  const [result, setResult] = useState<Result | null>(null);

  const handleQuizComplete = (answers: Record<number, number>) => {
    const r = calculateResult(answers);
    setResult(r);
    setScreen('partial');
  };

  return (
    <>
      {screen === 'hero' && <HeroSection onStart={() => setScreen('quiz')} />}
      {screen === 'quiz' && <Quiz onComplete={handleQuizComplete} />}
      {screen === 'partial' && result && (
        <PartialResult result={result} onUnlock={() => setScreen('purchase')} />
      )}
      {screen === 'purchase' && (
        <PurchaseScreen
          result={result!}
          onPurchase={() => setScreen('full')}
          onBack={() => setScreen('partial')}
        />
      )}
      {screen === 'full' && result && <FullResult result={result} />}
    </>
  );
};

export default Index;
