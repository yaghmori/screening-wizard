'use client';

import React, { useContext } from 'react';
import { Trash2 } from 'lucide-react';
import { Button, Input, CalendarPicker } from '@/components/ui';
import { EnumSelect, Row } from './StepComponents';
import { I18nContext } from '../contexts/I18nContext';
import { 
  DatePlaceDto, 
  GsPsDto, 
  AlcoholFrequencyDto, 
  DrugFrequencyDto, 
  TobaccoFrequencyDto 
} from '../types/questionnaire';

// ===== Repeater rows =====
export function DatePlaceRow({ row, onChange, onRemove }: { 
  row: DatePlaceDto; 
  onChange: (r: DatePlaceDto) => void; 
  onRemove: () => void 
}) {
  const { t } = useContext(I18nContext);
  return (
    <div className="grid md:grid-cols-3 gap-3 items-end p-4 border rounded-lg">
      <Row label="Date">
        <CalendarPicker 
          value={row.Date} 
          onChange={(value) => onChange({ ...row, Date: value })} 
        />
      </Row>
      <Row label="Place">
        <Input 
          value={row.Place ?? ''} 
          onChange={(e) => onChange({ ...row, Place: e.target.value || null })} 
        />
      </Row>
      <Button variant="outline" size="icon" onClick={onRemove}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function GsPsRow({ row, onChange, onRemove }: { 
  row: GsPsDto; 
  onChange: (r: GsPsDto) => void; 
  onRemove: () => void 
}) {
  const { t } = useContext(I18nContext);
  return (
    <div className="grid md:grid-cols-7 gap-3 items-end p-4 border rounded-lg">
      <Row label="Year">
        <Input 
          type="number" 
          value={row.Year ?? ''} 
          onChange={(e) => onChange({ ...row, Year: e.target.value ? Number(e.target.value) : null })} 
        />
      </Row>
      <Row label="WeeksOfDelivery">
        <Input 
          type="number" 
          value={row.WeeksOfDelivery ?? ''} 
          onChange={(e) => onChange({ ...row, WeeksOfDelivery: e.target.value ? Number(e.target.value) : null })} 
        />
      </Row>
      <Row label="BabyWeight">
        <Input 
          type="number" 
          step="0.01" 
          value={row.BabyWeight ?? ''} 
          onChange={(e) => onChange({ ...row, BabyWeight: e.target.value ? Number(e.target.value) : null })} 
        />
      </Row>
      <Row label="Complications">
        <Input 
          value={row.Complications ?? ''} 
          onChange={(e) => onChange({ ...row, Complications: e.target.value || null })} 
        />
      </Row>
      <Row label="BP Systolic">
        <Input 
          type="number" 
          value={row.BloodPressureSystolic ?? ''} 
          onChange={(e) => onChange({ ...row, BloodPressureSystolic: e.target.value ? Number(e.target.value) : null })} 
        />
      </Row>
      <Row label="BP Diastolic">
        <Input 
          type="number" 
          value={row.BloodPressureDiastolic ?? ''} 
          onChange={(e) => onChange({ ...row, BloodPressureDiastolic: e.target.value ? Number(e.target.value) : null })} 
        />
      </Row>
      <Button variant="outline" size="icon" onClick={onRemove}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function AFRow({ row, onChange, onRemove }: { 
  row: AlcoholFrequencyDto; 
  onChange: (r: AlcoholFrequencyDto) => void; 
  onRemove: () => void 
}) {
  const { t } = useContext(I18nContext);
  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm">
      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Alcohol Type</label>
          <EnumSelect 
            enumType="AlcoholTypeEnum" 
            value={row.AlcoholType} 
            onChange={(v) => onChange({ ...row, AlcoholType: v })} 
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Frequency</label>
          <EnumSelect 
            enumType="FrequencyEnum" 
            value={row.Frequency} 
            onChange={(v) => onChange({ ...row, Frequency: v })} 
          />
        </div>
        <div className="flex-shrink-0">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onRemove}
            className="h-10 w-10 bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 hover:text-red-700 transition-all duration-200 shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DFRow({ row, onChange, onRemove }: { 
  row: DrugFrequencyDto; 
  onChange: (r: DrugFrequencyDto) => void; 
  onRemove: () => void 
}) {
  const { t } = useContext(I18nContext);
  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm">
      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Drug Type</label>
          <EnumSelect 
            enumType="DrugTypeEnum" 
            value={row.DrugType} 
            onChange={(v) => onChange({ ...row, DrugType: v })} 
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Frequency</label>
          <EnumSelect 
            enumType="FrequencyEnum" 
            value={row.Frequency} 
            onChange={(v) => onChange({ ...row, Frequency: v })} 
          />
        </div>
        <div className="flex-shrink-0">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onRemove}
            className="h-10 w-10 bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 hover:text-red-700 transition-all duration-200 shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TFRow({ row, onChange, onRemove }: { 
  row: TobaccoFrequencyDto; 
  onChange: (r: TobaccoFrequencyDto) => void; 
  onRemove: () => void 
}) {
  const { t } = useContext(I18nContext);
  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm">
      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Tobacco Type</label>
          <EnumSelect 
            enumType="TobaccoTypeEnum" 
            value={row.TobaccoType} 
            onChange={(v) => onChange({ ...row, TobaccoType: v })} 
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Frequency</label>
          <EnumSelect 
            enumType="FrequencyEnum" 
            value={row.Frequency} 
            onChange={(v) => onChange({ ...row, Frequency: v })} 
          />
        </div>
        <div className="flex-shrink-0">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onRemove}
            className="h-10 w-10 bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 hover:text-red-700 transition-all duration-200 shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
