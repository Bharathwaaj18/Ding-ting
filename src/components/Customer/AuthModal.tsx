import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types';
import { playBoingSound, playCrunchSound, playVictorySound } from '../../utils/audioFX';
import confetti from 'canvas-confetti';
import { X, Phone, User, ShieldCheck, ArrowRight, RefreshCw, KeyRound, CheckCircle2, ChefHat, LayoutDashboard } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginUser, soundEnabled } = useStore();

  const [activeRoleTab, setActiveRoleTab] = useState<UserRole>('customer');
  const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');
  
  // Customer Login State
  const [name, setName] = useState<string>('Bharathwaaj');
  const [phone, setPhone] = useState<string>('9876543210');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(30);
  
  // Staff & Admin Pin State
  const [staffPasscode, setStaffPasscode] = useState<string>('1234');
  const [adminPasscode, setAdminPasscode] = useState<string>('admin');

  const [isSending, setIsSending] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'OTP' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    if (soundEnabled) playCrunchSound();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setStep('OTP');
      setTimer(30);
      setSuccessMessage('OTP sent successfully to +91 ' + cleanPhone);
      setTimeout(() => setSuccessMessage(''), 4000);
    }, 600);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.substring(value.length - 1);
    setOtpDigits(newDigits);
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleAutoFillDemoOtp = () => {
    if (soundEnabled) playBoingSound();
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setErrorMessage('Please enter all 6 digits of the OTP');
      return;
    }

    if (soundEnabled) playVictorySound();
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phone}`;
      loginUser(name, formattedPhone, 'customer');

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#B2FC00', '#FF2E4C', '#FFB703']
        });
      } catch {
        // safe fallback
      }
    }, 700);
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffPasscode) {
      setErrorMessage('Please enter Staff Passcode');
      return;
    }
    if (soundEnabled) playVictorySound();
    loginUser('Kitchen Staff', '+91 99000 11111', 'staff');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPasscode) {
      setErrorMessage('Please enter Admin Passcode');
      return;
    }
    if (soundEnabled) playVictorySound();
    loginUser('Store Admin', '+91 98000 22222', 'admin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#160A24] border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl text-white animate-fade-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            if (soundEnabled) playBoingSound();
            closeAuthModal();
          }}
          className="absolute top-4 right-4 z-10 bg-[#0E0617] hover:bg-[#271240] text-slate-400 hover:text-white p-2 rounded-full border border-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Brand Header */}
        <div className="text-center space-y-2 mb-5">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#FF2E4C] to-[#B2FC00] p-0.5 rounded-xl mx-auto shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-[#0E0617] rounded-[10px] flex items-center justify-center text-xl">
              🍗
            </div>
          </div>

          <h3 className="font-headline text-xl sm:text-2xl font-black text-white tracking-wide">
            DING TING AUTHENTICATION
          </h3>
          <p className="text-xs text-slate-400">
            Select your account type to access the system
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-3 bg-[#0E0617] p-1 rounded-xl border border-white/10 text-xs font-bold mb-5">
          <button
            onClick={() => {
              if (soundEnabled) playBoingSound();
              setActiveRoleTab('customer');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeRoleTab === 'customer' 
                ? 'bg-[#B2FC00] text-[#0E0617] shadow-sm font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Customer
          </button>

          <button
            onClick={() => {
              if (soundEnabled) playBoingSound();
              setActiveRoleTab('staff');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeRoleTab === 'staff' 
                ? 'bg-[#B2FC00] text-[#0E0617] shadow-sm font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" /> KDS Staff
          </button>

          <button
            onClick={() => {
              if (soundEnabled) playBoingSound();
              setActiveRoleTab('admin');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeRoleTab === 'admin' 
                ? 'bg-[#B2FC00] text-[#0E0617] shadow-sm font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Admin
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mb-4 bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs p-3 rounded-xl font-medium">
            ⚠️ {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs p-3 rounded-xl font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {successMessage}
          </div>
        )}

        {/* ROLE 1: CUSTOMER LOGIN (OTP) */}
        {activeRoleTab === 'customer' && (
          <>
            {step === 'DETAILS' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#B2FC00]" /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name (e.g. Bharathwaaj)"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-[#0E0617] border border-white/10 focus:border-[#B2FC00] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#B2FC00]" /> Mobile Number *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs sm:text-sm font-bold text-slate-400">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-[#0E0617] border border-white/10 focus:border-[#B2FC00] rounded-xl pl-12 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-[#B2FC00] hover:bg-[#C4FF1A] text-[#0E0617] py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98] disabled:opacity-50 uppercase tracking-wider"
                >
                  {isSending ? (
                    <span>Sending OTP...</span>
                  ) : (
                    <>
                      <span>SEND VERIFICATION OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 'OTP' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="bg-[#0E0617] border border-[#B2FC00]/40 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#B2FC00]" />
                    <span>Demo OTP: <strong className="text-[#B2FC00] font-mono text-sm tracking-wider">123456</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillDemoOtp}
                    className="bg-[#271240] hover:bg-[#341857] text-[#B2FC00] px-2.5 py-1 rounded-lg text-[11px] font-bold border border-[#B2FC00]/30 transition-all active:scale-95"
                  >
                    Auto-Fill ⚡
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 text-center">
                    Enter 6-Digit OTP
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={el => { otpInputsRef.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(idx, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(idx, e)}
                        className="w-10 h-11 bg-[#0E0617] border border-white/20 focus:border-[#B2FC00] rounded-xl text-center text-lg font-black text-[#B2FC00] focus:outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('DETAILS')}
                    className="hover:text-white underline font-medium"
                  >
                    Change Details
                  </button>

                  <button
                    type="button"
                    disabled={timer > 0}
                    onClick={() => setTimer(30)}
                    className={`flex items-center gap-1 font-bold ${
                      timer === 0 ? 'text-[#B2FC00] hover:underline cursor-pointer' : 'text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${timer === 0 ? 'animate-spin' : ''}`} />
                    {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-[#B2FC00] hover:bg-[#C4FF1A] text-[#0E0617] py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98] disabled:opacity-50 uppercase tracking-wider"
                >
                  {isVerifying ? (
                    <span>Verifying OTP...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>VERIFY OTP & LOGIN</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}

        {/* ROLE 2: KDS STAFF LOGIN */}
        {activeRoleTab === 'staff' && (
          <form onSubmit={handleStaffLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5 text-[#B2FC00]" /> Kitchen Display System Passcode
              </label>
              <input
                type="password"
                required
                placeholder="Enter Staff Passcode (Demo: 1234)"
                value={staffPasscode}
                onChange={e => setStaffPasscode(e.target.value)}
                className="w-full bg-[#0E0617] border border-white/10 focus:border-[#B2FC00] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
              />
              <span className="text-[11px] text-slate-400 block mt-1">Demo Staff Passcode: <code className="text-[#B2FC00]">1234</code></span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#B2FC00] hover:bg-[#C4FF1A] text-[#0E0617] py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98] uppercase tracking-wider"
            >
              <ChefHat className="w-4 h-4" />
              <span>ACCESS KITCHEN DISPLAY (KDS)</span>
            </button>
          </form>
        )}

        {/* ROLE 3: ADMIN CONSOLE LOGIN */}
        {activeRoleTab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <LayoutDashboard className="w-3.5 h-3.5 text-[#B2FC00]" /> Admin Console Security Code
              </label>
              <input
                type="password"
                required
                placeholder="Enter Admin Code (Demo: admin)"
                value={adminPasscode}
                onChange={e => setAdminPasscode(e.target.value)}
                className="w-full bg-[#0E0617] border border-white/10 focus:border-[#B2FC00] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
              />
              <span className="text-[11px] text-slate-400 block mt-1">Demo Admin Passcode: <code className="text-[#B2FC00]">admin</code></span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#B2FC00] hover:bg-[#C4FF1A] text-[#0E0617] py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98] uppercase tracking-wider"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>ACCESS STORE ADMIN CONSOLE</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
