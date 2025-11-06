export type User = {
  uid: string;
  fullName: string;
  email: string;
  userType: 'donor' | 'bloodbank' | 'superadmin';
  phone?: string;
  address?: string;
  createdAt?: any;
  updatedAt?: any;
  [key: string]: any;
};

export interface BloodBank {
  id: string;
  name: string;
  licenseNumber: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  approved: boolean; 
  inventory: {
    [resourceType: string]: {
      quantity: number;
      pricePerUnit: number;
      lastUpdated: any;
    };
  };
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: any;
  updatedAt?: any;
}

export interface Request {
  id: string;
  userId: string;
  facilityId: string;
  resourceType: string;
  resourceDetails: {
    type: string;
    quantity: number;
    price: number;
  };
  status: 'pending' | 'completed' | 'rejected';
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Transaction {
  id: string;
  requestId: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  paymentMethod?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Donation {
  id: string;
  fullName: string;
  bloodType: string;
  phone: string;
  donorEmail: string;
  requestTime: string;
  status: 'pending' | 'completed' | 'rejected';
  notes?: string;
  createdAt?: any;
  // updatedAt?: any;
  preferredDate: string;
  emergencyContact: string;
  lastDonation: string;
  preferredTime?: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodType: string;
  quantity: number;
  urgency: string;
  totalAmount: number;
  contactNumber: string;
  createdAt: Date
  status: 'pending' | 'completed' | 'rejected';
  medicalCondition: string;
}
 export interface  BloodTypeData {
  type: string;
  quantity: number;
  price: number;
  status: string;
};