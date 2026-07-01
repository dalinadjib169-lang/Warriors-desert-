import React, { useState } from 'react';
import { WILAYAS, STAGES, STREAMS } from '../src/constants';
import { Stage } from '../src/types';

interface RegisterFormProps {
  onRegister: (email: string, password: string, rememberMe: boolean, profileData: any) => void;
  onLogin: (email: string, password: string, rememberMe: boolean) => void;
}

export default function RegisterForm({ onRegister, onLogin }: RegisterFormProps) {
  const [isLoginMode, setIsLoginMode] = useState(false);
  
  // Auth fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Profile fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [wilaya, setWilaya] = useState(WILAYAS[0]);
  const [stage, setStage] = useState<Stage>('متوسط');
  const [level, setLevel] = useState(STAGES['متوسط'][0]);
  const [institution, setInstitution] = useState('');
  const [classRoom, setClassRoom] = useState('');
  const [stream, setStream] = useState(STREAMS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      onLogin(email, password, rememberMe);
    } else {
      const profileData: any = {
        firstName, lastName, wilaya, stage, level, institution, classRoom
      };
      if (stage === 'ثانوي') {
        profileData.stream = stream;
      }
      onRegister(email, password, rememberMe, profileData);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-2xl text-white w-full" dir="rtl">
      <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">محاربو الصحراء</h2>
      
      <div className="flex mb-6 border-b border-white/20">
        <button 
          className={`flex-1 pb-2 text-center font-bold ${!isLoginMode ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}
          onClick={() => setIsLoginMode(false)}
        >
          تسجيل جديد
        </button>
        <button 
          className={`flex-1 pb-2 text-center font-bold ${isLoginMode ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}
          onClick={() => setIsLoginMode(true)}
        >
          تسجيل الدخول
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/30 border border-white/20 rounded p-2" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">كلمة المرور</label>
          <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/30 border border-white/20 rounded p-2" dir="ltr" />
        </div>

        {!isLoginMode && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">الاسم</label>
                <input required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-black/30 border border-white/20 rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">اللقب</label>
                <input required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-black/30 border border-white/20 rounded p-2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الولاية</label>
              <select value={wilaya} onChange={e => setWilaya(e.target.value)} className="w-full bg-black/30 border border-white/20 rounded p-2">
                {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الطور</label>
              <select value={stage} onChange={e => {
                const newStage = e.target.value as Stage;
                setStage(newStage);
                setLevel(STAGES[newStage][0]);
              }} className="w-full bg-black/30 border border-white/20 rounded p-2">
                {Object.keys(STAGES).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">المستوى</label>
              <select value={level} onChange={e => setLevel(e.target.value)} className="w-full bg-black/30 border border-white/20 rounded p-2">
                {STAGES[stage].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {stage === 'ثانوي' && (
              <div>
                <label className="block text-sm font-medium mb-1">الشعبة</label>
                <select value={stream} onChange={e => setStream(e.target.value)} className="w-full bg-black/30 border border-white/20 rounded p-2">
                  {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">المؤسسة (المدرسة)</label>
              <input required value={institution} onChange={e => setInstitution(e.target.value)} placeholder={`مثال: ${stage === 'متوسط' ? 'متوسطة' : 'مدرسة'}...`} className="w-full bg-black/30 border border-white/20 rounded p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">القسم</label>
              <input required value={classRoom} onChange={e => setClassRoom(e.target.value)} placeholder="مثال: 1م2" className="w-full bg-black/30 border border-white/20 rounded p-2" />
            </div>
          </>
        )}

        <div className="flex items-center gap-2 mt-2">
          <input 
            type="checkbox" 
            id="rememberMe" 
            checked={rememberMe} 
            onChange={e => setRememberMe(e.target.checked)} 
            className="w-4 h-4 text-yellow-500 bg-black/30 border-white/20 rounded"
          />
          <label htmlFor="rememberMe" className="text-sm cursor-pointer text-gray-300">تذكرني</label>
        </div>

        <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded mt-4 transition-colors">
          {isLoginMode ? 'دخول' : 'إنشاء حساب'}
        </button>
      </form>
    </div>
  );
}
