// ===== DTO shapes (strict names) =====
export interface DatePlaceDto { 
  Date: string | null; 
  Place: string | null 
}

export interface DemographicAndMedicalInfoDto {
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

export interface AlcoholFrequencyDto { 
  Id: string; 
  AlcoholType: string | null; 
  Frequency: string | null 
}

export interface DrugFrequencyDto { 
  Id: string; 
  DrugType: string | null; 
  Frequency: string | null 
}

export interface TobaccoFrequencyDto { 
  Id: string; 
  TobaccoType: string | null; 
  Frequency: string | null 
}

export interface AlcoholRelatedInfoDto { 
  UseAlcohol: boolean | null; 
  AlcoholFrequency: AlcoholFrequencyDto[]; 
  AlcoholQuitDate: string | null; 
  AlcoholTotalYears: number | null 
}

export interface DrugRelatedInfoDto { 
  UseDrugs: boolean | null; 
  DrugFrequency: DrugFrequencyDto[]; 
  DrugsQuitDate: string | null; 
  DrugsTotalYears: number | null 
}

export interface TobaccoRelatedInfoDto { 
  UseTobacco: boolean | null; 
  TobaccoFrequency: TobaccoFrequencyDto[]; 
  TobaccoQuitDate: string | null; 
  TobaccoTotalYears: number | null 
}

export interface DemographicAndMedicalInfoReviewDto extends DemographicAndMedicalInfoDto {
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

export interface GeneticsConditionDto { 
  [key: string]: string | null 
}

export interface GsPsDto {
  Year: number | null;
  WeeksOfDelivery: number | null;
  BabyWeight: number | null;
  Complications: string | null;
  BloodPressureSystolic: number | null;
  BloodPressureDiastolic: number | null;
}

export interface QuestionnaireReviewDto {
  DemographicAndMedicalInfo: DemographicAndMedicalInfoReviewDto;
  GeneticsCondition: GeneticsConditionDto;
  GsPs: GsPsDto[];
  HasChildWithOtherBirthDefects: boolean | null;
  OtherInformation: string | null;
}
