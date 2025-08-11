/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, Alert, AlertDescription } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import ScreeningForm from '@/components/ScreeningForm';

interface UserInfo {
  first_name: string;
  last_name: string;
  email: string;
}

export default function IntakePage() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    first_name: '',
    last_name: '',
    email: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateUserInfo = (): boolean => {
    const newErrors: string[] = [];
    
    if (!userInfo.first_name.trim()) {
      newErrors.push('First name is required');
    }
    
    if (!userInfo.last_name.trim()) {
      newErrors.push('Last name is required');
    }
    
    if (!userInfo.email.trim()) {
      newErrors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      newErrors.push('Please enter a valid email address');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleUserInfoSubmit = () => {
    if (validateUserInfo()) {
      setShowForm(true);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const { data, error } = await supabase
        .from('screening')
        .insert([
          {
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            email: userInfo.email,
            data: formData
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Error submitting form: ${error.message}`);
      } else {
        console.log('Form submitted successfully:', data);
        // You can redirect to a success page or show success message
        alert('Form submitted successfully! Your screening data has been saved.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      throw err;
    }
  };

  if (showForm) {
    return <ScreeningForm onSubmit={handleFormSubmit} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Patient Information</CardTitle>
            <p className="text-muted-foreground text-center">
              Please provide your basic information before starting the health screening questionnaire.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={userInfo.first_name}
                onChange={(e) => setUserInfo({ ...userInfo, first_name: e.target.value })}
                placeholder="Enter your first name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={userInfo.last_name}
                onChange={(e) => setUserInfo({ ...userInfo, last_name: e.target.value })}
                placeholder="Enter your last name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                placeholder="Enter your email address"
              />
            </div>

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  <ul className="list-disc pl-5 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleUserInfoSubmit}
              className="w-full"
            >
              Continue to Health Screening
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
