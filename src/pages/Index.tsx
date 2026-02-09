import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import Quiz from '@/components/Quiz';
import PartialResult from '@/components/PartialResult';
import PurchaseScreen from '@/components/PurchaseScreen';
import FullResult from '@/components/FullResult';
import { calculateResult, type Result } from '@/lib/scoring';

type Screen = 'hero' | 'quiz' | 'partial' | 'full';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('hero');
  const [result, setResult] = useState<Result | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const handleQuizComplete = (answers: Record<number, number>) => {
    const r = calculateResult(answers);
    setResult(r);
    setScreen('partial');
  };

  const handlePurchase = () => {
    setPurchaseSuccess(true);
    setScreen('full');
  };

  return (
    <>
      {screen === 'hero' && <HeroSection onStart={() => setScreen('quiz')} />}
      {screen === 'quiz' && <Quiz onComplete={handleQuizComplete} />}
      {screen === 'partial' && result && (
        <>
          <PartialResult result={result} onUnlock={() => setIsCheckoutOpen(true)} />
          {isCheckoutOpen && (
            <PurchaseScreen
              onPurchase={handlePurchase}
              onClose={() => setIsCheckoutOpen(false)}
            />
          )}
        </>
      )}
      {screen === 'full' && result && <FullResult result={result} showSuccess={purchaseSuccess} />}
    </>
  );
};

export default Index;
