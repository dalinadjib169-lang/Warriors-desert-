import React, { useState, useEffect } from 'react';
import { UserProfile, Question } from '../src/types';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ArrowRight } from 'lucide-react';

interface GameProps {
  profile: UserProfile;
  onBack: () => void;
  onResult: (points: number, coins: number) => void;
}

const SUBJECTS = ["الرياضيات", "اللغة العربية", "الفيزياء", "العلوم", "التاريخ والجغرافيا", "التربية الإسلامية"];
const TERMS = ["الفصل الأول", "الفصل الثاني", "الفصل الثالث"];

export default function Game({ profile, onBack, onResult }: GameProps) {
  const [step, setStep] = useState<'setup' | 'loading' | 'playing' | 'result'>('setup');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [term, setTerm] = useState(TERMS[0]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds timer

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'playing' && timeLeft > 0 && selectedAnswer === null) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && selectedAnswer === null) {
      // Time is up
      handleAnswer(-1); // -1 means no answer (timeout)
    }
    return () => clearTimeout(timer);
  }, [step, timeLeft, selectedAnswer]);

  const startGame = async () => {
    setStep('loading');
    setError('');
    setTimeLeft(30);
    try {
      const res = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: profile.stage,
          level: profile.level,
          subject: `${subject} - ${term}`,
          stream: profile.stream
        })
      });
      if (!res.ok) throw new Error("Failed to generate question");
      const data = await res.json();
      setQuestion(data);
      setStep('playing');
    } catch (err: any) {
      setError('حدث خطأ أثناء تحميل السؤال. حاول مرة أخرى.');
      setStep('setup');
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    
    setTimeout(() => {
      setStep('result');
    }, 1500);
  };

  const handleFinish = () => {
    if (!question) return;
    const isCorrect = selectedAnswer === question.correctIndex;
    const earnedPoints = isCorrect ? 100 : -20;
    const earnedCoins = isCorrect ? 50 : 0;
    onResult(earnedPoints, earnedCoins);
  };

  return (
    <div className="max-w-2xl mx-auto w-full text-white" dir="rtl">
      <button onClick={onBack} className="mb-4 text-white/70 hover:text-white flex items-center gap-2">
        <ArrowRight size={20}/> عودة
      </button>

      <AnimatePresence mode="wait">
        {step === 'setup' && (
          <motion.div key="setup" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20">
            <h2 className="text-3xl font-bold text-center mb-6">ساحة المعركة</h2>
            {error && <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 text-center">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">اختر المادة:</label>
                <select value={subject} onChange={e=>setSubject(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded p-3 text-lg">
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">اختر الفصل:</label>
                <select value={term} onChange={e=>setTerm(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded p-3 text-lg">
                  {TERMS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <button onClick={startGame} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl py-4 rounded-xl mt-6 transition-all shadow-lg shadow-blue-500/30">
                بدء التحدي
              </button>
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-yellow-400 mb-4" size={60} />
            <h2 className="text-2xl font-bold">جاري استدعاء الذكاء الاصطناعي...</h2>
            <p className="text-white/60 mt-2">يتم تحضير سؤال من المنهاج الجزائري</p>
          </motion.div>
        )}

        {step === 'playing' && question && (
          <motion.div key="playing" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 relative">
            <div className={`absolute top-4 left-4 font-bold text-xl ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>
              ⏱ {timeLeft}s
            </div>
            <h2 className="text-2xl font-bold mb-8 mt-4 leading-relaxed text-yellow-300">{question.question}</h2>
            <div className="space-y-3">
              {question.options.map((opt, i) => {
                let btnClass = "bg-white/5 border-white/20 hover:bg-white/10";
                if (selectedAnswer !== null) {
                  if (i === question.correctIndex) btnClass = "bg-green-500/40 border-green-400";
                  else if (i === selectedAnswer) btnClass = "bg-red-500/40 border-red-400";
                  else btnClass = "bg-black/50 border-white/10 opacity-50";
                }

                return (
                  <button 
                    key={i} 
                    onClick={() => handleAnswer(i)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-right p-4 rounded-xl border text-lg transition-all ${btnClass}`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {step === 'result' && question && (
          <motion.div key="result" initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 text-center">
            {selectedAnswer === question.correctIndex ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold text-green-400 mb-2">إجابة صحيحة!</h2>
                <p className="text-xl">+100 نقطة</p>
                <p className="text-xl text-yellow-400">+50 عملة</p>
              </div>
            ) : selectedAnswer === -1 ? (
              <div>
                <div className="text-6xl mb-4">⏳</div>
                <h2 className="text-3xl font-bold text-red-400 mb-2">انتهى الوقت!</h2>
                <p className="text-xl text-red-300">-20 نقطة</p>
              </div>
            ) : (
              <div>
                <div className="text-6xl mb-4">💔</div>
                <h2 className="text-3xl font-bold text-red-400 mb-2">إجابة خاطئة!</h2>
                <p className="text-xl text-red-300">-20 نقطة</p>
              </div>
            )}
            <button onClick={handleFinish} className="bg-white text-black font-bold px-8 py-3 rounded-xl mt-8 hover:bg-gray-200">
              العودة للوحة القيادة
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
