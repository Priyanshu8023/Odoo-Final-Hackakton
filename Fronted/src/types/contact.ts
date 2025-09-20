export interface Contact {
  id: string;
  name: string;
  email: string;
  mobileNo: string;
  address: string;
  gstNo?: string;
  panNo?: string;
  bankName?: string;
  accountNo?: string;
  ifscCode?: string;
  profileImage?: string; // Base64 string or URL
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactFormData {
  name: string;
  email: string;
  mobileNo: string;
  address: string;
  gstNo?: string;
  panNo?: string;
  bankName?: string;
  accountNo?: string;
  ifscCode?: string;
  profileImage?: string; // Base64 string or URL
}
