/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button, Alert, AlertDescription } from '@/components/ui';
import { Steps } from '@/components/Steps';
import { I18nContext, messages } from '@/contexts/I18nContext';
import { QuestionnaireReviewDto } from '@/types/questionnaire';

const steps = [
  { key: 'demographics', title: 'Demographics' },
  { key: 'medical', title: 'Medical & Insurance' },
  { key: 'std_add', title: 'STD & Addictives' },
  { key: 'genetics', title: 'Genetics' },
  { key: 'gsps', title: 'Gs & Ps' },
  { key: 'review', title: 'Review' },
] as const;

type StepKey = typeof steps[number]['key'];

interface ScreeningFormProps {
  onSubmit: (formData: any) => Promise<void>;
}

export default function ScreeningForm({ onSubmit }: ScreeningFormProps) {
  const [locale] = useState<'en'>('en');
  const t = (key: string, params?: Record<string, any>) => {
    const message = messages[locale]?.labels?.[key as keyof typeof messages[typeof locale]['labels']];
    if (!message) return key;
    if (params) {
      return Object.entries(params).reduce<string>(
        (msg, [k, v]) => msg.replace(new RegExp(`{${k}}`, 'g'), String(v)),
        message
      );
    }
    return message;
  };

  const [active, setActive] = useState<StepKey>('demographics');
  const stepIndex = steps.findIndex(step => step.key === active);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // ===== State: QuestionnaireReviewDto root =====
  const [data, setData] = useState<QuestionnaireReviewDto>({
    DemographicAndMedicalInfo: {
      // base
      HaveInsurance: null, InsuranceCompany: null,
      HaveMedicaid: null, MedicaidStatus: null, MedicaidDenialReason: null,
      EthnicityFamilyHealthHistory: [],
      HaveOBGYN: null, DoctorCare: null,
      LastHospitalAdmissionDate: null, HospitalAdmissionReason: null,
      LastERVisitDate: null, ERVisitReason: null,
      Medication: null, MedicationType: null,
      HasOtherUltrasoundThisPregnancy: [],
      // review only
      LivingArrangement: null, IsEmployed: null, EmploymentType: null, UnemploymentType: null, Occupation: null,
      NumberOfHousehold: null, NumberOfTaxReturn: null,
      Income: null, IncomeSource: null,
      HaveStdTest: null, StdTestDate: null, StdTestResult: null, StdTypes: [],
      HaveCrampingBleeding: null,
      AlcoholRelatedInfo: { UseAlcohol: null, AlcoholFrequency: [], AlcoholQuitDate: null, AlcoholTotalYears: null },
      DrugRelatedInfo: { UseDrugs: null, DrugFrequency: [], DrugsQuitDate: null, DrugsTotalYears: null },
      TobaccoRelatedInfo: { UseTobacco: null, TobaccoFrequency: [], TobaccoQuitDate: null, TobaccoTotalYears: null },
      FOBRelationship: null,
    },
    GeneticsCondition: {},
    GsPs: [],
    HasChildWithOtherBirthDefects: null,
    OtherInformation: null,
  });

  const canNext = () => {
    // This will be handled by the Steps component validation
    return true;
  };
  
  const goNext = () => setActive(steps[Math.min(stepIndex + 1, steps.length - 1)].key);
  const goPrev = () => setActive(steps[Math.max(stepIndex - 1, 0)].key);

  // Function to handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      await onSubmit(data);
      setSubmitStatus('success');
      setSubmitMessage('Form submitted successfully! Your screening data has been saved.');
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitStatus('error');
      setSubmitMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <I18nContext.Provider value={{ locale, t: t as (key: string, vars?: Record<string, string | number>) => string, enums: (messages[locale as keyof typeof messages] as (typeof messages)[keyof typeof messages]).enums }}>
      <div className="min-h-screen bg-background pt-16">
        <div className="mx-auto max-w-7xl p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">{t('FormTitle')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('Step {n} of {total}', { n: stepIndex + 1, total: steps.length })}
            </p>
          </div>

          {/* Steps Component */}
          <Steps 
            active={active} 
            data={data} 
            setData={setData} 
            steps={steps} 
            stepIndex={stepIndex} 
            onStepChange={(step) => setActive(step as StepKey)}
          />

          {/* Footer actions */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={goPrev}
              disabled={stepIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {submitStatus === 'success' && (
                <Alert className="w-auto">
                  <AlertDescription>{submitMessage}</AlertDescription>
                </Alert>
              )}
              
              {submitStatus === 'error' && (
                <Alert variant="destructive" className="w-auto">
                  <AlertDescription>{submitMessage}</AlertDescription>
                </Alert>
              )}

              {stepIndex < steps.length - 1 ? (
                <Button onClick={goNext} disabled={!canNext()}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </I18nContext.Provider>
  );
}
