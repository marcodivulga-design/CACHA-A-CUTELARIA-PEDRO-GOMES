import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function IntegrationsPage() {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});

  const availableIntegrations = trpc.integrations.getAvailableIntegrations.useQuery();
  const connectIntegration = trpc.integrations.connectIntegration.useMutation();
  const disconnectIntegration = trpc.integrations.disconnectIntegration.useMutation();

  const handleConnect = async (integrationId: string) => {
    try {
      await connectIntegration.mutateAsync({
        integrationId,
        credentials,
      });
      setSelectedIntegration(null);
      setCredentials({});
    } catch (error) {
      console.error('Error connecting integration:', error);
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    try {
      await disconnectIntegration.mutateAsync({ integrationId });
    } catch (error) {
      console.error('Error disconnecting integration:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Integrations</h1>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableIntegrations.data?.integrations.map((integration) => (
          <Card key={integration.id} className={integration.connected ? 'border-green-500' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{integration.name}</CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </div>
                {integration.connected && (
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Category: <span className="font-medium capitalize">{integration.category}</span>
                </p>
                <div className="flex gap-2">
                  {integration.connected ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedIntegration(integration.id)}
                      >
                        Configure
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDisconnect(integration.id)}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setSelectedIntegration(integration.id)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connection Modal */}
      {selectedIntegration && (
        <Card className="border-blue-500">
          <CardHeader>
            <CardTitle>Connect Integration</CardTitle>
            <CardDescription>
              Enter your credentials for {availableIntegrations.data?.integrations.find(i => i.id === selectedIntegration)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedIntegration === 'stripe' && (
                <>
                  <div>
                    <label className="text-sm font-medium">Public Key</label>
                    <Input
                      placeholder="pk_live_..."
                      value={credentials.publicKey || ''}
                      onChange={(e) => setCredentials({ ...credentials, publicKey: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Secret Key</label>
                    <Input
                      type="password"
                      placeholder="sk_live_..."
                      value={credentials.secretKey || ''}
                      onChange={(e) => setCredentials({ ...credentials, secretKey: e.target.value })}
                    />
                  </div>
                </>
              )}

              {selectedIntegration === 'pix' && (
                <>
                  <div>
                    <label className="text-sm font-medium">API Key</label>
                    <Input
                      placeholder="Your PIX API key"
                      value={credentials.apiKey || ''}
                      onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">PIX Key</label>
                    <Input
                      placeholder="Your PIX key (CPF, email, etc)"
                      value={credentials.pixKey || ''}
                      onChange={(e) => setCredentials({ ...credentials, pixKey: e.target.value })}
                    />
                  </div>
                </>
              )}

              {selectedIntegration === 'sendgrid' && (
                <div>
                  <label className="text-sm font-medium">API Key</label>
                  <Input
                    type="password"
                    placeholder="SG.xxx..."
                    value={credentials.apiKey || ''}
                    onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
                  />
                </div>
              )}

              {selectedIntegration === 'twilio' && (
                <>
                  <div>
                    <label className="text-sm font-medium">Account SID</label>
                    <Input
                      placeholder="Your Account SID"
                      value={credentials.accountSid || ''}
                      onChange={(e) => setCredentials({ ...credentials, accountSid: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Auth Token</label>
                    <Input
                      type="password"
                      placeholder="Your Auth Token"
                      value={credentials.authToken || ''}
                      onChange={(e) => setCredentials({ ...credentials, authToken: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <Button onClick={() => handleConnect(selectedIntegration)}>
                  Connect
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedIntegration(null);
                    setCredentials({});
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connected Integrations Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Integrations</CardTitle>
          <CardDescription>Overview of all active integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {availableIntegrations.data?.integrations
              .filter(i => i.connected)
              .map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{integration.name}</p>
                    <p className="text-sm text-gray-500">{integration.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-medium">Connected</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
