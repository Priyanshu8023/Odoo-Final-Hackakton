export interface Tax {
  id: string;
  taxName: string;
  taxPercentage: number;
  description?: string;
  computation?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaxFormData {
  taxName: string;
  taxPercentage: number;
  description?: string;
  computation?: string;
  isActive: boolean;
}

export interface TaxComputation {
  id: string;
  name: string;
  description: string;
  formula: string;
}
