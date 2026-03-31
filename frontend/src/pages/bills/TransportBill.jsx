import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  Truck, MapPin, User, Package, Plus, Trash2,
  CheckCircle2, Loader2, ArrowLeft, ChevronDown, FileText, Calendar
} from 'lucide-react'
import { useBills } from '../../context/BillContext'
import { useParties } from '../../context/PartyContext'
import { useVehicles } from '../../context/VehicleContext'
import dayjs from 'dayjs'

function Field({ label, error, children, required, style }) {
  return (
    <div className="form-group" style={style}>
      <label className="form-label">
        {label}{required && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && <span className="form-error">{error.message}</span>}
    </div>
  )
}

function SectionCard({ icon: Icon, iconBg, iconColor, title, children }) {
  return (
    <div style={{
      background: 'white', borderRadius: 20, padding: '18px 18px 22px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 14,
      border: '1px solid rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color={iconColor} />
        </div>
        <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0F0D2E', margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

const PAYMENT_MODES = [
  { val: 'topay',   label: 'To Pay',   color: '#DC2626', bg: '#FEE2E2' },
  { val: 'paid',    label: 'Paid',     color: '#16A34A', bg: '#DCFCE7' },
  { val: 'tbb',     label: 'TBB',      color: '#D97706', bg: '#FEF3C7' },
]

export default function TransportBill() {
  const { addBill } = useBills()
  const { parties } = useParties()
  const { vehicles } = useVehicles()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [savedBill, setSavedBill] = useState(null)

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm({
    defaultValues: {
      billDate: dayjs().format('YYYY-MM-DD'),
      partyId: '',
      billedToName: '',
      billedToAddress: '',
      items: [
        { date: dayjs().format('YYYY-MM-DD'), companyFrom: 'RA', companyTo: '', chalanNo: '', amount: '' }
      ],
      loadingCharge: '0', unloadingCharge: '0',
      detentionCharge: '0', otherCharge: '0',
      gstPercent: '0', gstType: 'CGST+SGST',
      paymentMode: 'topay',
      notes: 'Grateful for Moving What Matters to You!',
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  })

  const watchedItems = watch('items')
  const paymentMode = watch('paymentMode')
  const loadingCharge   = watch('loadingCharge')
  const unloadingCharge = watch('unloadingCharge')
  const detentionCharge = watch('detentionCharge')
  const otherCharge     = watch('otherCharge')
  const gstPercent      = watch('gstPercent')

  // Auto-fill party details
  const partyId = watch('partyId')
  useEffect(() => {
    if (!partyId) return
    const p = parties.find(x => x.id === partyId)
    if (p) {
      setValue('billedToName', p.name)
      setValue('billedToAddress', p.address || '')
    }
  }, [partyId, parties, setValue])

  // Totals calculation
  const itemsTotal = (watchedItems || []).reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
  const otherChargesTotal = [loadingCharge, unloadingCharge, detentionCharge, otherCharge]
    .reduce((s, v) => s + (parseFloat(v) || 0), 0)
  
  const subtotal = itemsTotal + otherChargesTotal
  const gstAmount = subtotal * (parseFloat(gstPercent) || 0) / 100
  const grandTotal = subtotal + gstAmount

  const onSubmit = async (data) => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    const bill = addBill({
      type: 'transport',
      ...data,
      subtotal, 
      gstAmount, 
      grandTotal,
      status: data.paymentMode === 'paid' ? 'paid' : 'unpaid',
    })
    setSaving(false)
    setSavedBill(bill)
  }

  if (savedBill) return (
    <div className="page-wrapper animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, textAlign: 'center', padding: 24 }}>
      <div style={{ width: 68, height: 68, borderRadius: 20, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeInUp 0.3s ease both' }}>
        <CheckCircle2 size={36} color="#16A34A" />
      </div>
      <h2 style={{ fontWeight: 800, color: '#0F0D2E' }}>Bill Created!</h2>
      <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Invoice #{savedBill.invoiceNo} generated and saved.</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
        <button className="btn btn-primary" onClick={() => navigate(`/bills/${savedBill.id}`)}>
          <FileText size={16} /> View Invoice
        </button>
        <button className="btn btn-ghost" onClick={() => { setSavedBill(null); navigate('/bills/new'); }}>
          <Plus size={16} /> Create Another
        </button>
      </div>
    </div>
  )

  return (
    <div className="page-wrapper animate-fadeIn" style={{ maxWidth: 800, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate('/bills')} style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0F0D2E', margin: 0 }}>Transport Bill</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: 0 }}>Consolidated Billing Summary</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <input type="date" {...register('billDate')} className="form-input" style={{ fontSize: '0.85rem', padding: '8px 12px', borderRadius: 12, background: 'white' }} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* ── Billed To (Party) ── */}
        <SectionCard icon={User} iconBg="#EDE9FE" iconColor="#7C3AED" title="Billed To (Customer)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Select Party (Quick Fill)">
              <div style={{ position: 'relative' }}>
                <select {...register('partyId')} className="form-input" style={{ appearance: 'none', paddingRight: 36 }}>
                  <option value="">— Select party —</option>
                  {parties.map(p => <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>)}
                </select>
                <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
              </div>
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
              <Field label="Business Name" error={errors.billedToName} required>
                <input {...register('billedToName', { required: 'Required' })} placeholder="Party Name" className="form-input" />
              </Field>
              <Field label="Address">
                <input {...register('billedToAddress')} placeholder="Party Address" className="form-input" />
              </Field>
            </div>
          </div>
        </SectionCard>

        {/* ── Billing Summary (Multiple Items) ── */}
        <SectionCard icon={Truck} iconBg="#FEF3C7" iconColor="#D97706" title="Billing Summary (Trips / Chalans)">
          <div style={{ overflowX: 'auto', margin: '0 -18px', padding: '0 18px' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', minWidth: 600 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#6B7280', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <th style={{ padding: '0 8px' }}>Date</th>
                  <th style={{ padding: '0 8px' }}>From</th>
                  <th style={{ padding: '0 8px' }}>To</th>
                  <th style={{ padding: '0 8px' }}>Chalan No.</th>
                  <th style={{ padding: '0 8px' }}>Amount (₹)</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.05}s` }}>
                    <td style={{ padding: '0 4px' }}>
                      <input type="date" {...register(`items.${index}.date`)} className="form-input" style={{ fontSize: '0.8125rem', padding: '8px' }} />
                    </td>
                    <td style={{ padding: '0 4px' }}>
                      <input {...register(`items.${index}.companyFrom`)} placeholder="RA" className="form-input" style={{ fontSize: '0.8125rem', padding: '8px' }} />
                    </td>
                    <td style={{ padding: '0 4px' }}>
                      <input {...register(`items.${index}.companyTo`)} placeholder="Destination" className="form-input" style={{ fontSize: '0.8125rem', padding: '8px' }} />
                    </td>
                    <td style={{ padding: '0 4px' }}>
                      <input {...register(`items.${index}.chalanNo`)} placeholder="5642" className="form-input" style={{ fontSize: '0.8125rem', padding: '8px' }} />
                    </td>
                    <td style={{ padding: '0 4px' }}>
                      <div className="input-group">
                        <span className="input-prefix" style={{ fontSize: '0.75rem' }}>₹</span>
                        <input type="number" {...register(`items.${index}.amount`)} placeholder="1000" className="form-input" style={{ fontSize: '0.8125rem', padding: '8px' }} />
                      </div>
                    </td>
                    <td style={{ padding: '0 4px', textAlign: 'center' }}>
                      {fields.length > 1 && (
                        <button type="button" onClick={() => remove(index)} style={{ border: 'none', background: '#FEE2E2', color: '#DC2626', width: 28, height: 28, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => append({ date: dayjs().format('YYYY-MM-DD'), companyFrom: 'RA', companyTo: '', chalanNo: '', amount: '' })} 
            style={{ 
              marginTop: 12, width: '100%', padding: '10px', borderRadius: 12, border: '2px dashed #E5E7EB', 
              background: '#F9FAFB', fontWeight: 700, fontSize: '0.875rem', color: '#4F46E5', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: '0.2s'
            }} onMouseEnter={e => e.currentTarget.style.borderColor = '#4F46E5'} onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}>
            <Plus size={18} /> Add Another Trip
          </button>
        </SectionCard>

        {/* ── Other Charges & GST ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
          <SectionCard icon={FileText} iconBg="#FEE2E2" iconColor="#DC2626" title="Extra Charges">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { name: 'loadingCharge',   label: 'Loading (₹)' },
                { name: 'unloadingCharge', label: 'Unloading (₹)' },
                { name: 'detentionCharge', label: 'Detention (₹)' },
                { name: 'otherCharge',     label: 'Other (₹)' },
              ].map(c => (
                <Field key={c.name} label={c.label}>
                  <div className="input-group">
                    <span className="input-prefix">₹</span>
                    <input {...register(c.name)} type="number" placeholder="0" className="form-input" />
                  </div>
                </Field>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={FileText} iconBg="#DCFCE7" iconColor="#16A34A" title="Taxes & Totals">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <Field label="GST %">
                <select {...register('gstPercent')} className="form-input">
                  {['0','5','12','18'].map(g => <option key={g} value={g}>{g}%</option>)}
                </select>
              </Field>
              <Field label="GST Type">
                <select {...register('gstType')} className="form-input">
                  {['CGST+SGST','IGST'].map(g => <option key={g}>{g}</option>)}
                </select>
              </Field>
            </div>
            
            <div style={{ background: '#1E1B4B', borderRadius: 16, padding: '16px', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.875rem', opacity: 0.8 }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.875rem', opacity: 0.8 }}>
                <span>GST Amount</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 10, fontWeight: 800, fontSize: '1.25rem' }}>
                <span>Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── Payment & Notes ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14, marginBottom: 24 }}>
          <SectionCard icon={Calendar} iconBg="#EDE9FE" iconColor="#7C3AED" title="Payment Mode">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {PAYMENT_MODES.map(pm => {
                const isActive = paymentMode === pm.val
                return (
                  <button key={pm.val} type="button" onClick={() => setValue('paymentMode', pm.val)}
                    style={{
                      padding: '12px 6px', borderRadius: 12, border: isActive ? `2px solid ${pm.color}` : '2px solid transparent',
                      background: isActive ? pm.bg : '#F3F4F6', color: isActive ? pm.color : '#6B7280',
                      fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer', transition: '0.2s'
                    }}
                  >{pm.label}</button>
                )
              })}
            </div>
            <input type="hidden" {...register('paymentMode')} />
          </SectionCard>

          <div style={{ background: 'white', borderRadius: 20, padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <Field label="Notes / Slogan">
              <textarea {...register('notes')} className="form-input" style={{ minHeight: 70, fontSize: '0.875rem' }} />
            </Field>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
          <button type="button" className="btn btn-ghost btn-full" onClick={() => navigate('/bills')}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={saving}>
            {saving ? <><Loader2 size={18} className="spin" /> Generating…</> : <><FileText size={18} /> Generate Consolidated Bill</>}
          </button>
        </div>
      </form>

      <style>{`.spin { animation: spin 0.8s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
