export interface Contact {
  _id: string;
  name: string;
  type: string[];
  email?: string;
  mobile?: string;
  address?: {
    city?: string;
    state?: string;
    pincode?: string;
  };
  profileImageURL?: string;
  createdAt: string;
  updatedAt: string;
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
