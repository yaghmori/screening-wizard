'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Plus, List, Heart, Users, Shield, Clock } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6">
        {/* Hero Section with Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Allyfe Pregnancy Clinic Logo"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-primary">
            Your Ally for Life!
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Free, comprehensive pregnancy services
          </p>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            At Allyfe Pregnancy Clinic, we provide free, comprehensive services to support mothers, fathers, and their babies - all with love and without charge.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Create New Intake</CardTitle>
                  <CardDescription>
                    Start a new health screening questionnaire
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Complete a comprehensive health screening form with multiple sections including demographics, 
                medical history, genetics, and more.
              </p>
              <Link href="/">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Intake
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <List className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <CardTitle>View Records</CardTitle>
                  <CardDescription>
                    Access and manage existing screening records
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Browse through all submitted screening questionnaires, search, filter, 
                and export data for analysis.
              </p>
              <Link href="/records">
                <Button variant="outline" className="w-full">
                  <List className="h-4 w-4 mr-2" />
                  View All Records
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Heart className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle className="text-lg">Compassionate Care</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our team provides loving, supportive care to mothers, fathers, and their babies 
                throughout their pregnancy journey.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle className="text-lg">Free Services</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All our comprehensive pregnancy services are provided completely free of charge, 
                ensuring access for all families.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Users className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle className="text-lg">Family Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We support the entire family unit - mothers, fathers, and babies - 
                with comprehensive care and resources.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mission Statement */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>
              Dedicated to supporting families with love and care
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-lg text-muted-foreground mb-4">
                At Allyfe Pregnancy Clinic, we believe every family deserves access to quality pregnancy care. 
                Our mission is to provide comprehensive, loving support to mothers, fathers, and their babies 
                without any financial burden.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Free Services</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Comprehensive</div>
                  <div className="text-sm text-muted-foreground">Care</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">Loving</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">Family</div>
                  <div className="text-sm text-muted-foreground">Focused</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
