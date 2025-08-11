"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import {
  Plus,
  List,
  Heart,
  Users,
  Shield,
  Clock,
  ArrowRight,
  Star,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 -mt-16 pt-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-40'></div>

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            {/* Logo with enhanced styling */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Allyfe Pregnancy Clinic Logo"
                  width={480}
                  height={480}
                />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Ally for Life!
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 font-medium">
              Free, comprehensive pregnancy services with love and care
            </p>

            {/* Description */}
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              At Allyfe Pregnancy Clinic, we provide free, comprehensive
              services to support mothers, fathers, and their babies - all with
              love and without charge.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/intake">
                <Button
                  size="lg"
                  className="bg-gradient-to-r h-12 from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Start New Intake
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/records">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 h-12 hover:border-blue-500 px-8 py-3 text-lg font-semibold bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
                >
                  <List className="h-5 w-5 mr-2" />
                  View Records
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
