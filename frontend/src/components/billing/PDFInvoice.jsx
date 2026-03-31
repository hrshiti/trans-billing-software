import { 
  Document, Page, Text, View, StyleSheet, Image, Font 
} from '@react-pdf/renderer';
import dayjs from 'dayjs';

// Styles matching the "Hembox" PDF aesthetics
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 9, color: '#333', fontFamily: 'Helvetica' },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' },
  logoBox: { width: '40%' },
  logo: { width: 120, height: 45, objectFit: 'contain' },
  
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#000', textAlign: 'right', letterSpacing: 1 },
  slogan: { fontSize: 9, color: '#666', textAlign: 'right', marginTop: -4 },
  
  metaInfo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, borderTop: 1, borderColor: '#EEE', paddingTop: 10 },
  billNoBox: { textAlign: 'right' },
  billLabel: { fontSize: 10, fontWeight: 'bold' },

  // Addressing
  addressRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15 },
  addressCol: { width: '48%' },
  addressTitle: { fontSize: 10, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  addressText: { fontSize: 8, color: '#444', lineHeight: 1.4 },

  // Billing Summary Table
  tableContainer: { marginTop: 10 },
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#F3811E', // Orange from PDF
    color: 'white', 
    fontWeight: 'bold', 
    padding: '6 4',
    textAlign: 'center'
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderColor: '#F0F0F0', 
    padding: '6 4',
    alignItems: 'center',
    textAlign: 'center'
  },
  
  // Table Columns
  colNo: { width: '6%' },
  colDate: { width: '15%' },
  colFrom: { width: '22%' },
  colTo: { width: '22%' },
  colChalan: { width: '18%' },
  colAmount: { width: '17%', textAlign: 'right' },

  // Branding Strip
  brandingStrip: { 
    backgroundColor: '#F3811E', 
    padding: 8, 
    color: 'white', 
    textAlign: 'center', 
    fontSize: 10, 
    fontWeight: 'bold',
    marginTop: 10
  },

  // Totals Area
  summaryArea: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 0 },
  bankDetails: { width: '60%', padding: 10, backgroundColor: '#F9FAFB', marginTop: 10 },
  bankTitle: { fontWeight: 'bold', fontSize: 8, color: '#666', marginBottom: 4 },
  bankRow: { flexDirection: 'row', marginBottom: 2 },
  bankLabel: { width: 80, fontSize: 8, fontWeight: 'bold' },
  bankVal: { fontSize: 8 },

  totalBox: { width: '38%', padding: 10, textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', padding: '4 0' },
  grandTotalBox: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: '#F3F4F6', 
    padding: 10, 
    marginTop: 5 
  },
  grandTotalValue: { fontSize: 16, fontWeight: 'bold', color: '#000' },

  // Signature and QR
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, alignItems: 'flex-end' },
  qrBox: { width: 80, height: 80 },
  qrCode: { width: 70, height: 70 },
  qrText: { fontSize: 6, textAlign: 'center', marginTop: 2, color: '#999' },
  
  signatureBox: { width: 140, textAlign: 'center' },
  signatureLine: { borderTopWidth: 1, borderColor: '#000', marginTop: 50, paddingTop: 5 },
  signText: { fontSize: 8, fontWeight: 'bold' },
  authText: { fontSize: 7, color: '#666', marginTop: 2 }
});

export const PDFInvoice = ({ bill, business }) => {
  const isTransport = bill.type === 'transport';
  const items = bill.items || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            {business.logoUrl ? (
              <Image src={business.logoUrl} style={styles.logo} />
            ) : (
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F3811E' }}>{business.businessName?.split(' ')[0] || 'BRAND'}</Text>
            )}
          </View>
          <View>
            <Text style={styles.headerTitle}>{business.businessName?.toUpperCase() || 'RADHE TEMPO'}</Text>
            <Text style={styles.slogan}>{business.slogan || 'Move What Matters'}</Text>
          </View>
        </View>

        {/* Bill Info Meta */}
        <View style={styles.metaInfo}>
          <View>
            <Text style={styles.addressText}>{business.address}</Text>
            <Text style={styles.addressText}>Email : {business.email}</Text>
            <Text style={styles.addressText}>Mob : {business.phone}</Text>
            {business.panNo && <Text style={styles.addressText}>PAN No : {business.panNo}</Text>}
          </View>
          <View style={styles.billNoBox}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
              <Text style={styles.billLabel}>Bill No.: </Text>
              <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{bill.invoiceNo}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Text style={styles.billLabel}>Date : </Text>
              <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{dayjs(bill.billDate).format('DD/MM/YYYY')}</Text>
            </View>
          </View>
        </View>

        {/* Party Address Section */}
        <View style={styles.addressRow}>
          <View style={styles.addressCol}>
            <Text style={styles.addressTitle}>From : {business.businessName || 'RADHE TEMPO'}</Text>
            <Text style={styles.addressText}>{business.address}</Text>
          </View>
          <View style={styles.addressCol}>
            <Text style={styles.addressTitle}>Billed To : {bill.billedToName || 'CUSTOMER'}</Text>
            <Text style={styles.addressText}>{bill.billedToAddress}</Text>
          </View>
        </View>

        {/* Table Content */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.colNo}>No.</Text>
            <Text style={styles.colDate}>Date</Text>
            <Text style={styles.colFrom}>{isTransport ? 'Company (From)' : 'Description'}</Text>
            <Text style={styles.colTo}>{isTransport ? 'Company (To)' : 'Qty/Rate'}</Text>
            <Text style={styles.colChalan}>{isTransport ? 'Chalan No.' : 'Details'}</Text>
            <Text style={styles.colAmount}>Amount</Text>
          </View>

          {items.map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.colNo}>{idx + 1}</Text>
              <Text style={styles.colDate}>{dayjs(item.date).format('DD/MM/YY')}</Text>
              <Text style={styles.colFrom}>{isTransport ? (item.companyFrom || '-') : item.description}</Text>
              <Text style={styles.colTo}>{isTransport ? (item.companyTo || '-') : `${item.qty || 1} x ${item.rate || item.amount}`}</Text>
              <Text style={styles.colChalan}>{isTransport ? (item.chalanNo || '-') : '-'}</Text>
              <Text style={styles.colAmount}>{parseFloat(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
            </View>
          ))}
          
          {/* Fill empty space if few items */}
          {items.length < 5 && [1,2,3].slice(0, 5 - items.length).map((_, i) => (
             <View key={`empty-${i}`} style={[styles.tableRow, { height: 25 }]}><Text></Text></View>
          ))}
        </View>

        {/* Branding Slogan Strip */}
        <View style={styles.brandingStrip}>
          <Text>{bill.notes || 'Grateful for Moving What Matters to You!'}</Text>
        </View>

        {/* Totals & Bank Area */}
        <View style={styles.summaryArea}>
          <View style={styles.bankDetails}>
            <Text style={styles.bankTitle}>BANK DETAILS :</Text>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Account No.:</Text>
              <Text style={styles.bankVal}>{business.bankDetails?.accountNumber || '-'}</Text>
              <Text style={[styles.bankLabel, { marginLeft: 15 }]}>IFSC Code :</Text>
              <Text style={styles.bankVal}>{business.bankDetails?.ifsc || '-'}</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Account Name :</Text>
              <Text style={styles.bankVal}>{business.bankDetails?.accountName || business.name || business.businessName || '-'}</Text>
              <Text style={[styles.bankLabel, { marginLeft: 15 }]}>Bank Name :</Text>
              <Text style={styles.bankVal}>{business.bankDetails?.bankName || '-'}</Text>
            </View>
            <View style={{ marginTop: 8, fontStyle: 'italic', color: '#666', fontSize: 7 }}>
               <Text>{business.businessName} - {business.slogan || 'Moving What Matters Since 2020'}</Text>
            </View>
          </View>

          <View style={styles.totalBox}>
             <View style={styles.totalRow}>
                <Text style={{ fontWeight: 'bold' }}>SUBTOTAL :</Text>
                <Text>₹{(bill.subtotal || 0).toLocaleString()}</Text>
             </View>
             {bill.gstAmount > 0 && (
               <View style={styles.totalRow}>
                  <Text style={{ fontWeight: 'bold' }}>GST ({bill.gstPercent}%) :</Text>
                  <Text>₹{(bill.gstAmount || 0).toLocaleString()}</Text>
               </View>
             )}
             <View style={styles.grandTotalBox}>
                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>TOTAL :</Text>
                <Text style={styles.grandTotalValue}>₹{(bill.grandTotal || 0).toLocaleString()}</Text>
             </View>
          </View>
        </View>

        {/* Footer: QR and Sign */}
        <View style={styles.footer}>
          <View style={styles.qrBox}>
            {business.qrCodeUrl ? (
              <Image src={business.qrCodeUrl} style={styles.qrCode} />
            ) : business.bankDetails?.upiId ? (
              <Image 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${business.bankDetails.upiId}&pn=${encodeURIComponent(business.businessName || 'Business Owner')}&cu=INR`)}`}
                style={styles.qrCode} 
              />
            ) : (
              <View style={[styles.qrCode, { border: 1, borderColor: '#EEE', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }]}>
                <Text style={{ fontSize: 6, color: '#999' }}>NO UPI ID</Text>
              </View>
            )}
            <Text style={styles.qrText}>UPI ID: {business.bankDetails?.upiId || '-'}</Text>
          </View>

          <View style={styles.signatureBox}>
            <Text style={styles.signText}>For {business.businessName || 'Radhe Tempo'},</Text>
            {business.signatureUrl && <Image src={business.signatureUrl} style={{ height: 40, width: 100, alignSelf: 'center', marginVertical: 4 }} />}
            <View style={styles.signatureLine} />
            <Text style={styles.authText}>(Authorized Signatory)</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};
