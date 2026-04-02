import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Edit2, Save, X, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';

const ProfileTab = () => {
  const { user, login } = useAuth();
  const { toast } = useToast();

  // Profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Change password
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast({ title: 'Name required', variant: 'destructive' });
      return;
    }
    setIsSavingProfile(true);
    try {
      await authService.updateProfile({ name });
      toast({ title: 'Profile Updated', description: 'Your name has been saved.' });
      setIsEditing(false);
    } catch {
      toast({ title: 'Update Failed', description: 'Could not update profile.', variant: 'destructive' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: 'Password too short', description: 'Minimum 6 characters.', variant: 'destructive' });
      return;
    }
    setIsSavingPassword(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast({ title: 'Password Changed', description: 'You can now log in with your new password.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    } catch (err: any) {
      toast({
        title: 'Failed',
        description: err.response?.data?.message || 'Current password is incorrect.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">

      {/* Profile Info Card */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-heading">Profile Information</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit2 className="w-4 h-4" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveProfile} disabled={isSavingProfile} className="flex items-center gap-2">
                <Save className="w-4 h-4" /> {isSavingProfile ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setName(user?.name || ''); setIsEditing(false); }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                : <User className="w-10 h-10 text-primary" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user?.name}</h3>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" />Full Name</Label>
              {isEditing
                ? <Input value={name} onChange={e => setName(e.target.value)} className="bg-background" />
                : <p className="text-foreground py-2 px-3 rounded-md bg-muted/50">{user?.name}</p>}
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" />Email Address</Label>
              <p className="text-foreground py-2 px-3 rounded-md bg-muted/50">{user?.email}</p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" />Member Since</Label>
              <p className="text-foreground py-2 px-3 rounded-md bg-muted/50">{formatDate(user?.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-heading flex items-center gap-2">
              <KeyRound className="w-5 h-5" /> Change Password
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </div>
          {!isChangingPassword && (
            <Button variant="outline" size="sm" onClick={() => setIsChangingPassword(true)}>
              <Lock className="w-4 h-4 mr-2" /> Change
            </Button>
          )}
        </CardHeader>
        {isChangingPassword && (
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="currentPassword" type={showCurrent ? 'text' : 'password'}
                    value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Your current password" className="pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowCurrent(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="newPassword" type={showNew ? 'text' : 'password'}
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters" className="pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowNew(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="confirmPassword" type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password" className="pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowConfirm(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isSavingPassword}>
                  {isSavingPassword ? 'Saving...' : 'Update Password'}
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setIsChangingPassword(false);
                  setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
                }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Coins in Wishlist', value: user?.wishlist?.length || 0 },
          { label: 'Year Joined', value: formatDate(user?.createdAt).split(' ')[2] || 'N/A' },
          { label: 'Account Status', value: 'Active' },
        ].map(stat => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default ProfileTab;
