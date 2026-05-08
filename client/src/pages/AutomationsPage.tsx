import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function AutomationsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [automationName, setAutomationName] = useState('');

  const listAutomations = trpc.automations.listAutomations.useQuery();
  const createAutomation = trpc.automations.createAutomation.useMutation();
  const deleteAutomation = trpc.automations.deleteAutomation.useMutation();
  const enableAutomation = trpc.automations.enableAutomation.useMutation();
  const disableAutomation = trpc.automations.disableAutomation.useMutation();

  const handleCreateAutomation = async () => {
    try {
      await createAutomation.mutateAsync({
        name: automationName,
        trigger: { type: 'order_created' },
        actions: [{ type: 'send_email', config: { template: 'order_confirmation' } }],
      });
      setAutomationName('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating automation:', error);
    }
  };

  const handleToggleAutomation = async (automationId: string, enabled: boolean) => {
    try {
      if (enabled) {
        await disableAutomation.mutateAsync({ id: automationId });
      } else {
        await enableAutomation.mutateAsync({ id: automationId });
      }
    } catch (error) {
      console.error('Error toggling automation:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Automations</h1>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : 'Create Automation'}
        </Button>
      </div>

      {/* Create Automation Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Automation</CardTitle>
            <CardDescription>Set up a new automation workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Automation Name</label>
                <Input
                  placeholder="e.g., Welcome Email"
                  value={automationName}
                  onChange={(e) => setAutomationName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Trigger</label>
                <select className="w-full border rounded p-2">
                  <option value="order_created">Order Created</option>
                  <option value="payment_received">Payment Received</option>
                  <option value="customer_signup">Customer Signup</option>
                  <option value="product_purchased">Product Purchased</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Action</label>
                <select className="w-full border rounded p-2">
                  <option value="send_email">Send Email</option>
                  <option value="send_sms">Send SMS</option>
                  <option value="send_whatsapp">Send WhatsApp</option>
                  <option value="create_task">Create Task</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateAutomation}>Create</Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Automations List */}
      <div className="space-y-4">
        {listAutomations.data?.automations.map((automation) => (
          <Card key={automation.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{automation.name}</CardTitle>
                  <CardDescription>{automation.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    automation.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {automation.enabled ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Trigger</p>
                    <p className="font-medium capitalize">{automation.trigger.type.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Executions</p>
                    <p className="font-medium">{automation.executions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Run</p>
                    <p className="font-medium">{new Date(automation.lastRun).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleAutomation(automation.id, automation.enabled)}
                  >
                    {automation.enabled ? 'Disable' : 'Enable'}
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteAutomation.mutate({ id: automation.id })}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Statistics</CardTitle>
          <CardDescription>Overview of all automations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <p className="text-sm text-gray-600">Total Automations</p>
              <p className="text-2xl font-bold">15</p>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded">
              <p className="text-sm text-gray-600">Total Executions</p>
              <p className="text-2xl font-bold">125K</p>
            </div>
            <div className="p-4 bg-purple-50 rounded">
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold">98.8%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
