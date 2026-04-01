import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  Wrench, User, Plus, Trash2, CheckCircle2,
  Loader2, ArrowLeft, ChevronDown, FileText, Car
} from 'lucide-react'
import { useState } from 'react'
import { useBills } from '../../context/BillContext'
import { useParties } from '../../context/PartyContext'
import dayjs from 'dayjs'

// Import services data from CSV (raw text)
import servicesRaw from '../../data/services.csv?raw'

// Parse labels: extract strings starting with [ ], remove brackets, trim
// Headers are lines that don't start with whitespace
const SERVICES_DATA = servicesRaw
  .split('\n')
  .filter(line => line.includes('[ ]'))
  .map(line => {
    const isHeader = !line.startsWith(' ') && !line.startsWith('\t');
    const label = line.replace(/\[\s*\]/, '').trim();
    return { label, isHeader };
  })
  .filter(item => item.label.length > 0);

function Field({ label, error, children, required }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}{required && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}</label>
      {children}
      {error && <span className="form-error">{error.message}</span>}
    </div>
  )
}

function SectionCard({ icon: Icon, iconBg, iconColor, title, children }) {
  return (
    <div style={{ background: 'white', borderRadius: 20, padding: '18px 18px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 14, border: '1px solid rgba(0,0,0,0.04)' }}>
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
  { val: 'unpaid', label: 'Unpaid',  color: '#DC2626', bg: '#FEE2E2' },
  { val: 'paid',   label: 'Paid',    color: '#16A34A', bg: '#DCFCE7' },
  { val: 'partial',label: 'Partial', color: '#D97706', bg: '#FEF3C7' },
]

export default function GarageBill() {
  const { addBill } = useBills()
  const { parties } = useParties()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [savedBill, setSavedBill] = useState(null)
  
  // Custom dropdown state
  const [activeIdx, setActiveIdx] = useState(null)

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm({
    defaultValues: {
      billDate: dayjs().format('YYYY-MM-DD'),
      partyId: '',
      customerName: '', customerPhone: '',
      vehicleNo: '', vehicleModel: '', vehicleCompany: '',
      kmReading: '', nextServiceKm: '', nextServiceDate: '',
      paymentMode: 'unpaid',
      gstPercent: '0',
      laborCharge: '0',
      notes: '',
      items: [{ description: '', qty: '1', rate: '', amount: '' }],
    }
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const paymentMode = watch('paymentMode')
  const gstPercent  = watch('gstPercent')
  const laborCharge = watch('laborCharge')
  const items       = watch('items')
  const partyId     = watch('partyId')

  // Auto-fill from party
  useEffect(() => {
    if (!partyId) return
    const p = parties.find(x => x.id === partyId)
    if (p) {
      setValue('customerName', p.name)
      setValue('customerPhone', p.phone || '')
    }
  }, [partyId, parties, setValue])

  // Auto-calc item amounts
  useEffect(() => {
    items.forEach((item, i) => {
      const qty = parseFloat(item.qty) || 0
      const rate = parseFloat(item.rate) || 0
      const amt = (qty * rate).toFixed(2)
      if (item.amount !== amt) setValue(`items.${i}.amount`, amt)
    })
  }, [items.map(i => `${i.qty}_${i.rate}`).join(',')])

  const partsTotal  = items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0)
  const labor       = parseFloat(laborCharge) || 0
  const subtotal    = partsTotal + labor
  const gstAmount   = subtotal * (parseFloat(gstPercent) || 0) / 100
  const grandTotal  = subtotal + gstAmount

  const onSubmit = async (data) => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    const bill = addBill({
      type: 'garage',
      ...data,
      partsTotal, labor, subtotal, gstAmount, grandTotal,
      status: data.paymentMode === 'paid' ? 'paid' : data.paymentMode === 'partial' ? 'partial' : 'unpaid',
    })
    setSaving(false)
    setSavedBill(bill)
  }

  if (savedBill) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, textAlign: 'center', padding: 24 }}>
      <div style={{ width: 68, height: 68, borderRadius: 20, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeInUp 0.3s ease both' }}>
        <CheckCircle2 size={36} color="#16A34A" />
      </div>
      <h2 style={{ fontWeight: 800, color: '#0F0D2E' }}>Bill Created!</h2>
      <p style={{ color: '#6B7280' }}>Invoice #{savedBill.invoiceNo}</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => navigate(`/bills/${savedBill.id}`)}><FileText size={16} /> View Invoice</button>
        <button className="btn btn-ghost" onClick={() => navigate('/bills/new')}><Plus size={16} /> New Bill</button>
        <button className="btn btn-ghost" onClick={() => navigate('/bills')}>All Bills</button>
      </div>
    </div>
  )

  return (
    <div className="page-wrapper animate-fadeIn" style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate('/bills')} style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '1.125rem', color: '#0F0D2E', margin: 0 }}>Garage Bill</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: 0 }}>Vehicle Service Invoice</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <input type="date" {...register('billDate')} className="form-input" style={{ fontSize: '0.8125rem', padding: '6px 10px', borderRadius: 10, background: 'white' }} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Customer */}
        <SectionCard icon={User} iconBg="#EDE9FE" iconColor="#7C3AED" title="Customer">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Select Party">
              <div style={{ position: 'relative' }}>
                <select {...register('partyId')} className="form-input" style={{ appearance: 'none', paddingRight: 36 }}>
                  <option value="">— Select customer —</option>
                  {parties.map(p => <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>)}
                </select>
                <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
              </div>
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Customer Name" error={errors.customerName} required>
                <input {...register('customerName', { required: 'Required' })} placeholder="Name" className={`form-input ${errors.customerName ? 'error' : ''}`} />
              </Field>
              <Field label="Phone">
                <input {...register('customerPhone')} placeholder="Phone" className="form-input" inputMode="numeric" maxLength={10} />
              </Field>
            </div>
          </div>
        </SectionCard>

        {/* Vehicle */}
        <SectionCard icon={Car} iconBg="#FEF3C7" iconColor="#D97706" title="Vehicle">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Vehicle Number" error={errors.vehicleNo} required>
              <input {...register('vehicleNo', { required: 'Required' })} placeholder="GJ15AB1234" className={`form-input ${errors.vehicleNo ? 'error' : ''}`} style={{ textTransform: 'uppercase' }} />
            </Field>
            <Field label="KM Reading">
              <input {...register('kmReading')} type="number" placeholder="45000" className="form-input" inputMode="numeric" />
            </Field>
            <Field label="Company">
              <input {...register('vehicleCompany')} placeholder="Maruti" className="form-input" />
            </Field>
            <Field label="Model">
              <input {...register('vehicleModel')} placeholder="Swift" className="form-input" />
            </Field>
            <Field label="Next Service KM">
              <input {...register('nextServiceKm')} type="number" placeholder="50000" className="form-input" inputMode="numeric" />
            </Field>
            <Field label="Next Service Date">
              <input {...register('nextServiceDate')} type="date" className="form-input" />
            </Field>
          </div>
        </SectionCard>

        {/* Service Items */}
        <SectionCard icon={Wrench} iconBg="#DCFCE7" iconColor="#16A34A" title="Parts & Services">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.6fr 0.8fr 0.8fr 36px', gap: 6 }}>
              {['Description', 'Qty', 'Rate ₹', 'Amount ₹', ''].map(h => (
                <div key={h} style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', paddingLeft: 4 }}>{h}</div>
              ))}
            </div>

            {fields.map((field, index) => {
              const currentDesc = watch(`items.${index}.description`) || ''
              const filtered = SERVICES_DATA.filter(item => 
                currentDesc === '' || item.label.toLowerCase().includes(currentDesc.toLowerCase())
              )

              return (
                <div key={field.id} style={{ display: 'grid', gridTemplateColumns: '2fr 0.6fr 0.8fr 0.8fr 36px', gap: 6, alignItems: 'center', position: 'relative' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      {...register(`items.${index}.description`, { required: true })}
                      placeholder="Service / Part name"
                      className="form-input"
                      style={{ fontSize: '0.8125rem', padding: '8px 10px', width: '100%' }}
                      onFocus={() => setActiveIdx(index)}
                      onBlur={() => setTimeout(() => setActiveIdx(null), 200)}
                      autoComplete="off"
                    />
                    
                    {activeIdx === index && filtered.length > 0 && (
                      <div style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                        background: 'white', border: '1px solid #E5E7EB', borderRadius: 12,
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                        marginTop: 4, maxHeight: 220, overflowY: 'auto'
                      }}>
                        {filtered.map((item, i) => (
                          <div
                            key={i}
                            onMouseDown={(e) => {
                              if (item.isHeader) return
                              e.preventDefault()
                              e.stopPropagation()
                              setValue(`items.${index}.description`, item.label, { shouldValidate: true })
                              // Auto-append new row for multiple selection
                              append({ description: '', qty: '1', rate: '', amount: '' })
                              setActiveIdx(null)
                            }}
                            style={{
                              padding: item.isHeader ? '10px 12px 6px' : '8px 12px',
                              fontSize: item.isHeader ? '0.7rem' : '0.8125rem',
                              fontWeight: item.isHeader ? 800 : 500,
                              color: item.isHeader ? '#7C3AED' : '#0F0D2E',
                              background: item.isHeader ? '#F9F8FF' : 'white',
                              cursor: item.isHeader ? 'default' : 'pointer',
                              textTransform: item.isHeader ? 'uppercase' : 'none',
                              letterSpacing: item.isHeader ? '0.04em' : 'normal',
                              paddingLeft: item.isHeader ? 12 : 20,
                              borderBottom: '1px solid #F3F4F6',
                              transition: 'background 0.1s'
                            }}
                            onMouseEnter={e => !item.isHeader && (e.currentTarget.style.background = '#F5F3FF')}
                            onMouseLeave={e => !item.isHeader && (e.currentTarget.style.background = 'white')}
                          >
                            {item.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input {...register(`items.${index}.qty`)} type="number" min="0.1" step="0.1" placeholder="1" className="form-input" style={{ fontSize: '0.8125rem', padding: '8px 8px', textAlign: 'center' }} inputMode="decimal" />
                  <input {...register(`items.${index}.rate`)} type="number" min="0" step="0.01" placeholder="0" className="form-input" style={{ fontSize: '0.8125rem', padding: '8px 8px' }} inputMode="decimal" />
                  <div style={{ background: '#F4F4F8', borderRadius: 10, padding: '8px 8px', fontSize: '0.8125rem', fontWeight: 600, color: '#0F0D2E', textAlign: 'right' }}>
                    ₹{parseFloat(items[index]?.amount || 0).toFixed(2)}
                  </div>
                  <button type="button" onClick={() => fields.length > 1 && remove(index)}
                    disabled={fields.length === 1}
                    style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: fields.length > 1 ? '#FEE2E2' : '#F4F4F4', cursor: fields.length > 1 ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Trash2 size={13} color={fields.length > 1 ? '#DC2626' : '#D1D5DB'} />
                  </button>
                </div>
              )
            })}

            <button type="button" onClick={() => append({ description: '', qty: '1', rate: '', amount: '' })}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#EDE9FE', color: '#7C3AED', border: 'none', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem', width: 'fit-content', marginTop: 4 }}>
              <Plus size={14} /> Add Row
            </button>

            {/* Labor + GST */}
            <div style={{ borderTop: '1px dashed #E5E7EB', paddingTop: 12, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Field label="Total Labour Charge (₹)">
                  <div className="input-group">
                    <span className="input-prefix">₹</span>
                    <input {...register('laborCharge')} type="number" min="0" step="0.01" placeholder="0" className="form-input" inputMode="decimal" />
                  </div>
                </Field>
                <Field label="GST %">
                  <div style={{ position: 'relative' }}>
                    <select {...register('gstPercent')} className="form-input" style={{ appearance: 'none', paddingRight: 30 }}>
                      {['0','5','12','18'].map(g => <option key={g} value={g}>{g}%</option>)}
                    </select>
                    <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                  </div>
                </Field>
              </div>

              {/* Live total */}
              <div style={{ background: 'linear-gradient(135deg, #1E1B4B, #4C1D95)', borderRadius: 14, padding: '14px 16px' }}>
                {[
                  { label: 'Parts Total',  val: partsTotal },
                  { label: 'Labour',       val: labor },
                  { label: `GST (${gstPercent}%)`, val: gstAmount },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: 4 }}>
                    <span>{row.label}</span><span>₹{row.val.toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 800, fontSize: '1.125rem' }}>
                  <span>Grand Total</span><span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Payment Mode */}
        <SectionCard icon={FileText} iconBg="#EDE9FE" iconColor="#7C3AED" title="Payment Status">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {PAYMENT_MODES.map(pm => {
              const isActive = paymentMode === pm.val
              return (
                <button key={pm.val} type="button" onClick={() => setValue('paymentMode', pm.val)}
                  style={{ padding: '10px 6px', borderRadius: 12, border: isActive ? `2px solid ${pm.color}` : '2px solid transparent', background: isActive ? pm.bg : '#F4F4F8', color: isActive ? pm.color : '#6B7280', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.18s', boxShadow: isActive ? `0 2px 10px ${pm.color}25` : 'none' }}>
                  {pm.label}
                </button>
              )
            })}
          </div>
          <input type="hidden" {...register('paymentMode')} />
        </SectionCard>

        {/* Notes */}
        <div style={{ background: 'white', borderRadius: 20, padding: '16px 18px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 20, border: '1px solid rgba(0,0,0,0.04)' }}>
          <Field label="Notes">
            <textarea {...register('notes')} placeholder="Warranty terms, special instructions…" className="form-input" style={{ minHeight: 70, resize: 'vertical' }} rows={3} />
          </Field>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="button" className="btn btn-ghost btn-full" onClick={() => navigate('/bills')}>Cancel</button>
          <button id="btn-save-garage-bill" type="submit" className="btn btn-primary btn-full btn-lg" disabled={saving}>
            {saving ? <><Loader2 size={18} className="spin" /> Creating…</> : <><CheckCircle2 size={18} /> Create Bill</>}
          </button>
        </div>
      </form>
      <style>{`.spin { animation: spin 0.8s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
