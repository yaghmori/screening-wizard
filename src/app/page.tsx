'use client';

import React, { useMemo, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronsUpDown, X, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

// Import all components from the bundled file
import {
  Button,
  Input,
  Label,
  Textarea,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Progress,
  Alert,
  AlertDescription,
  Separator,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn
} from '@/components/ui';
import { Asap_Condensed } from 'next/font/google';

/**
 * Next.js Wizard with Shadcn UI Components
 * 
 * Installation required:
 * npx shadcn-ui@latest init
 * npx shadcn-ui@latest add button input label textarea radio-group select card badge progress tabs alert separator command popover
 */

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
      'Under Doctor Care?': 'Are you under doctor’s care for this condition?',
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

const steps = [
  { key: 'demographics', title: 'Demographics' },
  { key: 'medical', title: 'Medical & Insurance' },
  { key: 'std_add', title: 'STD & Addictives' },
  { key: 'genetics', title: 'Genetics' },
  { key: 'gsps', title: 'Gs & Ps' },
  { key: 'review', title: 'Review' },
] as const;

type StepKey = typeof steps[number]['key'];

type I18nContextValue = {
  locale: Locale;
  t: (key: string, vars?: Record<string, string | number>) => string;
  enums: Record<string, Record<string, string>>;
};

const I18nContext = React.createContext<I18nContextValue>({
  locale: 'en',
  t: (s) => s,
  enums: messages.en.enums,
});

// ===== Custom MultiSelect Component =====
interface MultiSelectProps {
  enumType: string;
  values: (string | null)[];
  onChange: (values: (string | null)[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

function MultiSelect({ enumType, values, onChange, placeholder, disabled }: MultiSelectProps) {
  const { enums, t } = useContext(I18nContext);
  const [open, setOpen] = useState(false);
  const options = useMemo(() => {
    const map = enums[enumType] || {};
    return Object.keys(map).map(k => ({ value: k, label: map[k] }));
  }, [enumType, enums]);

  const selectedValues = values.filter(Boolean) as string[];

  const handleSelect = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <span className="truncate">
            {selectedValues.length > 0
              ? t('{count} selected', { count: selectedValues.length })
              : t(placeholder || 'Select items...')}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={t('Search...')} />
          <CommandEmpty>{t('No results found')}</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedValues.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ===== Helper Components =====
function spaceEnumName(name: string) { 
  return name.replace(/([a-z])([A-Z])/g, '$1 $2'); 
}

function Section({ title, children, description }: { title: string; children: React.ReactNode; description?: string }) {
  const { t } = useContext(I18nContext);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(title)}</CardTitle>
        {description && <CardDescription>{t(description)}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">{children}</div>
      </CardContent>
    </Card>
  );
}

function Row({ label, children, hint, error }: { label: string; children: React.ReactNode; hint?: string; error?: boolean }) {
  const { t } = useContext(I18nContext);
  return (
    <div className="grid gap-2">
      <Label className={cn(error && "text-destructive")}>{t(label)}</Label>
      {children}
      {hint && <p className="text-sm text-muted-foreground">{t(hint)}</p>}
    </div>
  );
}

function YesNo({ value, onChange, name, disabled }: { value: boolean | null; onChange: (v: boolean) => void; name: string; disabled?: boolean }) {
  const { t } = useContext(I18nContext);
  return (
    <RadioGroup 
      value={value === null ? '' : value.toString()} 
      onValueChange={(v) => onChange(v === 'true')}
      disabled={disabled}
    >
      <div className="flex gap-6">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id={`${name}-yes`} />
          <Label htmlFor={`${name}-yes`}>{t('Yes')}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id={`${name}-no`} />
          <Label htmlFor={`${name}-no`}>{t('No')}</Label>
        </div>
      </div>
    </RadioGroup>
  );
}

function EnumSelect({ enumType, value, onChange, placeholder, disabled }: { 
  enumType: string; 
  value: string | null; 
  onChange: (v: string | null) => void; 
  placeholder?: string; 
  disabled?: boolean 
}) {
  const { enums, t } = useContext(I18nContext);
  const options = useMemo(() => {
    const map = enums[enumType] || {};
    return Object.keys(map).map(k => ({ value: k, label: map[k] }));
  }, [enumType, enums]);

  return (
    <Select value={value ?? ''} onValueChange={(v) => onChange(v || null)} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={t(placeholder ?? 'Select')} />
      </SelectTrigger>
      <SelectContent>
        {options.map(o => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ===== DTO shapes (strict names) =====
interface DatePlaceDto { Date: string | null; Place: string | null }

interface DemographicAndMedicalInfoDto {
  HaveInsurance: boolean | null;
  InsuranceCompany: string | null;
  HaveMedicaid: boolean | null;
  MedicaidStatus: string | null;
  MedicaidDenialReason: string | null;
  EthnicityFamilyHealthHistory: (string | null)[] | null;
  HaveOBGYN: boolean | null;
  DoctorCare: boolean | null;
  LastHospitalAdmissionDate: string | null;
  HospitalAdmissionReason: string | null;
  LastERVisitDate: string | null;
  ERVisitReason: string | null;
  Medication: boolean | null;
  MedicationType: string | null;
  HasOtherUltrasoundThisPregnancy: DatePlaceDto[] | null;
}

interface AlcoholFrequencyDto { Id: string; AlcoholType: string | null; Frequency: string | null }
interface DrugFrequencyDto { Id: string; DrugType: string | null; Frequency: string | null }
interface TobaccoFrequencyDto { Id: string; TobaccoType: string | null; Frequency: string | null }

interface AlcoholRelatedInfoDto { 
  UseAlcohol: boolean | null; 
  AlcoholFrequency: AlcoholFrequencyDto[]; 
  AlcoholQuitDate: string | null; 
  AlcoholTotalYears: number | null 
}
interface DrugRelatedInfoDto { 
  UseDrugs: boolean | null; 
  DrugFrequency: DrugFrequencyDto[]; 
  DrugsQuitDate: string | null; 
  DrugsTotalYears: number | null 
}
interface TobaccoRelatedInfoDto { 
  UseTobacco: boolean | null; 
  TobaccoFrequency: TobaccoFrequencyDto[]; 
  TobaccoQuitDate: string | null; 
  TobaccoTotalYears: number | null 
}

interface DemographicAndMedicalInfoReviewDto extends DemographicAndMedicalInfoDto {
  LivingArrangement: string | null;
  IsEmployed: boolean | null;
  EmploymentType: string | null;
  UnemploymentType: string | null;
  Occupation: string | null;
  NumberOfHousehold: number | null;
  NumberOfTaxReturn: number | null;
  Income: string | null;
  IncomeSource: string | null;
  HaveStdTest: boolean | null;
  StdTestDate: string | null;
  StdTestResult: string | null;
  StdTypes: (string | null)[];
  HaveCrampingBleeding: boolean | null;
  AlcoholRelatedInfo: AlcoholRelatedInfoDto;
  DrugRelatedInfo: DrugRelatedInfoDto;
  TobaccoRelatedInfo: TobaccoRelatedInfoDto;
  FOBRelationship: string | null;
}

interface GeneticsConditionDto { [key: string]: string | null }

interface GsPsDto {
  Year: number | null;
  WeeksOfDelivery: number | null;
  BabyWeight: number | null;
  Complications: string | null;
  BloodPressureSystolic: number | null;
  BloodPressureDiastolic: number | null;
}

interface QuestionnaireReviewDto {
  DemographicAndMedicalInfo: DemographicAndMedicalInfoReviewDto;
  GeneticsCondition: GeneticsConditionDto;
  GsPs: GsPsDto[];
  HasChildWithOtherBirthDefects: boolean | null;
  OtherInformation: string | null;
}

// Shared genetics flags + relation field pairs
const geneticFlagRelationPairs: ReadonlyArray<[string, string]> = [
  ['HasThalassemia','ThalassemiaRelation'],
  ['HasNeuralTubeDefect','NeuralTubeDefectRelation'],
  ['HasCongenitalHeartDefect','CongenitalHeartDefectRelation'],
  ['HasDownSyndrome','DownSyndromeRelation'],
  ['HasTaySachs','TaySachsRelation'],
  ['HasSickleCellDiseaseOrTrait','SickleCellDiseaseOrTraitRelation'],
  ['HasHemophilia','HemophiliaRelation'],
  ['HasMuscularDystrophy','MuscularDystrophyRelation'],
  ['HasSinalMuscularAtrophy','SinalMuscularAtrophyRelation'],
  ['HasFragileX','FragileXRelation'],
  ['HasCysticFibrosis','CysticFibrosisRelation'],
  ['HasHuntingtonChorea','HuntingtonChoreaRelation'],
  ['HasRecurrentPregnancyLossOrStillbirth','RecurrentPregnancyLossOrStillbirthRelation'],
  ['HasMentalRetardationOrAutism','MentalRetardationOrAutismRelation'],
  ['HasOtherInheritedGeneticDisorder','OtherInheritedGeneticDisorderRelation'],
  ['HasMaternalMetabolicDisorder','MaternalMetabolicDisorderRelation'],
] as const;

// ===== Validation helpers (reflect your rules; simplified for demo) =====
function notFuture(date: string | null) { return !date || new Date(date) <= new Date(); }

function valDemographic(m: DemographicAndMedicalInfoReviewDto) {
  const e: string[] = [];
  // Insurance / Medicaid
  if (m.HaveInsurance === true && !m.InsuranceCompany) e.push('InsuranceCompany is required when HaveInsurance = Yes.');
  if (m.HaveMedicaid === true && !m.MedicaidStatus) e.push('MedicaidStatus is required when HaveMedicaid = Yes.');
  if (m.HaveMedicaid === true && m.MedicaidStatus === 'Denied' && !m.MedicaidDenialReason) e.push('MedicaidDenialReason is required when MedicaidStatus = Denied.');

  // Medical dates / reasons
  if (!notFuture(m.LastHospitalAdmissionDate)) e.push('LastHospitalAdmissionDate cannot be in the future.');
  if (m.LastHospitalAdmissionDate && !m.HospitalAdmissionReason) e.push('HospitalAdmissionReason is required when LastHospitalAdmissionDate is set.');
  if (!notFuture(m.LastERVisitDate)) e.push('LastERVisitDate cannot be in the future.');
  if (m.LastERVisitDate && !m.ERVisitReason) e.push('ERVisitReason is required when LastERVisitDate is set.');

  // Medication
  if (m.Medication === true && (!m.MedicationType || m.MedicationType.length > 500)) e.push('MedicationType required (≤ 500 chars) when Medication = Yes.');

  // Ultrasounds
  if (m.HasOtherUltrasoundThisPregnancy && m.HasOtherUltrasoundThisPregnancy.length) {
    m.HasOtherUltrasoundThisPregnancy.forEach((r, i) => {
      if (!r.Date || !notFuture(r.Date)) e.push(`Ultrasound row ${i + 1}: Date required and cannot be future.`);
      if (!r.Place || r.Place.length > 500) e.push(`Ultrasound row ${i + 1}: Place required (≤ 500 chars).`);
    });
  }

  // Employment
  if (m.IsEmployed === true) {
    if (!m.EmploymentType) e.push('EmploymentType is required when IsEmployed = Yes.');
    if (!m.Occupation) e.push('Occupation is required when IsEmployed = Yes.');
  } else if (m.IsEmployed === false) {
    if (!m.UnemploymentType) e.push('UnemploymentType is required when IsEmployed = No.');
  }
  return e;
}

function valGenetics(gen: GeneticsConditionDto) {
  const e: string[] = [];
  for (const [flag] of geneticFlagRelationPairs) {
    const v = gen[flag];
    if (v == null) {
      const label = spaceEnumName(flag.replace(/^Has/, ''));
      e.push(`${label} is required.`);
    }
  }
  return e;
}

function valStdAdd(m: DemographicAndMedicalInfoReviewDto) {
  const e: string[] = [];
  if (m.HaveStdTest === true) {
    if (!m.StdTestDate) e.push('StdTestDate is required when HaveStdTest = Yes.');
    if (!m.StdTestResult) e.push('StdTestResult is required when HaveStdTest = Yes.');
    if (m.StdTestResult === 'Positive' && (!m.StdTypes || !m.StdTypes.length)) e.push('StdTypes required when StdTestResult = Positive.');
  }
  if (m.HaveCrampingBleeding == null) e.push('HaveCrampingBleeding is required.');
  return e;
}

function alcoholErrors(a: AlcoholRelatedInfoDto) {
  const errs: string[] = [];
  if (a.UseAlcohol == null) errs.push('UseAlcohol is required.');
  if (a.UseAlcohol === true) {
    if (!a.AlcoholFrequency.length) errs.push('AlcoholFrequency required when UseAlcohol = Yes.');
    if (a.AlcoholTotalYears == null) errs.push('AlcoholTotalYears required when UseAlcohol = Yes.');
  }
  return errs;
}

function drugErrors(d: DrugRelatedInfoDto) {
  const errs: string[] = [];
  if (d.UseDrugs == null) errs.push('UseDrugs is required.');
  if (d.UseDrugs === true) {
    if (!d.DrugFrequency.length) errs.push('DrugFrequency required when UseDrugs = Yes.');
    if (d.DrugsTotalYears == null) errs.push('DrugsTotalYears required when UseDrugs = Yes.');
  }
  return errs;
}

function tobaccoErrors(t: TobaccoRelatedInfoDto) {
  const errs: string[] = [];
  if (t.UseTobacco == null) errs.push('UseTobacco is required.');
  if (t.UseTobacco === true) {
    if (!t.TobaccoFrequency.length) errs.push('TobaccoFrequency required when UseTobacco = Yes.');
    if (t.TobaccoTotalYears == null) errs.push('TobaccoTotalYears required when UseTobacco = Yes.');
  }
  return errs;
}

function valGsPs(list: GsPsDto[]) {
  const e: string[] = [];
  list.forEach((x, i) => {
    if (x.BloodPressureSystolic != null && x.BloodPressureDiastolic != null && !(x.BloodPressureDiastolic < x.BloodPressureSystolic)) {
      e.push(`GsPs row ${i + 1}: Diastolic must be less than systolic.`);
    }
  });
  return e;
}

// ===== Repeater rows =====
function AFRow({ row, onChange, onRemove }: { row: AlcoholFrequencyDto; onChange: (r: AlcoholFrequencyDto) => void; onRemove: () => void }) {
  const { t } = useContext(I18nContext);
  return (
    <div className="grid grid-cols-3 gap-3 items-end p-4 border rounded-lg">
      <Row label="Alcohol Type">
        <EnumSelect enumType="AlcoholTypeEnum" value={row.AlcoholType} onChange={(v) => onChange({ ...row, AlcoholType: v })} />
      </Row>
      <Row label="Frequency">
        <EnumSelect enumType="FrequencyEnum" value={row.Frequency} onChange={(v) => onChange({ ...row, Frequency: v })} />
      </Row>
      <Button variant="outline" size="icon" onClick={onRemove}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function DFRow({ row, onChange, onRemove }: { row: DrugFrequencyDto; onChange: (r: DrugFrequencyDto) => void; onRemove: () => void }) {
  const { t } = useContext(I18nContext);
  return (
    <div className="grid grid-cols-3 gap-3 items-end p-4 border rounded-lg">
      <Row label="Drug Type">
        <EnumSelect enumType="DrugTypeEnum" value={row.DrugType} onChange={(v) => onChange({ ...row, DrugType: v })} />
      </Row>
      <Row label="Frequency">
        <EnumSelect enumType="FrequencyEnum" value={row.Frequency} onChange={(v) => onChange({ ...row, Frequency: v })} />
      </Row>
      <Button variant="outline" size="icon" onClick={onRemove}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function TFRow({ row, onChange, onRemove }: { row: TobaccoFrequencyDto; onChange: (r: TobaccoFrequencyDto) => void; onRemove: () => void }) {
  const { t } = useContext(I18nContext);
  return (
    <div className="grid grid-cols-3 gap-3 items-end p-4 border rounded-lg">
      <Row label="Tobacco Type">
        <EnumSelect enumType="TobaccoTypeEnum" value={row.TobaccoType} onChange={(v) => onChange({ ...row, TobaccoType: v })} />
      </Row>
      <Row label="Frequency">
        <EnumSelect enumType="FrequencyEnum" value={row.Frequency} onChange={(v) => onChange({ ...row, Frequency: v })} />
      </Row>
      <Button variant="outline" size="icon" onClick={onRemove}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function DatePlaceRow({ row, onChange, onRemove }: { row: DatePlaceDto; onChange: (r: DatePlaceDto) => void; onRemove: () => void }) {
  const { t } = useContext(I18nContext);
  return (
    <div className="grid md:grid-cols-3 gap-3 items-end p-4 border rounded-lg">
      <Row label="Date">
        <Input type="date" value={row.Date ?? ''} onChange={(e) => onChange({ ...row, Date: e.target.value || null })} />
      </Row>
      <Row label="Place">
        <Input value={row.Place ?? ''} onChange={(e) => onChange({ ...row, Place: e.target.value || null })} />
      </Row>
      <Button variant="outline" size="icon" onClick={onRemove}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function GsPsRow({ row, onChange, onRemove }: { row: GsPsDto; onChange: (r: GsPsDto) => void; onRemove: () => void }) {
  const { t } = useContext(I18nContext);
  return (
    <div className="grid md:grid-cols-7 gap-3 items-end p-4 border rounded-lg">
      <Row label="Year">
        <Input type="number" value={row.Year ?? ''} onChange={(e) => onChange({ ...row, Year: e.target.value ? Number(e.target.value) : null })} />
      </Row>
      <Row label="WeeksOfDelivery">
        <Input type="number" value={row.WeeksOfDelivery ?? ''} onChange={(e) => onChange({ ...row, WeeksOfDelivery: e.target.value ? Number(e.target.value) : null })} />
      </Row>
      <Row label="BabyWeight">
        <Input type="number" step="0.01" value={row.BabyWeight ?? ''} onChange={(e) => onChange({ ...row, BabyWeight: e.target.value ? Number(e.target.value) : null })} />
      </Row>
      <Row label="Complications">
        <Input value={row.Complications ?? ''} onChange={(e) => onChange({ ...row, Complications: e.target.value || null })} />
      </Row>
      <Row label="BP Systolic">
        <Input type="number" value={row.BloodPressureSystolic ?? ''} onChange={(e) => onChange({ ...row, BloodPressureSystolic: e.target.value ? Number(e.target.value) : null })} />
      </Row>
      <Row label="BP Diastolic">
        <Input type="number" value={row.BloodPressureDiastolic ?? ''} onChange={(e) => onChange({ ...row, BloodPressureDiastolic: e.target.value ? Number(e.target.value) : null })} />
      </Row>
      <Button variant="outline" size="icon" onClick={onRemove}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function Page() {





  const [active, setActive] = useState<StepKey>('demographics');
  const stepIndex = steps.findIndex((s: typeof steps[number]) => s.key === active);

  // i18n state and helpers
  const [locale, setLocale] = useState<Locale>('en');
  const t = (key: string, vars?: Record<string, string | number>) => {
    const current = messages[locale as keyof typeof messages] as (typeof messages)[keyof typeof messages];
    const currentLabels = current.labels as Record<string, string>;
    let raw = currentLabels[key] ?? key;
    if (vars) {
      for (const k of Object.keys(vars)) raw = raw.replace(`{${k}}`, String(vars[k]));
    }
    return raw;
  };

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

  // derived errors for gating Next
  const errsDem = useMemo(() => valDemographic(data.DemographicAndMedicalInfo), [data.DemographicAndMedicalInfo]);
  const errsStd = useMemo(() => valStdAdd(data.DemographicAndMedicalInfo), [data.DemographicAndMedicalInfo]);
  const errsAl = useMemo(() => alcoholErrors(data.DemographicAndMedicalInfo.AlcoholRelatedInfo), [data.DemographicAndMedicalInfo.AlcoholRelatedInfo]);
  const errsDr = useMemo(() => drugErrors(data.DemographicAndMedicalInfo.DrugRelatedInfo), [data.DemographicAndMedicalInfo.DrugRelatedInfo]);
  const errsTo = useMemo(() => tobaccoErrors(data.DemographicAndMedicalInfo.TobaccoRelatedInfo), [data.DemographicAndMedicalInfo.TobaccoRelatedInfo]);
  const errsGs = useMemo(() => valGsPs(data.GsPs), [data.GsPs]);
  const errsGen = useMemo(() => valGenetics(data.GeneticsCondition), [data.GeneticsCondition]);

  const canNext = () => {
    if (active === 'demographics') return errsDem.length === 0;
    if (active === 'medical') return errsDem.length === 0; // shares same obj rules
    if (active === 'std_add') return errsStd.length === 0 && errsAl.length === 0 && errsDr.length === 0 && errsTo.length === 0;
    if (active === 'genetics') return errsGen.length === 0;
    if (active === 'gsps') return errsGs.length === 0;
    return true;
  };
  const goNext = () => setActive(steps[Math.min(stepIndex + 1, steps.length - 1)].key);
  const goPrev = () => setActive(steps[Math.max(stepIndex - 1, 0)].key);

  // shorthand
  const dm = data.DemographicAndMedicalInfo;

  return (
    <I18nContext.Provider value={{ locale, t, enums: (messages[locale as keyof typeof messages] as (typeof messages)[keyof typeof messages]).enums }}>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('FormTitle')}</h1>
              <p className="text-muted-foreground mt-1">
                {t('Step {n} of {total}', { n: stepIndex + 1, total: steps.length })}
              </p>
            </div>
          </div>

          {/* Progress and Tabs */}
          <div className="mb-8">
            <Progress value={((stepIndex + 1) / steps.length) * 100} className="mb-4" />
            <div className="flex flex-wrap gap-2">
              {steps.map((s, i) => (
                <Button
                  key={s.key}
                  variant={active === s.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActive(s.key)}
                  className="gap-2"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs">
                    {i + 1}
                  </span>
                  {t(s.title)}
                </Button>
              ))}
            </div>
          </div>

          {/* Panels */}
          <motion.div 
            key={active} 
            initial={{ opacity: 0, y: 6 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.2 }} 
            className="grid gap-6"
          >
            {/* Demographics */}
            {active === 'demographics' && (
              <Section title="Demographics & Employment">
                <div className="grid md:grid-cols-2 gap-4">
                  <Row label="Living Arrangement">
                    <EnumSelect enumType="LivingEnum" value={dm.LivingArrangement} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, LivingArrangement: v } })} />
                  </Row>
                  <Row label="FOB Relationship">
                    <Input value={dm.FOBRelationship ?? ''} onChange={(e) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, FOBRelationship: e.target.value || null } })} />
                  </Row>
                  <Row label="Is Employed?">
                    <YesNo name="emp" value={dm.IsEmployed} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, IsEmployed: v } })} />
                  </Row>
                  {dm.IsEmployed === true && (
                    <>
                      <Row label="Employment Type">
                        <EnumSelect enumType="EmploymentTypeEnum" value={dm.EmploymentType} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, EmploymentType: v } })} />
                      </Row>
                      <Row label="Occupation">
                        <Input value={dm.Occupation ?? ''} onChange={(e) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, Occupation: e.target.value || null } })} />
                      </Row>
                    </>
                  )}
                  {dm.IsEmployed === false && (
                    <Row label="Unemployment Type">
                      <EnumSelect enumType="UnemploymentTypeEnum" value={dm.UnemploymentType} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, UnemploymentType: v } })} />
                    </Row>
                  )}
                  <Row label="# of people in household">
                    <Input type="number" value={dm.NumberOfHousehold ?? ''} onChange={(e) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, NumberOfHousehold: e.target.value ? Number(e.target.value) : null } })} />
                  </Row>
                  <Row label="# on tax return">
                    <Input type="number" value={dm.NumberOfTaxReturn ?? ''} onChange={(e) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, NumberOfTaxReturn: e.target.value ? Number(e.target.value) : null } })} />
                  </Row>
                  <Row label="Household Income">
                    <EnumSelect enumType="IncomeEnum" value={dm.Income} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, Income: v } })} />
                  </Row>
                  <Row label="Source of income">
                    <Input value={dm.IncomeSource ?? ''} onChange={(e) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, IncomeSource: e.target.value || null } })} />
                  </Row>
                </div>
                {errsDem.length > 0 && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      <ul className="list-disc pl-5 space-y-1">
                        {errsDem.map((e, i) => (<li key={i}>{e}</li>))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </Section>
            )}

            {/* Medical & Insurance */}
            {active === 'medical' && (
              <Section title="Medical & Insurance Title">
                <div className="grid md:grid-cols-2 gap-4">
                  <Row label="Have Insurance?">
                    <YesNo name="ins" value={dm.HaveInsurance} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, HaveInsurance: v } })} />
                  </Row>
                  <Row label="Insurance Company">
                    <EnumSelect enumType="InsuranceCompanyEnum" value={dm.InsuranceCompany} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, InsuranceCompany: v } })} disabled={dm.HaveInsurance !== true} />
                  </Row>

                  <Row label="Have Medicaid?">
                    <YesNo name="med" value={dm.HaveMedicaid} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, HaveMedicaid: v } })} />
                  </Row>
                  <Row label="Medicaid Status">
                    <EnumSelect enumType="MedicaidStatusEnum" value={dm.MedicaidStatus} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, MedicaidStatus: v } })} disabled={dm.HaveMedicaid !== true} />
                  </Row>
                  {dm.HaveMedicaid === true && dm.MedicaidStatus === 'Denied' && (
                    <Row label="Medicaid Denial Reason">
                      <Input value={dm.MedicaidDenialReason ?? ''} onChange={(e) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, MedicaidDenialReason: e.target.value || null } })} />
                    </Row>
                  )}

                  <Row label="Family Health History">
                    <MultiSelect 
                      enumType="ScreeningHealthHistoryEnum" 
                      values={(dm.EthnicityFamilyHealthHistory || []) as (string|null)[]} 
                      onChange={(vals) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, EthnicityFamilyHealthHistory: vals } })} 
                    />
                  </Row>
                  <Row label="Have OBGYN?">
                    <YesNo name="obgyn" value={dm.HaveOBGYN} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, HaveOBGYN: v } })} />
                  </Row>
                  <Row label="Under Doctor Care?">
                    <YesNo name="doc" value={dm.DoctorCare} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, DoctorCare: v } })} />
                  </Row>

                  <Row label="Last Hospital Admission Date">
                    <Input type="date" value={dm.LastHospitalAdmissionDate ?? ''} onChange={(e) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, LastHospitalAdmissionDate: e.target.value || null } })} />
                  </Row>
                  <Row label="Hospital Admission Reason">
                    <Input value={dm.HospitalAdmissionReason ?? ''} onChange={(e) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, HospitalAdmissionReason: e.target.value || null } })} />
                  </Row>
                  <Row label="Last ER Visit Date">
                    <Input type="date" value={dm.LastERVisitDate ?? ''} onChange={(e) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, LastERVisitDate: e.target.value || null } })} />
                  </Row>
                  <Row label="ER Visit Reason">
                    <Input value={dm.ERVisitReason ?? ''} onChange={(e) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, ERVisitReason: e.target.value || null } })} />
                  </Row>

                  <Row label="Taking Medication?">
                    <YesNo name="meds" value={dm.Medication} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, Medication: v } })} />
                  </Row>
                  <Row label="Medication Type">
                    <Input value={dm.MedicationType ?? ''} onChange={(e) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, MedicationType: e.target.value || null } })} disabled={dm.Medication !== true} />
                  </Row>
                </div>

                <Separator className="my-4" />
                
                <Row label="Other Ultrasounds (this pregnancy)">
                  <div className="grid gap-3">
                    {(dm.HasOtherUltrasoundThisPregnancy || []).map((r, idx) => (
                      <DatePlaceRow key={idx} row={r} onChange={(nr) => {
                        const list = [...(dm.HasOtherUltrasoundThisPregnancy || [])];
                        list[idx] = nr; 
                        setData({ ...data, DemographicAndMedicalInfo: { ...dm, HasOtherUltrasoundThisPregnancy: list } });
                      }} onRemove={() => {
                        const list = [...(dm.HasOtherUltrasoundThisPregnancy || [])];
                        list.splice(idx, 1); 
                        setData({ ...data, DemographicAndMedicalInfo: { ...dm, HasOtherUltrasoundThisPregnancy: list } });
                      }} />
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const list = [...(dm.HasOtherUltrasoundThisPregnancy || [])];
                        list.push({ Date: null, Place: null });
                        setData({ ...data, DemographicAndMedicalInfo: { ...dm, HasOtherUltrasoundThisPregnancy: list } });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('+ Add Ultrasound')}
                    </Button>
                  </div>
                </Row>

                {errsDem.length > 0 && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      <ul className="list-disc pl-5 space-y-1">
                        {errsDem.map((e, i) => (<li key={i}>{e}</li>))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </Section>
            )}

            {/* STD & Addictives */}
            {active === 'std_add' && (
              <>
                <Section title="STD Test">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Row label="Have STD Test?">
                      <YesNo name="std" value={dm.HaveStdTest} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, HaveStdTest: v } })} />
                    </Row>
                    <Row label="STD Test Date">
                      <Input type="date" value={dm.StdTestDate ?? ''} onChange={(e) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, StdTestDate: e.target.value || null } })} />
                    </Row>
                    <Row label="STD Test Result">
                      <EnumSelect enumType="STDTestResultEnum" value={dm.StdTestResult} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, StdTestResult: v } })} />
                    </Row>
                    <Row label="STD Types" hint={dm.StdTestResult === 'Positive' ? 'Required when Result = Positive' : undefined}>
                      <MultiSelect 
                        enumType="STDTypesEnum" 
                        values={dm.StdTypes} 
                        onChange={(vals) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, StdTypes: vals } })} 
                        disabled={dm.StdTestResult !== 'Positive'} 
                      />
                    </Row>
                    <Row label="Cramping/Bleeding?">
                      <YesNo name="cramp" value={dm.HaveCrampingBleeding} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, HaveCrampingBleeding: v } })} />
                    </Row>
                  </div>
                  {errsStd.length > 0 && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        <ul className="list-disc pl-5 space-y-1">
                          {errsStd.map((e, i) => (<li key={i}>{e}</li>))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </Section>

                <Section title="AlcoholRelatedInfo">
                  <Row label="Use Alcohol?">
                    <YesNo name="alc" value={dm.AlcoholRelatedInfo.UseAlcohol} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, AlcoholRelatedInfo: { ...dm.AlcoholRelatedInfo, UseAlcohol: v } } })} />
                  </Row>
                  {dm.AlcoholRelatedInfo.UseAlcohol === true && (
                    <>
                      <Row label="Total Years">
                        <Input type="number" value={dm.AlcoholRelatedInfo.AlcoholTotalYears ?? ''} onChange={(e) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, AlcoholRelatedInfo: { ...dm.AlcoholRelatedInfo, AlcoholTotalYears: e.target.value ? Number(e.target.value) : null } } })} />
                      </Row>
                      <Row label="Frequency Rows">
                        <div className="grid gap-3">
                          {dm.AlcoholRelatedInfo.AlcoholFrequency.map((r, idx) => (
                            <AFRow key={r.Id} row={r} onChange={(nr) => {
                              const list = [...dm.AlcoholRelatedInfo.AlcoholFrequency];
                              list[idx] = nr; 
                              setData({ ...data, DemographicAndMedicalInfo: { ...dm, AlcoholRelatedInfo: { ...dm.AlcoholRelatedInfo, AlcoholFrequency: list } } });
                            }} onRemove={() => {
                              const list = [...dm.AlcoholRelatedInfo.AlcoholFrequency];
                              list.splice(idx, 1); 
                              setData({ ...data, DemographicAndMedicalInfo: { ...dm, AlcoholRelatedInfo: { ...dm.AlcoholRelatedInfo, AlcoholFrequency: list } } });
                            }} />
                          ))}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setData({ ...data, DemographicAndMedicalInfo: { ...dm, AlcoholRelatedInfo: { ...dm.AlcoholRelatedInfo, AlcoholFrequency: [...dm.AlcoholRelatedInfo.AlcoholFrequency, { Id: crypto.randomUUID(), AlcoholType: null, Frequency: null }] } } })}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('+ Add')}
                          </Button>
                        </div>
                      </Row>
                    </>
                  )}
                  {errsAl.length > 0 && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        <ul className="list-disc pl-5 space-y-1">
                          {errsAl.map((e, i) => (<li key={i}>{e}</li>))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </Section>

                <Section title="TobaccoRelatedInfo">
                  <Row label="Use Tobacco?">
                    <YesNo name="tob" value={dm.TobaccoRelatedInfo.UseTobacco} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, TobaccoRelatedInfo: { ...dm.TobaccoRelatedInfo, UseTobacco: v } } })} />
                  </Row>
                  {dm.TobaccoRelatedInfo.UseTobacco === true && (
                    <>
                      <Row label="Total Years">
                        <Input type="number" value={dm.TobaccoRelatedInfo.TobaccoTotalYears ?? ''} onChange={(e) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, TobaccoRelatedInfo: { ...dm.TobaccoRelatedInfo, TobaccoTotalYears: e.target.value ? Number(e.target.value) : null } } })} />
                      </Row>
                      <Row label="Frequency Rows">
                        <div className="grid gap-3">
                          {dm.TobaccoRelatedInfo.TobaccoFrequency.map((r, idx) => (
                            <TFRow key={r.Id} row={r} onChange={(nr) => {
                              const list = [...dm.TobaccoRelatedInfo.TobaccoFrequency];
                              list[idx] = nr; 
                              setData({ ...data, DemographicAndMedicalInfo: { ...dm, TobaccoRelatedInfo: { ...dm.TobaccoRelatedInfo, TobaccoFrequency: list } } });
                            }} onRemove={() => {
                              const list = [...dm.TobaccoRelatedInfo.TobaccoFrequency];
                              list.splice(idx, 1); 
                              setData({ ...data, DemographicAndMedicalInfo: { ...dm, TobaccoRelatedInfo: { ...dm.TobaccoRelatedInfo, TobaccoFrequency: list } } });
                            }} />
                          ))}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setData({ ...data, DemographicAndMedicalInfo: { ...dm, TobaccoRelatedInfo: { ...dm.TobaccoRelatedInfo, TobaccoFrequency: [...dm.TobaccoRelatedInfo.TobaccoFrequency, { Id: crypto.randomUUID(), TobaccoType: null, Frequency: null }] } } })}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('+ Add')}
                          </Button>
                        </div>
                      </Row>
                    </>
                  )}
                  {errsTo.length > 0 && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        <ul className="list-disc pl-5 space-y-1">
                          {errsTo.map((e, i) => (<li key={i}>{e}</li>))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </Section>

                <Section title="DrugRelatedInfo">
                  <Row label="Use Drugs?">
                    <YesNo name="drg" value={dm.DrugRelatedInfo.UseDrugs} onChange={(v) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, DrugRelatedInfo: { ...dm.DrugRelatedInfo, UseDrugs: v } } })} />
                  </Row>
                  {dm.DrugRelatedInfo.UseDrugs === true && (
                    <>
                      <Row label="Total Years">
                        <Input type="number" value={dm.DrugRelatedInfo.DrugsTotalYears ?? ''} onChange={(e) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, DrugRelatedInfo: { ...dm.DrugRelatedInfo, DrugsTotalYears: e.target.value ? Number(e.target.value) : null } } })} />
                      </Row>
                      <Row label="Frequency Rows">
                        <div className="grid gap-3">
                          {dm.DrugRelatedInfo.DrugFrequency.map((r, idx) => (
                            <DFRow key={r.Id} row={r} onChange={(nr) => {
                              const list = [...dm.DrugRelatedInfo.DrugFrequency];
                              list[idx] = nr; 
                              setData({ ...data, DemographicAndMedicalInfo: { ...dm, DrugRelatedInfo: { ...dm.DrugRelatedInfo, DrugFrequency: list } } });
                            }} onRemove={() => {
                              const list = [...dm.DrugRelatedInfo.DrugFrequency];
                              list.splice(idx, 1); 
                              setData({ ...data, DemographicAndMedicalInfo: { ...dm, DrugRelatedInfo: { ...dm.DrugRelatedInfo, DrugFrequency: list } } });
                            }} />
                          ))}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setData({ ...data, DemographicAndMedicalInfo: { ...dm, DrugRelatedInfo: { ...dm.DrugRelatedInfo, DrugFrequency: [...dm.DrugRelatedInfo.DrugFrequency, { Id: crypto.randomUUID(), DrugType: null, Frequency: null }] } } })}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('+ Add')}
                          </Button>
                        </div>
                      </Row>
                    </>
                  )}
                  {errsDr.length > 0 && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        <ul className="list-disc pl-5 space-y-1">
                          {errsDr.map((e, i) => (<li key={i}>{e}</li>))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </Section>
              </>
            )}

            {/* Genetics */}
            {active === 'genetics' && (
              <Section title="Genetics Conditions">
                <div className="grid md:grid-cols-2 gap-4">
                  {/**
                   * We render a generic list of toggle + relation pairs.
                   * Provide a localized label map if needed.
                   */}
                  {geneticFlagRelationPairs.map(([flag, rel]) => (
                    <div key={flag} className="rounded-xl border p-4 dark:border-neutral-800">
                      <div className="text-sm font-medium mb-2">{spaceEnumName((flag as string).replace(/^Has/, ''))}</div>
                      <YesNo name={flag as string} value={data.GeneticsCondition[flag as string] === 'true'} onChange={(v) => setData({ ...data, GeneticsCondition: { ...data.GeneticsCondition, [flag as string]: v ? 'true' : 'false' } })} />
                      <div className="mt-3">
                        <EnumSelect enumType="FamilyRelationEnum" value={data.GeneticsCondition[rel as string] ?? null} onChange={(v) => setData({ ...data, GeneticsCondition: { ...data.GeneticsCondition, [rel as string]: v } })} disabled={data.GeneticsCondition[flag as string] !== 'true'} />
                      </div>
                    </div>
                  ))}
                </div>
                {errsGen.length > 0 && (<ul className="mt-3 list-disc pl-5 text-sm text-red-600">{errsGen.map((e, i) => (<li key={i}>{e}</li>))}</ul>)}
              </Section>
            )}

            {/* Gs & Ps */}
            {active === 'gsps' && (
              <Section title="Gs & Ps Title" description="Gestationals and Pregnancies History">
                <div className="grid gap-3">
                  {data.GsPs.map((r, idx) => (
                    <GsPsRow 
                      key={idx} 
                      row={r} 
                      onChange={(nr) => { 
                        const list = [...data.GsPs]; 
                        list[idx] = nr; 
                        setData({ ...data, GsPs: list }); 
                      }} 
                      onRemove={() => { 
                        const list = [...data.GsPs]; 
                        list.splice(idx, 1); 
                        setData({ ...data, GsPs: list }); 
                      }} 
                    />
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setData({ 
                      ...data, 
                      GsPs: [...data.GsPs, { 
                        Year: null, 
                        WeeksOfDelivery: null, 
                        BabyWeight: null, 
                        Complications: null, 
                        BloodPressureSystolic: null, 
                        BloodPressureDiastolic: null 
                      }] 
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('+ Add Record')}
                  </Button>
                  {errsGs.length > 0 && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        <ul className="list-disc pl-5 space-y-1">
                          {errsGs.map((e, i) => (<li key={i}>{e}</li>))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </Section>
            )}

            {/* Review */}
            {active === 'review' && (
              <>
                <Section title="Other">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Row label="Has Child With Other Birth Defects?">
                      <YesNo 
                        name="childdef" 
                        value={data.HasChildWithOtherBirthDefects} 
                        onChange={(v) => setData({ ...data, HasChildWithOtherBirthDefects: v })} 
                      />
                    </Row>
                    <Row label="Other Information">
                      <Textarea 
                        value={data.OtherInformation ?? ''} 
                        onChange={(e) => setData({ ...data, OtherInformation: e.target.value || null })} 
                        maxLength={1000} 
                        rows={5}
                        className="resize-none"
                      />
                    </Row>
                  </div>
                </Section>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('Live JSON (QuestionnaireReviewDto)')}</CardTitle>
                    <CardDescription>Current form data in JSON format</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="rounded-lg bg-muted p-4 overflow-auto text-xs max-h-96">
                        {JSON.stringify(data, null, 2)}
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                        }}
                      >
                        Copy JSON
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Form Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Employment Status</p>
                        <p className="text-lg font-semibold">
                          {dm.IsEmployed === true ? 'Employed' : dm.IsEmployed === false ? 'Unemployed' : 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Insurance</p>
                        <p className="text-lg font-semibold">
                          {dm.HaveInsurance === true ? 'Yes' : dm.HaveInsurance === false ? 'No' : 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ultrasounds</p>
                        <p className="text-lg font-semibold">
                          {dm.HasOtherUltrasoundThisPregnancy?.length || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Gs & Ps Records</p>
                        <p className="text-lg font-semibold">
                          {data.GsPs.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </motion.div>

          {/* Footer actions */}
          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <Button 
              variant="outline" 
              onClick={goPrev} 
              disabled={stepIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t('Previous')}
            </Button>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={() => { 
                  console.log('Submitting form:', data);
                  // Handle submit
                }}
              >
                {t('Submit')}
              </Button>
              
              <Button 
                onClick={() => canNext() && goNext()} 
                disabled={!canNext()}
              >
                {stepIndex === steps.length - 1 ? t('Done') : t('Next')}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Validation Summary (Always visible) */}
          {(errsDem.length > 0 || errsStd.length > 0 || errsAl.length > 0 || errsDr.length > 0 || errsTo.length > 0 || errsGs.length > 0 || errsGen.length > 0) && (
            <Alert className="mt-4">
              <AlertDescription>
                <p className="font-semibold mb-2">Please review the following sections:</p>
                <div className="flex flex-wrap gap-2">
                  {errsDem.length > 0 && (
                    <Badge variant="destructive" className="cursor-pointer" onClick={() => setActive('demographics')}>
                      Demographics ({errsDem.length})
                    </Badge>
                  )}
                  {errsStd.length > 0 && (
                    <Badge variant="destructive" className="cursor-pointer" onClick={() => setActive('std_add')}>
                      STD Test ({errsStd.length})
                    </Badge>
                  )}
                  {errsAl.length > 0 && (
                    <Badge variant="destructive" className="cursor-pointer" onClick={() => setActive('std_add')}>
                      Alcohol ({errsAl.length})
                    </Badge>
                  )}
                  {errsDr.length > 0 && (
                    <Badge variant="destructive" className="cursor-pointer" onClick={() => setActive('std_add')}>
                      Drugs ({errsDr.length})
                    </Badge>
                  )}
                  {errsTo.length > 0 && (
                    <Badge variant="destructive" className="cursor-pointer" onClick={() => setActive('std_add')}>
                      Tobacco ({errsTo.length})
                    </Badge>
                  )}
                  {errsGs.length > 0 && (
                    <Badge variant="destructive" className="cursor-pointer" onClick={() => setActive('gsps')}>
                      Gs & Ps ({errsGs.length})
                    </Badge>
                  )}
                  {errsGen.length > 0 && (
                    <Badge variant="destructive" className="cursor-pointer" onClick={() => setActive('genetics')}>
                      Genetics ({errsGen.length})
                    </Badge>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </I18nContext.Provider>
  );
}