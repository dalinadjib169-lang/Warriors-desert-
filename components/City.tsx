import React from 'react';
import { UserProfile } from '../src/types';
import { CITY_STAGES } from '../src/constants';
import { motion } from 'motion/react';
import { ArrowRight, Coins, ShieldAlert } from 'lucide-react';

interface CityProps {
  profile: UserProfile;
  onBack: () => void;
  onUpgrade: (cost: number) => void;
}

const UPGRADE_COSTS = [
  0,      // Stage 1 (default)
  500,    // Stage 2
  1500,   // Stage 3
  3000,   // Stage 4
  6000,   // Stage 5
  12000   // Stage 6
];

export default function City({ profile, onBack, onUpgrade }: CityProps) {
  const currentStageIndex = profile.cityLevel - 1;
  const isMaxLevel = currentStageIndex >= CITY_STAGES.length - 1;
  const nextCost = isMaxLevel ? 0 : UPGRADE_COSTS[currentStageIndex + 1];
  const canAfford = profile.coins >= nextCost;

  return (
    <div className="max-w-3xl mx-auto w-full text-white" dir="rtl">
      <button onClick={onBack} className="mb-4 text-white/70 hover:text-white flex items-center gap-2">
        <ArrowRight size={20}/> عودة
      </button>

      <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20 text-center">
        <h2 className="text-3xl font-bold mb-2">تطوير المدينة</h2>
        <p className="text-white/60 mb-8">قم ببناء جيشك ودفاعاتك لتصبح أقوى المحاربين</p>

        <div className="flex justify-center mb-12">
          <motion.div 
            key={profile.cityLevel}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-48 h-48 bg-gradient-to-tr from-amber-700 to-yellow-500 rounded-full flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(245,158,11,0.5)] border-4 border-amber-300"
          >
            {CITY_STAGES[currentStageIndex]}
          </motion.div>
        </div>

        <div className="bg-black/40 rounded-2xl p-6 max-w-sm mx-auto">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-300">رصيدك الحالي:</span>
            <span className="font-bold text-yellow-400 flex items-center gap-1"><Coins size={18}/> {profile.coins}</span>
          </div>

          {!isMaxLevel ? (
            <div>
              <p className="mb-4">المستوى القادم: <span className="font-bold text-emerald-400">{CITY_STAGES[currentStageIndex + 1]}</span></p>
              <button 
                onClick={() => onUpgrade(nextCost)}
                disabled={!canAfford}
                className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all ${canAfford ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              >
                تطوير ({nextCost} عملة)
              </button>
              {!canAfford && <p className="text-red-400 text-sm mt-3 flex items-center justify-center gap-1"><ShieldAlert size={14}/> عملات غير كافية</p>}
            </div>
          ) : (
            <div className="text-green-400 font-bold text-xl py-4">
              وصلت للحد الأقصى للتطوير!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
