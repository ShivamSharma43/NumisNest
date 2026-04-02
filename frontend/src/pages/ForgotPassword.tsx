import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';
import { Mail, KeyRound, Lock, ArrowLeft, CheckCircle } from 'lucide-react';

type Step = 'email' | 'otp' | 'done';

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast({ title: 'OTP Sent', description: 'Check your email for the 6-digit OTP.' });
      setStep('otp');
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to send OTP.', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: 'Mismatch', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: 'Too short', description: 'Password must be at least 6 characters.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      setStep('done');
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Invalid or expired OTP.', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-parchment-dark">
        <div className="w-full max-w-md bg-card rounded-lg shadow-medium border border-border p-8">
          <Link to="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>

          {step === 'email' && (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <h1 className="font-serif text-2xl font-bold">Forgot Password?</h1>
                <p className="text-muted-foreground mt-2 text-sm">Enter your email and we'll send you a 6-digit OTP.</p>
              </div>
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" className="mt-2" required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-7 h-7 text-primary" />
                </div>
                <h1 className="font-serif text-2xl font-bold">Enter OTP</h1>
                <p className="text-muted-foreground mt-2 text-sm">We sent a 6-digit code to <strong>{email}</strong>. It expires in 10 minutes.</p>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="otp">6-Digit OTP</Label>
                  <Input id="otp" type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)}
                    placeholder="123456" className="mt-2 text-center text-2xl tracking-widest" required />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters" className="pl-10" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password" className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
                <Button type="button" variant="ghost" className="w-full text-sm" onClick={() => { setStep('email'); setOtp(''); }}>
                  Didn't receive it? Resend OTP
                </Button>
              </form>
            </>
          )}

          {step === 'done' && (
            <div className="text-center space-y-4 py-4">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
              <h2 className="font-serif text-2xl font-bold">Password Reset!</h2>
              <p className="text-muted-foreground">Your password has been updated successfully.</p>
              <Button className="w-full" onClick={() => navigate('/login')}>Go to Login</Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
