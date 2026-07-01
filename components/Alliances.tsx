import React, { useState, useEffect } from 'react';
import { UserProfile } from '../src/types';
import { db } from '../src/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { ArrowRight, Trophy, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { AVATAR_STAGES } from '../src/constants';

interface AlliancesProps {
  profile: UserProfile;
  onBack: () => void;
}

export default function Alliances({ profile, onBack }: AlliancesProps) {
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const q = query(collection(db, "users"), orderBy("points", "desc"), limit(20));
        const snapshot = await getDocs(q);
        const users: UserProfile[] = [];
        snapshot.forEach(doc => {
          users.push(doc.data() as UserProfile);
        });
        setLeaderboard(users);
      } catch (err) {
        console.error("Failed to fetch leaders", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full text-white" dir="rtl">
      <button onClick={onBack} className="mb-4 text-white/70 hover:text-white flex items-center gap-2">
        <ArrowRight size={20}/> عودة
      </button>

      <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3"><Trophy className="text-yellow-400"/> تصنيف الأبطال والتحالفات</h2>
        
        <p className="text-white/70 mb-8">
          يتم ترتيب اللاعبين حسب الأولوية التالية: نفس القسم، نفس المؤسسة، نفس الولاية. (حاليا نعرض أقوى اللاعبين عامة)
        </p>

        {loading ? (
          <div className="text-center py-10">جاري تحميل التصنيف...</div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((user, idx) => {
              const isMe = user.uid === profile.uid;
              const avatar = AVATAR_STAGES[user.avatarLevel - 1] || AVATAR_STAGES[0];
              
              // Check relationship
              let relation = '';
              if (user.classRoom === profile.classRoom && user.institution === profile.institution) relation = 'نفس القسم';
              else if (user.institution === profile.institution) relation = 'نفس المؤسسة';
              else if (user.wilaya === profile.wilaya) relation = 'نفس الولاية';

              return (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={user.uid} 
                  className={`p-4 rounded-2xl flex items-center gap-4 ${isMe ? 'bg-yellow-500/20 border border-yellow-500/50' : 'bg-black/30 border border-white/5'}`}
                >
                  <div className="text-2xl w-8 font-bold text-gray-400 text-center">{idx + 1}</div>
                  <div className="text-3xl">{avatar}</div>
                  <div className="flex-1">
                    <div className="font-bold text-lg">{user.firstName} {user.lastName} {isMe && <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded ml-2">أنت</span>}</div>
                    <div className="text-sm text-gray-400 flex gap-2">
                      <span>{user.wilaya}</span> • <span>{user.institution}</span>
                      {relation && <span className="text-emerald-400 font-bold ml-2">({relation})</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-400">{user.points} نقطة</div>
                    <div className="text-xs text-gray-400 flex items-center justify-end gap-1"><Users size={12}/> مستوى {user.cityLevel}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
