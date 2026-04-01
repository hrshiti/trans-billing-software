import { useParams, useNavigate } from 'react-router-dom'
import { useBills } from '../../context/BillContext'
import { useAuth } from '../../context/AuthContext'
import { ArrowLeft, Printer, Trash2, Truck, Wrench, CreditCard, Download, FileText } from 'lucide-react'
import dayjs from 'dayjs'
import { useRef } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { PDFInvoice } from '../../components/billing/PDFInvoice'
import PaymentModal from '../../components/billing/PaymentModal'
import { useState } from 'react'

// ── Transport Consolidated Invoice Layout ────────────────────────────────────
function TransportInvoice({ bill, business, onPayOnline }) {
  const items = bill.items || []
  const accent = '#F3811E' // Radhe Tempo Orange

  return (
    <div className="invoice-wrap" style={{ color: '#000', fontFamily: 'Inter, sans-serif', padding: '10px' }}>
      {/* Top Header Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', border: '1px solid #ccc', borderRadius: '2px 2px 0 0' }}>
        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
           {business?.logoUrl 
             ? <img src={business.logoUrl} style={{ width: 80, height: 60, objectFit: 'contain' }} />
             : <div style={{ minWidth: 60, height: 60, background: '#eee', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900 }}>T</div>
           }
           <div>
             <h1 style={{ fontSize: '2.4rem', fontWeight: 950, margin: 0, letterSpacing: '-0.04em', lineHeight: 0.9 }}>{business?.businessName || 'BUSINESS'}</h1>
             <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#444', textTransform: 'capitalize', marginTop: 8 }}>{business?.slogan || 'Move What Matters'}</p>
           </div>
        </div>
        <div style={{ borderLeft: '1px solid #ccc' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', borderBottom: '1px solid #ccc' }}>
             <div style={{ padding: '14px 12px', background: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>Bill No.:</div>
             <div style={{ padding: '14px 12px', fontWeight: 800, fontSize: '0.95rem', borderLeft: '1px solid #eee' }}>{bill.invoiceNo}</div>
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr' }}>
             <div style={{ padding: '14px 12px', background: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>Date :</div>
             <div style={{ padding: '14px 12px', fontWeight: 800, fontSize: '0.95rem', borderLeft: '1px solid #eee' }}>{dayjs(bill.billDate).format('DD/MM/YYYY')}</div>
           </div>
        </div>
      </div>

      {/* From / To Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid #ccc', borderTop: 'none' }}>
        <div style={{ padding: '12px 16px', borderRight: '1px solid #ccc' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: 4 }}>From : <span style={{ fontWeight: 900, textTransform: 'uppercase' }}>{business?.businessName}</span></div>
          <div style={{ fontSize: '0.75rem', color: '#333', lineHeight: 1.5 }}>
            {business?.address}<br/>
            Email : {business?.email}<br/>
            Mob : {business?.phone}
            {business?.panNo && <span><br/>PAN No : {business?.panNo}</span>}
          </div>
        </div>
        <div style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: 4 }}>Billed To : <span style={{ fontWeight: 900, textTransform: 'uppercase' }}>{bill.billedToName}</span></div>
          <div style={{ fontSize: '0.75rem', color: '#333', lineHeight: 1.5 }}>{bill.billedToAddress}</div>
        </div>
      </div>

      {/* Billing Summary Centered Banner */}
      <div style={{ background: accent, color: 'white', textAlign: 'center', padding: '10px', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.15em', borderX: '1px solid #ccc', margin: '0 -1px' }}>
        Billing Summary
      </div>

      {/* Table grid */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc', borderTop: 'none' }}>
        <thead>
          <tr style={{ background: '#fdf7f2' }}>
            {['No.', 'Date', 'Company (From)', 'Company (To)', 'Chalan No.', 'Amount'].map((h, i) => (
              <th key={h} style={{ padding: '12px 6px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #ccc', textAlign: i === 5 ? 'right' : 'center', color: '#333' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center', fontSize: '0.85rem' }}>{i + 1}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center', fontSize: '0.85rem' }}>{dayjs(item.date).format('DD/MM/YY')}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>{item.companyFrom || '—'}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center', fontSize: '0.85rem' }}>{item.companyTo || '—'}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center', fontSize: '0.85rem' }}>{item.chalanNo || '—'}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'right', fontSize: '0.85rem', fontWeight: 700 }}>{parseFloat(item.amount || 0).toLocaleString()}</td>
            </tr>
          ))}
          {/* Total Row exactly like Radhe Tempo */}
          <tr>
            <td colSpan="4" style={{ background: accent, color: 'white', padding: '12px 20px', fontWeight: 800, fontSize: '0.9rem', textAlign: 'center' }}>
              Grateful for Moving What Matters to You!
            </td>
            <td style={{ padding: '12px', textAlign: 'center', fontWeight: 900, fontSize: '1rem', border: '1px solid #ccc', background: '#f5f5f5' }}>TOTAL :</td>
            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 950, fontSize: '1.25rem', border: '1px solid #ccc' }}>₹{bill.grandTotal?.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      {/* Bank Details Horizontal Strip */}
      <div style={{ marginTop: 12, border: '1px solid #ccc' }}>
         <div style={{ background: '#fdf3f0', padding: '6px 12px', fontSize: '0.7rem', fontWeight: 800, borderBottom: '1px solid #ccc' }}>BANK DETAILS :</div>
         <div style={{ padding: '12px', backgroundColor: '#fff' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 0.4fr', gap: 15 }}>
               <div style={{ fontSize: '0.8rem', display: 'flex', gap: 6 }}>
                  <span style={{ fontWeight: 600, color: '#555' }}>Account No.:</span> <span style={{ fontWeight: 900 }}>{business?.bankDetails?.accountNumber || ''}</span>
               </div>
               <div style={{ fontSize: '0.8rem', display: 'flex', gap: 6 }}>
                  <span style={{ fontWeight: 600, color: '#555' }}>IFSC Code :</span> <span style={{ fontWeight: 900 }}>{business?.bankDetails?.ifsc || ''}</span>
               </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 0.4fr', gap: 15, marginTop: 6 }}>
               <div style={{ fontSize: '0.8rem', display: 'flex', gap: 6 }}>
                  <span style={{ fontWeight: 600, color: '#555' }}>Account Name :</span> <span style={{ fontWeight: 900 }}>{business?.bankDetails?.accountName || ''}</span>
               </div>
               <div style={{ fontSize: '0.8rem', display: 'flex', gap: 6 }}>
                  <span style={{ fontWeight: 600, color: '#555' }}>Bank Name :</span> <span style={{ fontWeight: 900 }}>{business?.bankDetails?.bankName || ''}</span>
               </div>
            </div>
         </div>
      </div>

      {/* Footer Branding & Signature */}
      <div style={{ marginTop: 25, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
         <div>
            <div style={{ fontWeight: 950, fontSize: '1.125rem' }}>{business?.businessName?.toUpperCase() || ''} <span style={{ fontWeight: 400, color: '#666', fontSize: '0.9rem' }}>— {business?.slogan || ''}</span></div>
         </div>
         <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 900 }}>For {business?.businessName || ''},</div>
            <div style={{ width: 180, borderBottom: '1px solid #000', margin: '35px 0 6px' }} />
            <div style={{ fontSize: '0.75rem', color: '#666' }}>(Authorized Signatory)</div>
         </div>
      </div>
    </div>
  )
}

// ── Garage Specific Invoice Layout (Repair Estimate Style) ──────────────────
function GarageInvoice({ bill, business, onPayOnline }) {
  const items = bill.items || []
  const themeColor = '#FFB800' // Amber/Yellow from target image

  return (
    <div className="garage-invoice-wrap" style={{ color: '#000', fontFamily: 'Inter, sans-serif' }}>
      {/* Top Banner */}
      <div style={{ background: themeColor, padding: '24px 30px', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#111' }}>Repair Estimate</h1>
          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, opacity: 0.85, color: '#333' }}>{business?.slogan || 'Restoring Vehicles, Reviving Peace of Mind'}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ fontWeight: 900, fontSize: '1.25rem', color: '#111' }}>{business?.businessName?.toUpperCase() || 'AUTO REPAIRS'}</div>
           <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: 4 }}>Bill No: {bill.invoiceNo}</div>
        </div>
      </div>

      <div style={{ padding: '30px', border: '1px solid #eee', borderTop: 'none', borderRadius: '0 0 8px 8px', background: 'white' }}>
        
        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginBottom: 30 }}>
          {/* Customer Info */}
          <div>
            <div style={{ background: themeColor, padding: '4px 10px', display: 'inline-block', fontWeight: 800, fontSize: '0.75rem', marginBottom: 10, borderRadius: 2 }}>Customer Information</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr' }}><span style={{ fontWeight: 700 }}>Name:</span> <span>{bill.customerName}</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr' }}><span style={{ fontWeight: 700 }}>Address:</span> <span>{bill.customerAddress || '—'}</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr' }}><span style={{ fontWeight: 700 }}>Phone:</span> <span>{bill.customerPhone}</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr' }}><span style={{ fontWeight: 700 }}>Email:</span> <span>{bill.customerEmail || '—'}</span></div>
            </div>
          </div>
          {/* Vehicle Info */}
          <div>
            <div style={{ background: themeColor, padding: '4px 10px', display: 'inline-block', fontWeight: 800, fontSize: '0.75rem', marginBottom: 10, borderRadius: 2 }}>Vehicle Information</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr' }}><span style={{ fontWeight: 700 }}>Make:</span> <span>{bill.vehicleCompany || '—'}</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr' }}><span style={{ fontWeight: 700 }}>Model:</span> <span>{bill.vehicleModel || '—'}</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr' }}><span style={{ fontWeight: 700 }}>Model Year:</span> <span>{bill.vehicleYear || '—'}</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr' }}><span style={{ fontWeight: 700 }}>Reg No:</span> <span style={{ fontWeight: 800 }}>{bill.vehicleNo?.toUpperCase()}</span></div>
            </div>
          </div>
        </div>

        {/* Repair Details Table */}
        <div style={{ marginBottom: 30 }}>
          <div style={{ background: themeColor, padding: '4px 10px', display: 'inline-block', fontWeight: 800, fontSize: '0.75rem', marginBottom: 10, borderRadius: 2 }}>Repair Details</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ background: themeColor }}>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd', fontSize: '0.75rem', fontWeight: 800 }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd', fontSize: '0.75rem', fontWeight: 800, width: '15%' }}>Quantity</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd', fontSize: '0.75rem', fontWeight: 800, width: '20%' }}>Unit Price (₹)</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd', fontSize: '0.75rem', fontWeight: 800, width: '20%' }}>Total Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={{ padding: '10px 12px', border: '1px solid #ddd', fontSize: '0.85rem' }}>{item.description}</td>
                  <td style={{ padding: '10px 12px', border: '1px solid #ddd', fontSize: '0.85rem', textAlign: 'center' }}>{item.qty || 1}</td>
                  <td style={{ padding: '10px 12px', border: '1px solid #ddd', fontSize: '0.85rem', textAlign: 'right' }}>{parseFloat(item.rate || item.amount).toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', border: '1px solid #ddd', fontSize: '0.85rem', textAlign: 'right', fontWeight: 600 }}>{parseFloat(item.amount).toLocaleString()}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left', fontWeight: 800 }}>Total</td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 950, fontSize: '1.25rem', background: '#fcfcfc' }}>₹{bill.subtotal?.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer info splits */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, borderTop: '2px solid #222', paddingTop: 20 }}>
          <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 6, background: '#fafafa' }}>
             <h4 style={{ margin: '0 0 10px 0', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Terms and Conditions</h4>
             <p style={{ margin: 0, fontSize: '0.7rem', color: '#555', lineHeight: 1.6 }}>
                By signing below, the customer agrees to the repair estimate and authorizes {business?.businessName || 'the garage'} to proceed with repairs, understanding that additional costs may apply after detailed assessment. This estimate is valid for 30 days from the bill date.
             </p>
          </div>
          <div style={{ textAlign: 'right', paddingRight: 10 }}>
             <div style={{ marginBottom: 40 }}>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800 }}>Customer Signature: ____________________</p>
                <p style={{ margin: '15px 0 0 0', fontSize: '0.85rem', fontWeight: 800 }}>Date: ____________________</p>
             </div>
             <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: '#888' }}>Processed by {business?.businessName}</p>
          </div>
        </div>

        {bill.status !== 'paid' && (
          <button 
            onClick={onPayOnline}
            style={{
              marginTop: 25, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px', background: 'linear-gradient(135deg, #16A34A, #15803D)', color: 'white',
              border: 'none', borderRadius: 14, fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)'
            }}
          >
            <CreditCard size={20} /> Direct Online Payment
          </button>
        )}
      </div>
      
      {/* Footer stripe */}
      <div style={{ height: 16, background: themeColor, borderRadius: '0 0 8px 8px' }} />
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function BillDetail() {
  const { id } = useParams()
  const { getBill, deleteBill, recordPayment } = useBills()
  const { user } = useAuth()
  const navigate = useNavigate()
  const printRef = useRef()
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)

  const bill = getBill(id)

  if (!bill) return (
    <div style={{ textAlign: 'center', padding: 40 }}>
      <h3>Bill not found</h3>
      <button className="btn btn-primary" onClick={() => navigate('/bills')}>Back to Bills</button>
    </div>
  )

  const handlePrint = () => {
    const content = printRef.current.innerHTML
    const win = window.open('', '_blank', 'width=800,height=900')
    win.document.write(`
      <html><head><title>Invoice ${bill.invoiceNo}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; background: white; color: #111; }
        .invoice-wrap { max-width: 760px; margin: 0 auto; }
        .inv-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 12px; }
        .inv-brand { display: flex; gap: 14px; align-items: center; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { padding: 8px 10px; text-align: left; font-weight: 600; font-size: 11px; }
        td { padding: 8px 10px; border-bottom: 1px solid #F3F4F6; }
        @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
      </style></head><body>${content}</body></html>
    `)
    win.document.close()
    setTimeout(() => { win.focus(); win.print() }, 300)
  }

  const handleDelete = () => {
    if (window.confirm('Delete this bill?')) {
      deleteBill(id)
      navigate('/bills')
    }
  }

  return (
    <div className="page-wrapper animate-fadeIn" style={{ maxWidth: 740, margin: '0 auto', paddingBottom: 60 }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate('/bills')} style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.0625rem', color: '#0F0D2E', margin: 0 }}>#{bill.invoiceNo}</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: 0 }}>{dayjs(bill.billDate || bill.createdAt).format('DD MMM YYYY')}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button id="btn-delete-bill" onClick={handleDelete} style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: '#FEE2E2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={16} color="#DC2626" />
          </button>
          <button id="btn-print-bill" onClick={handlePrint} className="btn-icon" style={{ background: 'white', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #EEE' }}>
            <Printer size={18} />
          </button>
          <PDFDownloadLink
            document={<PDFInvoice bill={bill} business={user} />}
            fileName={`Invoice_${bill.invoiceNo}.pdf`}
            className="btn btn-primary"
            style={{ padding: '0 16px', borderRadius: 14, height: 44, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {({ loading }) => (
              <>
                <Download size={18} />
                {loading ? '...' : 'PDF'}
              </>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <div ref={printRef} style={{ background: 'white', borderRadius: 28, padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.03)' }}>
        {bill.type === 'transport'
          ? <TransportInvoice bill={bill} business={user} onPayOnline={() => setIsPayModalOpen(true)} />
          : <GarageInvoice bill={bill} business={user} onPayOnline={() => setIsPayModalOpen(true)} />}
      </div>

      <PaymentModal 
        isOpen={isPayModalOpen} 
        onClose={() => setIsPayModalOpen(false)} 
        bill={bill} 
        business={user} 
        onSuccess={(amount) => recordPayment(bill.id, amount)}
      />

      <div style={{ marginTop: 20, textAlign: 'center' }}>
         <button className="btn btn-ghost" onClick={() => navigate('/bills')} style={{ fontSize: '0.85rem' }}>
           <FileText size={16} /> Back to all bills
         </button>
      </div>
    </div>
  )
}
