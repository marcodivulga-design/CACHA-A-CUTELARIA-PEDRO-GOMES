import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });

  // Fetch all analytics data
  const dashboardMetrics = trpc.analytics.getDashboardMetrics.useQuery(dateRange);
  const salesAnalytics = trpc.analytics.getSalesAnalytics.useQuery({
    ...dateRange,
    groupBy: 'day',
  });
  const customerAnalytics = trpc.analytics.getCustomerAnalytics.useQuery(dateRange);
  const productAnalytics = trpc.analytics.getProductAnalytics.useQuery(dateRange);
  const trafficAnalytics = trpc.analytics.getTrafficAnalytics.useQuery(dateRange);
  const performanceMetrics = trpc.analytics.getPerformanceMetrics.useQuery();
  const conversionFunnel = trpc.analytics.getConversionFunnel.useQuery();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline">Last 7 days</Button>
          <Button variant="outline">Last 30 days</Button>
          <Button variant="outline">Last 90 days</Button>
        </div>
      </div>

      {/* Key Metrics */}
      {dashboardMetrics.data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardMetrics.data.metrics.totalVisitors.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">+12.5% from last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {dashboardMetrics.data.metrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-gray-500 mt-1">+8.2% from last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardMetrics.data.metrics.conversionRate}%</div>
              <p className="text-xs text-gray-500 mt-1">+2.1% from last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {dashboardMetrics.data.metrics.avgOrderValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-gray-500 mt-1">+5.3% from last period</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sales Chart */}
      {salesAnalytics.data && (
        <Card>
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
            <CardDescription>Daily revenue and order count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesAnalytics.data.salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue (R$)" />
                <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        {dashboardMetrics.data && (
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Visitor distribution by source</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardMetrics.data.metrics.trafficSources}
                    dataKey="percentage"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {dashboardMetrics.data.metrics.trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Device Distribution */}
        {dashboardMetrics.data && (
          <Card>
            <CardHeader>
              <CardTitle>Device Distribution</CardTitle>
              <CardDescription>Visitors by device type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardMetrics.data.metrics.devices}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="device" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#8884d8" name="Percentage (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top Products */}
      {dashboardMetrics.data && (
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardMetrics.data.metrics.topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.views} views • {product.purchases} purchases</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{((product.purchases / product.views) * 100).toFixed(1)}%</p>
                    <p className="text-sm text-gray-500">Conversion</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Analytics */}
      {customerAnalytics.data && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Analytics</CardTitle>
            <CardDescription>Customer metrics and segments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded">
                <p className="text-sm text-gray-600">New Customers</p>
                <p className="text-2xl font-bold">{customerAnalytics.data.customerData.newCustomers}</p>
              </div>
              <div className="p-4 bg-green-50 rounded">
                <p className="text-sm text-gray-600">Retention Rate</p>
                <p className="text-2xl font-bold">{customerAnalytics.data.customerData.retentionRate}%</p>
              </div>
              <div className="p-4 bg-purple-50 rounded">
                <p className="text-sm text-gray-600">Avg Lifetime Value</p>
                <p className="text-2xl font-bold">R$ {customerAnalytics.data.customerData.avgCustomerLifetimeValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      {performanceMetrics.data && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Core Web Vitals and performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded">
                <p className="text-sm text-gray-600">Page Load Time</p>
                <p className="text-2xl font-bold">{performanceMetrics.data.performance.avgPageLoadTime}s</p>
              </div>
              <div className="p-4 border rounded">
                <p className="text-sm text-gray-600">First Contentful Paint</p>
                <p className="text-2xl font-bold">{performanceMetrics.data.performance.avgFirstContentfulPaint}s</p>
              </div>
              <div className="p-4 border rounded">
                <p className="text-sm text-gray-600">Core Web Vitals Score</p>
                <p className="text-2xl font-bold">{performanceMetrics.data.performance.coreWebVitalsScore}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversion Funnel */}
      {conversionFunnel.data && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>User journey from view to purchase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversionFunnel.data.funnel.map((step, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium">{step.step}</p>
                    <p className="text-sm text-gray-600">{step.users} users ({step.percentage}%)</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${step.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
