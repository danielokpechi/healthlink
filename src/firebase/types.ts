
// src/firebase/types.ts
import { Timestamp } from 'firebase/firestore';

// Base user profile
export interface User {
  uid: string;
  fullName: string;
  email: string;
  userType: 'donor' | 'bloodBank' | 'superAdmin';
  phone?: string;
  address?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Blood Bank / Facility specific data
export interface BloodBank {
  id: string;
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  approved: boolean; // Vetted offline before they can log in
  inventory: {
    [resourceType: string]: {
      quantity: number;
      pricePerUnit: number;
      lastUpdated: Timestamp;
    };
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Resource Request
export interface Request {
  id: string;
  userId: string; // ID of the user making the request
  facilityId: string; // ID of the blood bank the request is for
  resourceType: string; // e.g., 'blood', 'oxygen', 'medicine'
  resourceDetails: {
    type: string; // e.g., 'O+', 'A-', 'Cylinder-5L'
    quantity: number;
    price: number;
  };
  status: 'pending' | 'completed' | 'rejected';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Transaction record
export interface Transaction {
  id: string;
  requestId: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  paymentMethod?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
