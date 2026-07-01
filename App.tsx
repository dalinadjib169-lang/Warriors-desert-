import React, { useState, useEffect } from 'react';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import Game from './components/Game';
import City from './components/City';
import Alliances from './components/Alliances';
import { UserProfile } from './src/types';
import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence,
  onAuthStateChanged 
} from './src/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { AVATAR_STAGES } from './src/constants';

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'game' | 'city' | 'alliances'>('dashboard');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          }
        } catch (err: any) {
          console.error("Profile fetch error:", err);
          if (err.message?.includes('offline')) {
            setAuthError("أنت غير متصل بالإنترنت.");
          } else {
            setAuthError("حدث خطأ في استرجاع بيانات الحساب.");
          }
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRegister = async (email: string, password: string, rememberMe: boolean, data: any) => {
    setLoading(true);
    setAuthError(null);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const newProfile: UserProfile = {
        uid,
        ...data,
        avatarLevel: 1,
        coins: 100, // starting coins
        points: 0,
        cityLevel: 1
      };
      await setDoc(doc(db, 'users', uid), newProfile);
      setProfile(newProfile);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setAuthError("البريد الإلكتروني مستخدم بالفعل.");
      } else if (err.code === 'auth/weak-password') {
        setAuthError("كلمة المرور ضعيفة جداً.");
      } else {
        setAuthError("حدث خطأ أثناء التسجيل: " + err.message);
      }
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    setLoading(true);
    setAuthError(null);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle the rest
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setAuthError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      } else {
        setAuthError("حدث خطأ أثناء تسجيل الدخول: " + err.message);
      }
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setProfile(null);
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const newProfile = { ...profile, ...updates };
    
    // Auto-evolve avatar based on points
    if (newProfile.points >= 500) newProfile.avatarLevel = 2;
    if (newProfile.points >= 1500) newProfile.avatarLevel = 3;
    if (newProfile.points >= 3000) newProfile.avatarLevel = 4;
    if (newProfile.points >= 5000) newProfile.avatarLevel = Math.min(5, AVATAR_STAGES.length);

    setProfile(newProfile);
    try {
      await updateDoc(doc(db, 'users', profile.uid), newProfile);
    } catch (err) {
      console.error("Failed to sync progress:", err);
    }
  };

  const handleGameResult = (pointsEarned: number, coinsEarned: number) => {
    if (!profile) return;
    updateProfile({
      points: Math.max(0, profile.points + pointsEarned),
      coins: profile.coins + coinsEarned
    });
    setCurrentView('dashboard');
  };

  const handleCityUpgrade = (cost: number) => {
    if (!profile || profile.coins < cost) return;
    updateProfile({
      coins: profile.coins - cost,
      cityLevel: profile.cityLevel + 1
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black p-4 md:p-8 font-sans">
      {authError && (
        <div className="max-w-md mx-auto mb-4 bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg text-center" dir="rtl">
          {authError}
        </div>
      )}
      {!profile ? (
        <RegisterForm onRegister={handleRegister} onLogin={handleLogin} />
      ) : (
        <>
          {currentView === 'dashboard' && (
            <div>
              <div className="max-w-4xl mx-auto w-full flex justify-end mb-4">
                <button onClick={handleLogout} className="text-white/60 hover:text-white text-sm">تسجيل الخروج</button>
              </div>
              <Dashboard profile={profile} onPlay={() => setCurrentView('game')} onCity={() => setCurrentView('city')} onAlliances={() => setCurrentView('alliances')} />
            </div>
          )}
          {currentView === 'game' && <Game profile={profile} onBack={() => setCurrentView('dashboard')} onResult={handleGameResult} />}
          {currentView === 'city' && <City profile={profile} onBack={() => setCurrentView('dashboard')} onUpgrade={handleCityUpgrade} />}
          {currentView === 'alliances' && <Alliances profile={profile} onBack={() => setCurrentView('dashboard')} />}
        </>
      )}
    </div>
  );
}

export default App;
