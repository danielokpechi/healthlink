import { useEffect, useMemo, useState } from 'react';
import { db } from "../firebase";
import {
  collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc, serverTimestamp
} from 'firebase/firestore';

export type InventoryItem = { type: string; price: number; quantity: number; available: boolean };

export function useInventory(bloodBankId?: string) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bloodBankId) return;
    const q = query(collection(db, 'blood_banks', bloodBankId, 'inventory'), orderBy('__name__'));
    const unsub = onSnapshot(q, (snap) => {
      const rows: InventoryItem[] = snap.docs.map((d) => ({ type: d.id, ...(d.data() as any) }));
      setItems(rows);
      setLoading(false);
    });
    return () => unsub();
  }, [bloodBankId]);

  // --- auto-update helpers (debounced where helpful) ---
  const updateQuantity = async (type: string, quantity: number) => {
    if (!bloodBankId) return;
    const ref = doc(db, 'blood_banks', bloodBankId, 'inventory', type);
    await updateDoc(ref, { quantity: Math.max(0, Math.floor(quantity)), updatedAt: serverTimestamp() });
  };

  const updatePrice = async (type: string, price: number) => {
    if (!bloodBankId) return;
    const ref = doc(db, 'blood_banks', bloodBankId, 'inventory', type);
    await updateDoc(ref, { price: Math.max(0, Math.floor(price)), updatedAt: serverTimestamp() });
  };

  const toggleAvailability = async (type: string, available: boolean) => {
    if (!bloodBankId) return;
    const ref = doc(db, 'blood_banks', bloodBankId, 'inventory', type);
    await updateDoc(ref, { available, updatedAt: serverTimestamp() });
  };

  const addStock = async (type: string, data: { price: number; quantity: number; available: boolean }) => {
    if (!bloodBankId) return;
    const ref = doc(db, 'blood_banks', bloodBankId, 'inventory', type);
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  };

  return { items, loading, updateQuantity, updatePrice, toggleAvailability, addStock };
}

// Stock-level helper (unchanged)
export function getStockLevel(quantity: number) {
  if (quantity === 0) return { label: 'Out of Stock', color: 'danger' as const };
  if (quantity < 5)  return { label: 'Critical',    color: 'danger' as const };
  if (quantity < 10) return { label: 'Low Stock',   color: 'warning' as const };
  return { label: 'Good Stock', color: 'success' as const };
}
