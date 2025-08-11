/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Alert, AlertDescription, Popover, PopoverContent, PopoverTrigger, Calendar, Input } from '@/components/ui';
import { RecordsSkeleton } from '@/components/RecordsSkeleton';
import { Eye, User, Search, Filter, Download, Database, FileText, BarChart3, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/components/ui';

interface ScreeningRecord {
  id: number;
  created_at: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  data: any;
}

export default function RecordsPage() {
  const [records, setRecords] = useState<ScreeningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ScreeningRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('screening')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setRecords(data || []);
    } catch (err) {
      setError('Failed to load screening records');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      record.id.toString().toLowerCase().includes(searchLower) ||
      (record.first_name && record.first_name.toLowerCase().includes(searchLower)) ||
      (record.last_name && record.last_name.toLowerCase().includes(searchLower)) ||
      (record.email && record.email.toLowerCase().includes(searchLower)) ||
      JSON.stringify(record.data).toLowerCase().includes(searchLower);
    
    const matchesDate = !dateRange?.from || !dateRange?.to || 
      (new Date(record.created_at) >= dateRange.from && new Date(record.created_at) <= dateRange.to);
    
    return matchesSearch && matchesDate;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecordSummary = (data: any) => {
    const dm = data?.DemographicAndMedicalInfo;
    if (!dm) return 'No data available';
    
    const employment = dm.IsEmployed === true ? 'Employed' : dm.IsEmployed === false ? 'Unemployed' : 'Not specified';
    const insurance = dm.HaveInsurance === true ? 'Has Insurance' : dm.HaveInsurance === false ? 'No Insurance' : 'Not specified';
    const ultrasounds = dm.HasOtherUltrasoundThisPregnancy?.length || 0;
    const gsps = data?.GsPs?.length || 0;
    
    return `${employment} • ${insurance} • ${ultrasounds} ultrasounds • ${gsps} Gs&Ps`;
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Created Date', 'First Name', 'Last Name', 'Email', 'Employment Status', 'Insurance Status', 'Ultrasounds', 'Gs&Ps Records'];
    const csvData = filteredRecords.map(record => [
      record.id,
      formatDate(record.created_at),
      record.first_name || 'N/A',
      record.last_name || 'N/A',
      record.email || 'N/A',
      record.data?.DemographicAndMedicalInfo?.IsEmployed === true ? 'Employed' : record.data?.DemographicAndMedicalInfo?.IsEmployed === false ? 'Unemployed' : 'Not specified',
      record.data?.DemographicAndMedicalInfo?.HaveInsurance === true ? 'Yes' : record.data?.DemographicAndMedicalInfo?.HaveInsurance === false ? 'No' : 'Not specified',
      record.data?.DemographicAndMedicalInfo?.HasOtherUltrasoundThisPregnancy?.length || 0,
      record.data?.GsPs?.length || 0
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `screening-records-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <RecordsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Screening Records</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all submitted screening questionnaires
            </p>

          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={fetchRecords} variant="outline" className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            <Button onClick={exportToCSV} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>



        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{records.length}</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {records.filter(r => r.data?.DemographicAndMedicalInfo?.IsEmployed === true).length}
              </div>
              <div className="text-sm text-muted-foreground">Employed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {records.filter(r => r.data?.DemographicAndMedicalInfo?.HaveInsurance === true).length}
              </div>
              <div className="text-sm text-muted-foreground">Has Insurance</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {records.filter(r => r.data?.GsPs?.length > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">With Gs&Ps</div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Search & Filter</span>
            </CardTitle>
                         <CardDescription>
               Find specific records by ID, name, email, content, or date range
             </CardDescription>
          </CardHeader>
                     <CardContent>
             <div className="grid md:grid-cols-2 gap-4">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input
                   type="text"
                   placeholder="Search by ID, name, email, or content..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                 />
               </div>
               <div className="relative">
                 <Popover>
                   <PopoverTrigger asChild>
                     <Button
                       variant="outline"
                       className={cn(
                         "w-full justify-start text-left font-normal pl-10",
                         !dateRange && "text-muted-foreground"
                       )}
                     >
                       <CalendarIcon className="absolute pl-5 h-4 w-4" />
                       {dateRange?.from ? (
                         dateRange.to ? (
                           <>
                             {format(dateRange.from, "LLL dd, y")} -{" "}
                             {format(dateRange.to, "LLL dd, y")}
                           </>
                         ) : (
                           format(dateRange.from, "LLL dd, y")
                         )
                       ) : (
                         <span>Pick a date range</span>
                       )}
                     </Button>
                   </PopoverTrigger>
                   <PopoverContent className="w-auto p-0" align="start">
                     <Calendar
                       mode="range"
                       defaultMonth={dateRange?.from}
                       selected={dateRange}
                       onSelect={setDateRange}
                       numberOfMonths={2}
                     />
                   </PopoverContent>
                 </Popover>
               </div>
             </div>
           </CardContent>
        </Card>

        {/* Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Records</CardTitle>
            <CardDescription>
              {filteredRecords.length} of {records.length} records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No screening records found</p>
                                 <p className="text-sm text-muted-foreground mt-2">
                   {searchTerm || dateRange ? 'Try adjusting your search criteria' : 'Records will appear here once forms are submitted'}
                 </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">ID</th>
                      <th className="text-left p-3 font-medium">Date</th>
                      <th className="text-left p-3 font-medium">First Name</th>
                      <th className="text-left p-3 font-medium">Last Name</th>
                      <th className="text-left p-3 font-medium">Email</th>
                      <th className="text-left p-3 font-medium">Employment</th>
                      <th className="text-left p-3 font-medium">Insurance</th>
                      <th className="text-left p-3 font-medium">Ultrasounds</th>
                      <th className="text-left p-3 font-medium">Gs&Ps</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-mono text-sm">#{record.id.toString().slice(-8)}</td>
                        <td className="p-3 text-sm">{formatDate(record.created_at)}</td>
                        <td className="p-3 text-sm">
                          {record.first_name || 'N/A'}
                        </td>
                        <td className="p-3 text-sm">
                          {record.last_name || 'N/A'}
                        </td>
                        <td className="p-3 text-sm">
                          {record.email || 'N/A'}
                        </td>
                        <td className="p-3">
                          <Badge variant={record.data?.DemographicAndMedicalInfo?.IsEmployed === true ? 'default' : 'secondary'}>
                            {record.data?.DemographicAndMedicalInfo?.IsEmployed === true ? 'Employed' : 'Unemployed'}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant={record.data?.DemographicAndMedicalInfo?.HaveInsurance === true ? 'default' : 'secondary'}>
                            {record.data?.DemographicAndMedicalInfo?.HaveInsurance === true ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm">
                          {record.data?.DemographicAndMedicalInfo?.HasOtherUltrasoundThisPregnancy?.length || 0}
                        </td>
                        <td className="p-3 text-sm">
                          {record.data?.GsPs?.length || 0}
                        </td>
                        <td className="p-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRecord(record)}
                            className="flex items-center space-x-2"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Record Details Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">
                  Record Details - #{selectedRecord.id.toString().slice(-8)}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecord(null)}
                >
                  Close
                </Button>
              </div>
              <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Created: {formatDate(selectedRecord.created_at)}
                  </p>
                </div>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(selectedRecord.data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
