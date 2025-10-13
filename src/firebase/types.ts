// Base user profile
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

// Blood Bank / Facility specific data
export interface BloodBank {
  id: string;
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  approved: boolean; // vetted offline before login
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

// Resource Request
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

// Transaction record
export interface Transaction {
  id: string;
  requestId: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  paymentMethod?: string;
  createdAt?: any;
  updatedAt?: any;
}
