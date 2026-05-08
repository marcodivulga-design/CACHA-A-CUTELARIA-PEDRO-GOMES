import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function NotificationsPage() {
  const [showSendForm, setShowSendForm] = useState(false);
  const [notificationType, setNotificationType] = useState('email');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const getUserNotifications = trpc.notifications.getUserNotifications.useQuery({ limit: 50 });
  const getPreferences = trpc.notifications.getNotificationPreferences.useQuery();
  const updatePreferences = trpc.notifications.updateNotificationPreferences.useMutation();
  const sendEmail = trpc.notifications.sendEmailNotification.useMutation();
  const sendSMS = trpc.notifications.sendSMSNotification.useMutation();
  const sendWhatsApp = trpc.notifications.sendWhatsAppNotification.useMutation();

  const handleSendNotification = async () => {
    try {
      if (notificationType === 'email') {
        await sendEmail.mutateAsync({
          to: recipient,
          subject: 'Test Notification',
          template: 'test',
          data: { message },
        });
      } else if (notificationType === 'sms') {
        await sendSMS.mutateAsync({
          to: recipient,
          message,
        });
      } else if (notificationType === 'whatsapp') {
        await sendWhatsApp.mutateAsync({
          to: recipient,
          message,
        });
      }
      setRecipient('');
      setMessage('');
      setShowSendForm(false);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handlePreferenceChange = async (key: string, value: boolean) => {
    try {
      await updatePreferences.mutateAsync({
        [key]: value,
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button onClick={() => setShowSendForm(!showSendForm)}>
          {showSendForm ? 'Cancel' : 'Send Notification'}
        </Button>
      </div>

      {/* Send Notification Form */}
      {showSendForm && (
        <Card>
          <CardHeader>
            <CardTitle>Send Notification</CardTitle>
            <CardDescription>Send a notification to a user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Recipient</label>
                <Input
                  placeholder={notificationType === 'email' ? 'email@example.com' : '+5511999999999'}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <textarea
                  placeholder="Your message here"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border rounded p-2 h-32"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSendNotification}>Send</Button>
                <Button variant="outline" onClick={() => setShowSendForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
          <CardDescription>Recent notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getUserNotifications.data?.notifications.map((notification) => (
              <div key={notification.id} className="flex items-start justify-between p-3 border rounded">
                <div className="flex-1">
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.body}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  notification.read ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {notification.read ? 'Read' : 'Unread'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage your notification settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getPreferences.data && Object.entries(getPreferences.data.preferences).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                </div>
                <input
                  type="checkbox"
                  checked={value as boolean}
                  onChange={(e) => handlePreferenceChange(key, e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Email</CardTitle>
            <CardDescription>Transactional emails</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Send notifications via email</p>
            <Button variant="outline" className="w-full">Configure</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SMS</CardTitle>
            <CardDescription>Text messages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Send notifications via SMS</p>
            <Button variant="outline" className="w-full">Configure</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WhatsApp</CardTitle>
            <CardDescription>WhatsApp messages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Send notifications via WhatsApp</p>
            <Button variant="outline" className="w-full">Configure</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
