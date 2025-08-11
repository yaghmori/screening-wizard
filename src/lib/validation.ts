import { 
  DemographicAndMedicalInfoReviewDto, 
  GeneticsConditionDto, 
  GsPsDto,
  AlcoholRelatedInfoDto,
  DrugRelatedInfoDto,
  TobaccoRelatedInfoDto
} from '../types/questionnaire';

// ===== Validation helpers =====
function notFuture(date: string | null) { 
  return !date || new Date(date) <= new Date(); 
}

export function valDemographic(m: DemographicAndMedicalInfoReviewDto) {
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

export function valGenetics(gen: GeneticsConditionDto) {
  const e: string[] = [];
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
  ];

  for (const [flag] of geneticFlagRelationPairs) {
    const v = gen[flag];
    if (v == null) {
      const label = flag.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^Has/, '');
      e.push(`${label} is required. Please select Yes or No.`);
    } else if (v === 'true') {
      // If Yes is selected, check if relation is provided
      const relKey = geneticFlagRelationPairs.find(([f]) => f === flag)?.[1];
      if (relKey && !gen[relKey]) {
        const label = flag.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^Has/, '');
        e.push(`${label} relation is required when Yes is selected.`);
      }
    }
  }
  return e;
}

export function valStdAdd(m: DemographicAndMedicalInfoReviewDto) {
  const e: string[] = [];
  if (m.HaveStdTest === true) {
    if (!m.StdTestDate) e.push('StdTestDate is required when HaveStdTest = Yes.');
    if (!m.StdTestResult) e.push('StdTestResult is required when HaveStdTest = Yes.');
    if (m.StdTestResult === 'Positive' && (!m.StdTypes || !m.StdTypes.length)) e.push('StdTypes required when StdTestResult = Positive.');
  }
  if (m.HaveCrampingBleeding == null) e.push('HaveCrampingBleeding is required.');
  return e;
}

export function alcoholErrors(a: AlcoholRelatedInfoDto) {
  const errs: string[] = [];
  if (a.UseAlcohol == null) errs.push('UseAlcohol is required.');
  if (a.UseAlcohol === true) {
    if (!a.AlcoholFrequency.length) errs.push('AlcoholFrequency required when UseAlcohol = Yes.');
    if (a.AlcoholTotalYears == null) errs.push('AlcoholTotalYears required when UseAlcohol = Yes.');
  }
  return errs;
}

export function drugErrors(d: DrugRelatedInfoDto) {
  const errs: string[] = [];
  if (d.UseDrugs == null) errs.push('UseDrugs is required.');
  if (d.UseDrugs === true) {
    if (!d.DrugFrequency.length) errs.push('DrugFrequency required when UseDrugs = Yes.');
    if (d.DrugsTotalYears == null) errs.push('DrugsTotalYears required when UseDrugs = Yes.');
  }
  return errs;
}

export function tobaccoErrors(t: TobaccoRelatedInfoDto) {
  const errs: string[] = [];
  if (t.UseTobacco == null) errs.push('UseTobacco is required.');
  if (t.UseTobacco === true) {
    if (!t.TobaccoFrequency.length) errs.push('TobaccoFrequency required when UseTobacco = Yes.');
    if (t.TobaccoTotalYears == null) errs.push('TobaccoTotalYears required when UseTobacco = Yes.');
  }
  return errs;
}

export function valGsPs(list: GsPsDto[]) {
  const e: string[] = [];
  list.forEach((x, i) => {
    if (x.BloodPressureSystolic != null && x.BloodPressureDiastolic != null && !(x.BloodPressureDiastolic < x.BloodPressureSystolic)) {
      e.push(`GsPs row ${i + 1}: Diastolic must be less than systolic.`);
    }
  });
  return e;
}
