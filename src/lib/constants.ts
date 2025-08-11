// Shared genetics flags + relation field pairs
export const geneticFlagRelationPairs: ReadonlyArray<[string, string]> = [
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
