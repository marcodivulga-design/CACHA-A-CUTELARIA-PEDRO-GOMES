import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function SecuritySettings() {
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const enableTwoFAMutation = trpc.auth.enableTwoFA.useMutation();
  const changePasswordMutation = trpc.auth.changePassword.useMutation();
  const getSessionInfoQuery = trpc.auth.getSessionInfo.useQuery();

  const handleEnableTwoFA = async () => {
    try {
      const result = await enableTwoFAMutation.mutateAsync();
      if (result.success) {
        setShowTwoFA(true);
      }
    } catch (error) {
      console.error('Error enabling 2FA:', error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const result = await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (result.success) {
        alert('Password changed successfully');
        setShowChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Security Settings</h1>

      {/* Session Information */}
      {getSessionInfoQuery.data && (
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
            <CardDescription>Current session details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">User ID</p>
                <p className="font-mono text-sm">{getSessionInfoQuery.data.session.userId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-mono text-sm">{getSessionInfoQuery.data.session.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-mono text-sm capitalize">{getSessionInfoQuery.data.session.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Login Time</p>
                <p className="font-mono text-sm">
                  {new Date(getSessionInfoQuery.data.session.loginTime).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expires At</p>
                <p className="font-mono text-sm">
                  {new Date(getSessionInfoQuery.data.session.expiresAt).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password regularly to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          {!showChangePassword ? (
            <Button onClick={() => setShowChangePassword(true)}>Change Password</Button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">New Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Update Password</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowChangePassword(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {!showTwoFA ? (
            <Button onClick={handleEnableTwoFA}>Enable 2FA</Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-900">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500">QR Code Placeholder</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Or enter this code manually:</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">JBSWY3DPEBLW64TMMQ======</p>
              </div>
              <div>
                <label className="text-sm font-medium">Verification Code</label>
                <Input type="text" placeholder="000000" maxLength={6} />
              </div>
              <Button className="w-full">Verify and Enable 2FA</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Security Checklist</CardTitle>
          <CardDescription>Follow these steps to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <label className="text-sm">Strong password (8+ characters, mix of letters, numbers, symbols)</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <label className="text-sm">Two-factor authentication enabled</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <label className="text-sm">Email verified</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <label className="text-sm">Review active sessions regularly</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <label className="text-sm">Keep software and browser up to date</label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Policy */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Data</CardTitle>
          <CardDescription>Manage your privacy settings and data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium text-sm">Analytics Tracking</p>
                <p className="text-xs text-gray-500">Allow us to track your usage for improvements</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium text-sm">Marketing Emails</p>
                <p className="text-xs text-gray-500">Receive updates about new products and offers</p>
              </div>
              <input type="checkbox" className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium text-sm">Data Export</p>
                <p className="text-xs text-gray-500">Download your personal data</p>
              </div>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
