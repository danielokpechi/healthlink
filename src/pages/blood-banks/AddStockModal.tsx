import { useState } from 'react';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';

const BLOOD_TYPES = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

export default function AddStockModal({
  open, onClose, onCreate
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: { type: string; quantity: number; price: number; available: boolean }) => Promise<void>;
}) {
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(15000);
  const [available, setAvailable] = useState(true);
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onCreate({ type, quantity, price, available });
      onClose();
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <Card className="w-full max-w-lg p-6 text-black shadow-2xl">
        <h3 className="text-xl font-bold mb-4">Add Stock</h3>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Blood Type</label>
            <select className="w-full input-glass p-3 rounded-xl"
                    value={type} onChange={(e)=>setType(e.target.value)} required>
              <option value="">Select blood type</option>
              {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Quantity (pints)</label>
              <input type="number" min={0} value={quantity}
                     onChange={(e)=>setQuantity(Number(e.target.value))}
                     className="w-full input-glass p-3 rounded-xl" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price per Unit (₦)</label>
              <input type="number" min={0} step={500} value={price}
                     onChange={(e)=>setPrice(Number(e.target.value))}
                     className="w-full input-glass p-3 rounded-xl" required />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Available</span>
            <button type="button"
              onClick={()=>setAvailable(!available)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${available?'bg-pink-500':'bg-gray-300'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white ${available?'translate-x-6':'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={busy}>
              {busy ? 'Saving…' : 'Add'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
