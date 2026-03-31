import { useParams, useNavigate } from 'react-router-dom'
import { useBills } from '../../context/BillContext'
import { useAuth } from '../../context/AuthContext'
import { ArrowLeft, Printer, Trash2, Truck, Wrench, CreditCard, Download, FileText } from 'lucide-react'
import dayjs from 'dayjs'
import { useRef } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { PDFInvoice } from '../../components/billing/PDFInvoice'

// ── Transport Consolidated Invoice Layout ────────────────────────────────────
function TransportInvoice({ bill, business }) {
  const items = bill.items || []
  const gstLabel = bill.gstType === 'IGST' ? 'IGST' : `CGST + SGST`

  return (
    <div className="invoice-wrap">
      {/* Header */}
      <div className="inv-header">
        <div className="inv-brand">
          {business?.logoUrl
            ? <img src={business.logoUrl} alt="logo" style={{ width: 120, height: 45, objectFit: 'contain' }} />
            : <div style={{ width: 56, height: 56, borderRadius: 10, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.125rem', color: '#7C3AED' }}>
                {(business?.businessName || 'BP')[0]}
              </div>}
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0F0D2E' }}>{business?.businessName || 'Your Business'}</div>
            {business?.slogan && <div style={{ fontSize: '0.75rem', color: '#6B7280', fontStyle: 'italic' }}>{business.slogan}</div>}
            <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 4 }}>{business?.address}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F0D2E', margin: 0 }}>INVOICE</h2>
          <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Bill No: <strong style={{ color: '#0F0D2E' }}>{bill.invoiceNo}</strong></div>
          <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Date: <strong style={{ color: '#0F0D2E' }}>{dayjs(bill.billDate).format('DD MMM YYYY')}</strong></div>
          <div style={{ marginTop: 6 }}>
            <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: bill.status === 'paid' ? '#DCFCE7' : '#FEE2E2', color: bill.status === 'paid' ? '#16A34A' : '#DC2626' }}>
              {bill.status?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: '#EEE', margin: '20px 0' }} />

      {/* Addresses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>From :</div>
          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{business?.businessName}</div>
          <div style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.4 }}>{business?.address}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>Billed To :</div>
          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{bill.billedToName}</div>
          <div style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.4 }}>{bill.billedToAddress}</div>
        </div>
      </div>

      {/* Billing Summary Table */}
      <div style={{ background: '#F9FAFB', borderRadius: 16, overflow: 'hidden', border: '1px solid #EEE' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F3811E', color: 'white' }}>
              {['No.', 'Date', 'From', 'To', 'Chalan No', 'Amount'].map((h, i) => (
                <th key={h} style={{ padding: '10px 12px', textAlign: i === 5 ? 'right' : 'left', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #EEE' }}>
                <td style={{ padding: '12px', color: '#6B7280' }}>{i + 1}</td>
                <td style={{ padding: '12px' }}>{dayjs(item.date).format('DD/MM/YY')}</td>
                <td style={{ padding: '12px', fontWeight: 600 }}>{item.companyFrom}</td>
                <td style={{ padding: '12px' }}>{item.companyTo}</td>
                <td style={{ padding: '12px', color: '#6B7280' }}>{item.chalanNo}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700 }}>₹{parseFloat(item.amount || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <div style={{ width: '55%', background: '#F8F9FF', padding: 16, borderRadius: 16, border: '1px solid #E0E7FF' }}>
           <div style={{ fontWeight: 800, fontSize: '0.7rem', color: '#4338CA', textTransform: 'uppercase', marginBottom: 10 }}>Bank Details</div>
           <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 4, fontSize: '0.8rem' }}>
              <span style={{ color: '#6B7280' }}>Bank:</span> <strong>{business?.bankDetails?.bankName}</strong>
              <span style={{ color: '#6B7280' }}>A/c No:</span> <strong>{business?.bankDetails?.accountNumber}</strong>
              <span style={{ color: '#6B7280' }}>IFSC:</span> <strong>{business?.bankDetails?.ifsc}</strong>
              <span style={{ color: '#6B7280' }}>UPI ID:</span> <strong>{business?.bankDetails?.upiId}</strong>
           </div>
        </div>

        <div style={{ width: '40%' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EEE', fontSize: '0.85rem' }}>
              <span style={{ color: '#6B7280' }}>Subtotal</span>
              <span style={{ fontWeight: 700 }}>₹{bill.subtotal?.toLocaleString()}</span>
           </div>
           {bill.gstAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EEE', fontSize: '0.85rem' }}>
                <span style={{ color: '#6B7280' }}>{gstLabel} ({bill.gstPercent}%)</span>
                <span style={{ fontWeight: 700 }}>₹{bill.gstAmount?.toLocaleString()}</span>
              </div>
           )}
           <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '1.25rem' }}>
              <span style={{ fontWeight: 800 }}>Total</span>
              <span style={{ fontWeight: 900, color: '#F3811E' }}>₹{bill.grandTotal?.toLocaleString()}</span>
           </div>
        </div>
      </div>

      {bill.notes && (
        <div style={{ marginTop: 20, textAlign: 'center', padding: '12px', background: '#FDF2F2', borderRadius: 12, color: '#991B1B', fontWeight: 700, fontSize: '0.9rem' }}>
          {bill.notes}
        </div>
      )}

      {/* Signature Section */}
      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end', textAlign: 'center' }}>
         <div style={{ width: 160 }}>
            {business?.signatureUrl && <img src={business.signatureUrl} style={{ height: 40, width: 100, marginBottom: 8, objectFit: 'contain' }} />}
            <div style={{ height: 1, background: '#000' }} />
            <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: 4 }}>Authorised Signatory</div>
            <div style={{ fontSize: '0.65rem', color: '#6B7280' }}>For {business?.businessName}</div>
         </div>
      </div>
    </div>
  )
}

// ── Garage Invoice Layout (Legacy Support) ───────────────────────────────────
function GarageInvoice({ bill, business }) {
  const items = bill.items || []
  return (
    <div className="invoice-wrap">
       <div style={{ textAlign: 'center', padding: 20 }}>
          <h3 style={{ margin: 0 }}>Service Invoice</h3>
          <p>#{bill.invoiceNo}</p>
       </div>
       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1E1B4B', color: 'white' }}>
              <th style={{ padding: 10, textAlign: 'left' }}>Description</th>
              <th style={{ padding: 10, textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #EEE' }}>
                <td style={{ padding: 10 }}>{item.description}</td>
                <td style={{ padding: 10, textAlign: 'right' }}>₹{parseFloat(item.amount || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
             <tr>
                <td style={{ padding: 10, fontWeight: 800 }}>Total</td>
                <td style={{ padding: 10, textAlign: 'right', fontWeight: 800 }}>₹{bill.grandTotal?.toLocaleString()}</td>
             </tr>
          </tfoot>
       </table>
       <div style={{ marginTop: 20, fontSize: '0.8rem', color: '#6B7280' }}>
         Bank: {business?.bankDetails?.bankName} A/c: {business?.bankDetails?.accountNumber}
       </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function BillDetail() {
  const { id } = useParams()
  const { getBill, deleteBill } = useBills()
  const { user } = useAuth()
  const navigate = useNavigate()
  const printRef = useRef()

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

      {/* Invoice View */}
      <div ref={printRef} style={{ background: 'white', borderRadius: 28, padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.03)' }}>
        {bill.type === 'transport'
          ? <TransportInvoice bill={bill} business={user} />
          : <GarageInvoice bill={bill} business={user} />}
      </div>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
         <button className="btn btn-ghost" onClick={() => navigate('/bills')} style={{ fontSize: '0.85rem' }}>
           <FileText size={16} /> Back to all bills
         </button>
      </div>
    </div>
  )
}
