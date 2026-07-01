import React from 'react';
import { UserProfile } from '../src/types';
import { AVATAR_STAGES, CITY_STAGES } from '../src/constants';
import { Trophy, Coins, Shield, MapPin, School, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  profile: UserProfile;
  onPlay: () => void;
  onCity: () => void;
  onAlliances: () => void;
}

export default function Dashboard({ profile, onPlay, onCity, onAlliances }: DashboardProps) {
  const avatar = AVATAR_STAGES[profile.avatarLevel - 1] || AVATAR_STAGES[0];
  const cityStage = CITY_STAGES[profile.cityLevel - 1] || CITY_STAGES[0];

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6" dir="rtl">
      {/* Header Profile Card */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white flex flex-col md:flex-row items-center gap-6 shadow-2xl border border-white/10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #fbbf24 0%, transparent 70%)' }}></div>
        <div className="z-10 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-5xl shadow-[0_0_20px_rgba(251,191,36,0.4)] border-4 border-yellow-200/50">
          {avatar}
        </div>
        <div className="z-10 flex-1 text-center md:text-right">
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-l from-yellow-200 to-yellow-500">{profile.firstName} {profile.lastName}</h1>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
            <div className="flex items-center justify-center md:justify-start gap-1"><MapPin size={16}/> {profile.wilaya}</div>
            <div className="flex items-center justify-center md:justify-start gap-1"><School size={16}/> {profile.institution}</div>
            <div className="flex items-center justify-center md:justify-start gap-1"><Users size={16}/> القسم {profile.classRoom}</div>
            <div className="flex items-center justify-center md:justify-start gap-1"><Shield size={16}/> المستوى: {profile.stage} - {profile.level}</div>
          </div>
        </div>
        
        <div className="flex flex-row md:flex-col gap-4 text-center">
          <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/30">
            <div className="text-yellow-400 font-bold text-xl flex items-center gap-2 justify-center"><Coins size={20}/> {profile.coins}</div>
            <div className="text-xs text-gray-400">عملات</div>
          </div>
          <div className="bg-black/30 p-3 rounded-lg border border-blue-500/30">
            <div className="text-blue-400 font-bold text-xl flex items-center gap-2 justify-center"><Trophy size={20}/> {profile.points}</div>
            <div className="text-xs text-gray-400">نقاط</div>
          </div>
        </div>
      </motion.div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onPlay}
          className="bg-gradient-to-b from-blue-500 to-blue-700 p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-4 text-white border border-blue-400/50"
        >
          <div className="p-4 bg-white/20 rounded-full"><Trophy size={40} /></div>
          <h3 className="text-2xl font-bold">تحدي الذكاء</h3>
          <p className="text-sm text-blue-200">أجب عن الأسئلة واكسب النقاط</p>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onCity}
          className="bg-gradient-to-b from-amber-600 to-amber-800 p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-4 text-white border border-amber-500/50"
        >
          <div className="p-4 bg-white/20 rounded-full"><Shield size={40} /></div>
          <h3 className="text-2xl font-bold">مدينتي</h3>
          <p className="text-sm text-amber-200">الحالة: {cityStage}</p>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onAlliances}
          className="bg-gradient-to-b from-emerald-600 to-emerald-800 p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-4 text-white border border-emerald-500/50"
        >
          <div className="p-4 bg-white/20 rounded-full"><Users size={40} /></div>
          <h3 className="text-2xl font-bold">التحالفات والخريطة</h3>
          <p className="text-sm text-emerald-200">تحدى زملاءك ومدارس أخرى</p>
        </motion.button>
      </div>
    </div>
  );
}
