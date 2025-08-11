'use client';

import React, { createContext, useContext, useState } from 'react';

// ===== i18n (minimal) =====
const messages = {
  en: {
    labels: {
      'FormTitle': 'Health Screening Questionnaire Review',
      'Step {n} of {total}': 'Step {n} of {total}',
      // Tabs / Sections
      'Demographics': 'Demographics',
      'Medical & Insurance': 'Medical & Insurance',
      'STD & Addictives': 'STD & Addictives',
      'Genetics': 'Genetics',
      'Gs & Ps': 'Gs & Ps',
      'Review': 'Review',
      'Demographics & Employment': 'Demographics & Employment',
      'Medical & Insurance Title': 'Medical & Insurance',
      'STD Test': 'STD Test',
      'AlcoholRelatedInfo': 'Alcohol Related Information',
      'TobaccoRelatedInfo': 'Tobacco Related Information',
      'DrugRelatedInfo': 'Drug Related Information',
      'Genetics Conditions': 'Genetics Conditions',
      'Gs & Ps Title': 'Gestationals and Pregnancies',
      'Other': 'Other',
      'Live JSON (QuestionnaireReviewDto)': 'Live JSON (QuestionnaireReviewDto)',
      // Generic controls
      'Yes': 'Yes', 'No': 'No', 'Select': 'Select', 'Remove': 'Remove',
      'Previous': 'Previous', 'Submit': 'Submit', 'Next': 'Next', 'Done': 'Done',
      '+ Add': '+ Add', '+ Add Record': '+ Add Record', '+ Add Ultrasound': '+ Add Ultrasound',
      'Search...': 'Search...',
      'No results found': 'No results found',
      'Select items...': 'Select items...',
      '{count} selected': '{count} selected',
      // Row labels
      'Living Arrangement': 'Living Arrangement',
      'FOB Relationship': 'What is the status of your relationship with the FOB',
      'Is Employed?': 'Is Employed?',
      'Employment Type': 'Employment Type',
      'Unemployment Type': 'Unemployment Type',
      'Occupation': 'Occupation',
      '# of people in household': '# of people in household',
      '# on tax return': 'How many people did you claim in your tax return',
      'Household Income': 'Household Income',
      'Source of income': 'Source of income',
      'Have Insurance?': 'Have Insurance?',
      'Insurance Company': 'Insurance Company',
      'Have Medicaid?': 'Have you applied for Medicaid?',
      'Medicaid Status': 'What is the status of your application?',
      'Medicaid Denial Reason': 'Reason for denial? ',
      'Family Health History': 'Select all that apply to your current or historical health',
      'Have OBGYN?': 'Do you have an OBGYN?',
      'Under Doctor Care?': "Are you under doctor's care for this condition?",
      'Last Hospital Admission Date': 'When was the last time you were admitted to the hospital?',
      'Hospital Admission Reason': 'Hospital admission reason?',
      'Last ER Visit Date': 'Have you been to the ER for this pregnancy?',
      'ER Visit Reason': 'Why did you go to the ER? ',
      'Taking Medication?': 'Are you taking medication for this condition?',
      'Medication Type': 'Name of medication',
      'Other Ultrasounds (this pregnancy)': 'List all ultrasounds performed outside of this Clinic',
      'Date': 'Date', 'Place': 'Place',
      'Have STD Test?': 'Have you ever been tested for an STI/STD?',
      'STD Test Date': 'STD Test Date',
      'STD Test Result': 'STD Test Result',
      'STD Types': 'What type?',
      'Cramping/Bleeding?': 'Have you experienced cramping and/or bleeding?',
      'Use Alcohol?': 'Use Alcohol?',
      'Total Years': 'Total Years',
      'Frequency Rows': 'Frequency Rows',
      'Use Tobacco?': 'Use Tobacco?',
      'Use Drugs?': 'Use Drugs?',
      'Year': 'Year', 
      'WeeksOfDelivery': 'Weeks of Delivery', 
      'BabyWeight': 'Baby Weight', 
      'Complications': 'Complications', 
      'BP Systolic': 'BP Systolic', 
      'BP Diastolic': 'BP Diastolic',
      'Has Child With Other Birth Defects?': 'Patient or baby\'s father had a child with birth defects NOT listed above?',
      'Other Information': 'Other Information',
      'Alcohol Type': 'Alcohol Type',
      'Drug Type': 'Drug Type',
      'Tobacco Type': 'Tobacco Type',
      'Frequency': 'Frequency',
    },
    enums: {
      // Demographic/Employment
      LivingEnum: {
        Alone: 'Alone', WithParents: 'With Parents', WithSpouse: 'With Spouse', BoyfriendFiance: 'Boyfriend/Fiancé', Homeless: 'Homeless', Other: 'Other',
      },
      EmploymentTypeEnum: {
        Employed: 'Employed Full-time', PartTime: 'Employed Part-time (20 hours or less per week)', SelfEmployed: 'Self Employed',
      },
      UnemploymentTypeEnum: {
        UnemployedLooking: 'Unemployed - Looking', UnemployedNotLooking: 'Unemployed - Not looking', Student: 'Student', Homemaker: 'Homemaker',
      },
      IncomeEnum: {
        Less18000: '$18,000 or Less', Between18000_36000: '$18,001–$36,000', Between36000_72000: '$36,001–$72,000', Above72000: '$72,001+',
      },

      // Medical/Insurance
      InsuranceCompanyEnum: {
        Aetna: 'Aetna', BlueCross: 'Blue Cross/Blue Shield', Cigna: 'Cigna', United: 'United Healthcare', Other: 'Other',
      },
      MedicaidStatusEnum: {
        Approved: 'Approved', Denied: 'Denied', Pending: 'Pending', NotApplied: 'Not Applied',
      },
      ScreeningHealthHistoryEnum: {
        Diabetes: 'Diabetes', Hypertension: 'Hypertension', Thyroid: 'Thyroid', Asthma: 'Asthma', Other: 'Other',
      },

      // STD / Addictives
      STDTestResultEnum: { Negative: 'Negative', Positive: 'Positive', Unknown: 'Unknown' },
      STDTypesEnum: {
        Chlamydia: 'Chlamydia', Gonorrhea: 'Gonorrhea', Syphilis: 'Syphilis', HPV: 'HPV', HIV: 'HIV', Herpes: 'Herpes',
      },
      FrequencyEnum: { Rarely: 'Rarely', Weekends: 'Weekends', Weekly: 'Weekly', Daily: 'Daily' },
      AlcoholTypeEnum: { Beer: 'Beer', Wine: 'Wine', Spirits: 'Spirits' },
      TobaccoTypeEnum: { Cigarettes: 'Cigarettes', Hookah: 'Hookah', Cigars: 'Cigars', Vaping: 'Vaping' },
      DrugTypeEnum: { Marijuana: 'Marijuana', Cocaine: 'Cocaine', Heroin: 'Heroin', Methamphetamine: 'Methamphetamine', Prescription: 'Prescription (non‑medical)' },

      // Genetics
      FamilyRelationEnum: {
        GrandParents: 'Grand Parents', Parents: 'Parents', Siblings: 'Siblings', Kids: 'Kids', ExtendedFamily: 'Extended Family'
      },
    }
  },
} as const;

type Locale = keyof typeof messages;

type I18nContextValue = {
  locale: Locale;
  t: (key: string, vars?: Record<string, string | number>) => string;
  enums: Record<string, Record<string, string>>;
};

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  t: (s) => s,
  enums: messages.en.enums,
});

export { I18nContext, messages };
export type { Locale, I18nContextValue };
