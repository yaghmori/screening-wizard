'use client';

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Button, Progress, Badge, Alert, AlertDescription, Input, Textarea, CalendarPicker } from '@/components/ui';
import { cn } from '@/components/ui';

// Import helper components and types
import { Section, Row, YesNo, EnumSelect, MultiSelect } from '@/components/StepComponents';
import { DatePlaceRow, GsPsRow, AFRow, DFRow, TFRow } from '@/components/StepRowComponents';

// Import types and interfaces
import { 
  QuestionnaireReviewDto, 
  DemographicAndMedicalInfoReviewDto,
  GeneticsConditionDto,
  GsPsDto,
  DatePlaceDto,
  AlcoholFrequencyDto,
  DrugFrequencyDto,
  TobaccoFrequencyDto
} from '../types/questionnaire';

// Import validation functions
import { 
  valDemographic, 
  valStdAdd, 
  alcoholErrors, 
  drugErrors, 
  tobaccoErrors, 
  valGsPs, 
  valGenetics 
} from '@/lib/validation';

// Import genetic flag relation pairs
import { geneticFlagRelationPairs } from '@/lib/constants';

// Import i18n context
import { I18nContext, messages } from '../contexts/I18nContext';

// Helper function
function spaceEnumName(name: string) { 
  return name.replace(/([a-z])([A-Z])/g, '$1 $2'); 
}

interface StepsProps {
  active: string;
  data: QuestionnaireReviewDto;
  setData: React.Dispatch<React.SetStateAction<QuestionnaireReviewDto>>;
  steps: ReadonlyArray<{ key: string; title: string }>;
  stepIndex: number;
  onStepChange?: (step: string) => void;
}

export function Steps({ active, data, setData, steps, stepIndex, onStepChange }: StepsProps) {
  const { t } = useContext(I18nContext);
  const dm = data.DemographicAndMedicalInfo;

  // Validation errors
  const errsDem = valDemographic(data.DemographicAndMedicalInfo);
  const errsStd = valStdAdd(data.DemographicAndMedicalInfo);
  const errsAl = alcoholErrors(data.DemographicAndMedicalInfo.AlcoholRelatedInfo);
  const errsDr = drugErrors(data.DemographicAndMedicalInfo.DrugRelatedInfo);
  const errsTo = tobaccoErrors(data.DemographicAndMedicalInfo.TobaccoRelatedInfo);
  const errsGs = valGsPs(data.GsPs);
  const errsGen = valGenetics(data.GeneticsCondition);



  return (
    <>
      {/* Progress and Tabs */}
      <div className="mb-8">
        <Progress value={((stepIndex + 1) / steps.length) * 100} className="mb-4" />
        <div className="flex flex-wrap gap-2">
          {steps.map((s, i) => (
            <Button
              key={s.key}
              variant={active === s.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStepChange?.(s.key)}
              className={`gap-2 ${active === s.key ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-foreground border-gray-200 hover:bg-gray-50'}`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                active === s.key 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
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
                <CalendarPicker 
                  value={dm.LastHospitalAdmissionDate} 
                  onChange={(value) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, LastHospitalAdmissionDate: value } })} 
                />
              </Row>
              <Row label="Hospital Admission Reason">
                <Input value={dm.HospitalAdmissionReason ?? ''} onChange={(e) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, HospitalAdmissionReason: e.target.value || null } })} />
              </Row>
              <Row label="Last ER Visit Date">
                <CalendarPicker 
                  value={dm.LastERVisitDate} 
                  onChange={(value) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, LastERVisitDate: value } })} 
                />
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

            <div className="my-4 border-t" />
            
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
                  + Add Ultrasound
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
                  <CalendarPicker 
                    value={dm.StdTestDate} 
                    onChange={(value) => setData({ ...data, DemographicAndMedicalInfo: { ...dm, StdTestDate: value } })} 
                  />
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
                    <div className="space-y-4">
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
                        className="w-full sm:w-auto hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        Add Alcohol Frequency
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
                    <div className="space-y-4">
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
                        className="w-full sm:w-auto hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        Add Tobacco Frequency
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
                    <div className="space-y-4">
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
                        className="w-full sm:w-auto hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        Add Drug Frequency
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
              {geneticFlagRelationPairs.map(([flag, rel]) => (
                <div key={flag} className="rounded-xl border p-4 dark:border-neutral-800">
                  <div className="text-sm font-medium mb-2">{spaceEnumName((flag as string).replace(/^Has/, ''))}</div>
                  <YesNo 
                    name={flag as string} 
                    value={data.GeneticsCondition[flag as string] === 'true' ? true : data.GeneticsCondition[flag as string] === 'false' ? false : null} 
                    onChange={(v) => setData({ 
                      ...data, 
                      GeneticsCondition: { 
                        ...data.GeneticsCondition, 
                        [flag as string]: v === null ? null : v ? 'true' : 'false',
                        [rel as string]: v === false ? null : data.GeneticsCondition[rel as string]
                      } 
                    })} 
                  />
                  <div className="mt-3">
                    <EnumSelect 
                      enumType="FamilyRelationEnum" 
                      value={data.GeneticsCondition[rel as string] ?? null} 
                      onChange={(v) => setData({ ...data, GeneticsCondition: { ...data.GeneticsCondition, [rel as string]: v } })} 
                      disabled={data.GeneticsCondition[flag as string] !== 'true'} 
                      placeholder={data.GeneticsCondition[flag as string] === 'true' ? 'Select relation...' : 'Select Yes above first'}
                    />
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
                + Add Record
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
                  <textarea 
                    value={data.OtherInformation ?? ''} 
                    onChange={(e) => setData({ ...data, OtherInformation: e.target.value || null })} 
                    maxLength={1000} 
                    rows={5}
                    className="resize-none"
                  />
                </Row>
              </div>
            </Section>

            <div className="bg-card border rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{t('Live JSON (QuestionnaireReviewDto)')}</h3>
                <p className="text-sm text-muted-foreground">Current form data in JSON format</p>
              </div>
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
            </div>

            {/* Summary Statistics */}
            <div className="bg-card border rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Form Summary</h3>
              </div>
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
            </div>
          </>
        )}
      </motion.div>

             {/* Validation Summary (Always visible) */}
       {(errsDem.length > 0 || errsStd.length > 0 || errsAl.length > 0 || errsDr.length > 0 || errsTo.length > 0 || errsGs.length > 0 || errsGen.length > 0) && (
         <Alert className="mt-4">
           <AlertDescription>
             <p className="font-semibold mb-2">Please review the following sections:</p>
                          <div className="flex flex-wrap gap-2">
               {errsDem.length > 0 && (
                 <Badge variant="secondary" className="cursor-pointer bg-orange-100 text-orange-800 hover:bg-orange-200" onClick={() => onStepChange?.('demographics')}>
                   Demographics ({errsDem.length})
                 </Badge>
               )}
                                 {errsStd.length > 0 && (
                     <Badge variant="secondary" className="cursor-pointer bg-orange-100 text-orange-800 hover:bg-orange-200" onClick={() => onStepChange?.('std_add')}>
                       STD Test ({errsStd.length})
                     </Badge>
                   )}
                   {errsAl.length > 0 && (
                     <Badge variant="secondary" className="cursor-pointer bg-orange-100 text-orange-800 hover:bg-orange-200" onClick={() => onStepChange?.('std_add')}>
                       Alcohol ({errsAl.length})
                     </Badge>
                   )}
                   {errsDr.length > 0 && (
                     <Badge variant="secondary" className="cursor-pointer bg-orange-100 text-orange-800 hover:bg-orange-200" onClick={() => onStepChange?.('std_add')}>
                       Drugs ({errsDr.length})
                     </Badge>
                   )}
                   {errsTo.length > 0 && (
                     <Badge variant="secondary" className="cursor-pointer bg-orange-100 text-orange-800 hover:bg-orange-200" onClick={() => onStepChange?.('std_add')}>
                       Tobacco ({errsTo.length})
                     </Badge>
                   )}
                   {errsGs.length > 0 && (
                     <Badge variant="secondary" className="cursor-pointer bg-orange-100 text-orange-800 hover:bg-orange-200" onClick={() => onStepChange?.('gsps')}>
                       Gs & Ps ({errsGs.length})
                     </Badge>
                   )}
                   {errsGen.length > 0 && (
                     <Badge variant="secondary" className="cursor-pointer bg-orange-100 text-orange-800 hover:bg-orange-200" onClick={() => onStepChange?.('genetics')}>
                       Genetics ({errsGen.length})
                     </Badge>
                   )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
