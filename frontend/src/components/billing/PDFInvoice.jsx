import { 
  Document, Page, Text, View, StyleSheet, Image, Font 
} from '@react-pdf/renderer';
import dayjs from 'dayjs';
import logo from '../../assets/trans-logo.png';

// Styles matching the "Hembox" PDF aesthetics
// Styles matching the professional aesthetics
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, color: '#000', fontFamily: 'Helvetica' },
  
  // Header
  header: { flexDirection: 'row', borderWidth: 1, borderColor: '#ccc' },
  headerGarage: { flexDirection: 'row', backgroundColor: '#FFB800', borderWidth: 0, padding: 20, borderRadius: 4, marginBottom: 15 },
  logoBox: { width: '55%', padding: 15, flexDirection: 'row', alignItems: 'center' },
  logo: { width: 70, height: 50, objectFit: 'contain', marginRight: 15 },
  brandName: { fontSize: 28, fontWeight: 'bold', letterSpacing: -1 },
  slogan: { fontSize: 9, color: '#444', marginTop: 5 },
  
  metaBox: { width: '45%', borderLeftWidth: 1, borderColor: '#ccc' },
  metaRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc', height: 40, alignItems: 'center' },
  metaLabel: { width: 80, paddingLeft: 10, fontWeight: 'bold' },
  metaVal: { paddingLeft: 10, fontWeight: 'bold' },

  // Addressing Info Area
  addressArea: { flexDirection: 'row', borderWidth: 1, borderTopWidth: 0, borderColor: '#ccc', marginBottom: 15 },
  addressAreaGarage: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  addrCol: { width: '50%', padding: 12 },
  addrColGarage: { width: '50%' },
  addrLabel: { fontWeight: 'bold', fontSize: 10, marginBottom: 6 },
  addrLabelGarage: { backgroundColor: '#FFB800', padding: '3 8', borderRadius: 2, marginBottom: 8, fontSize: 9, fontWeight: 'bold' },
  addrText: { fontSize: 8.5, color: '#333', lineHeight: 1.4 },

  // Summary Banner
  summaryBanner: { backgroundColor: '#F3811E', color: 'white', textAlign: 'center', padding: 8, fontWeight: 'bold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2 },
  summaryBannerGarage: { backgroundColor: '#FFB800', color: '#000', textAlign: 'left', padding: '6 10', fontWeight: 'bold', fontSize: 9, borderRadius: 2, marginBottom: 8 },

  // Table
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#fdf7f2', 
    borderBottomWidth: 1, 
    borderColor: '#ccc',
    padding: '8 4',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 9
  },
  tableHeaderGarage: { 
    flexDirection: 'row', 
    backgroundColor: '#FFB800', 
    padding: '10 4',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 9
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderColor: '#ccc', 
    padding: '8 4',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 9
  },
  
  colNo: { width: '8%' },
  colDate: { width: '15%' },
  colFrom: { width: '22%' },
  colDesc: { width: '45%', textAlign: 'left', paddingLeft: 10 },
  colQty: { width: '15%' },
  colRate: { width: '20%', textAlign: 'right' },
  colTo: { width: '22%' },
  colChalan: { width: '18%' },
  colAmount: { width: '15%', textAlign: 'right', fontWeight: 'bold' },
  colAmountGarage: { width: '20%', textAlign: 'right', fontWeight: 'bold' },

  // Footer Total Row
  totalRowArea: { flexDirection: 'row', borderWidth: 1, borderTopWidth: 0, borderColor: '#ccc' },
  gratitudeBanner: { width: '67%', backgroundColor: '#F3811E', color: 'white', padding: 12, textAlign: 'center', fontWeight: 'bold', fontSize: 10 },
  totalLabelBox: { width: '18%', backgroundColor: '#f9f9f9', padding: 12, textAlign: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#ccc', fontWeight: 'bold' },
  totalValBox: { width: '15%', padding: 12, textAlign: 'right', fontWeight: 'bold', fontSize: 12 },
  
  totalRowGarage: { flexDirection: 'row', borderWidth: 1, borderColor: '#ccc', marginTop: -1 },
  totalLabelGarage: { width: '80%', padding: 10, fontWeight: 'bold', textAlign: 'left' },
  totalValueGarage: { width: '20%', padding: 10, textAlign: 'right', fontWeight: 'bold', fontSize: 11, backgroundColor: '#f9f9f9' },

  // Bank Section
  bankSection: { marginTop: 15, borderWidth: 1, borderColor: '#ccc' },
  bankHeader: { backgroundColor: '#fdf3f0', padding: '4 10', fontSize: 8, fontWeight: 'bold', borderBottomWidth: 1, borderColor: '#ccc' },
  bankContent: { padding: 10 },
  bankGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  bankItem: { width: '48%', flexDirection: 'row' },
  bankKey: { width: 80, fontSize: 8.5, color: '#555' },
  bankValue: { fontWeight: 'bold', fontSize: 9 },

  // Signature
  footerSection: { marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  footerBrand: { fontSize: 12, fontWeight: 'bold' },
  signBox: { width: 180, textAlign: 'center' },
  signLine: { borderTopWidth: 1, borderColor: '#000', marginTop: 35, marginBottom: 5 },
  signLabel: { fontSize: 8.5, fontWeight: 'bold' },
  
  termsBoxGarage: { width: '60%', borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 4, backgroundColor: '#fafafa' },
  footerStripeGarage: { height: 12, backgroundColor: '#FFB800', marginTop: 20, borderRadius: 2 }
});

export const PDFInvoice = ({ bill, business }) => {
  const isTransport = bill.type === 'transport';
  const items = bill.items || [];
  const themeColor = isTransport ? '#F3811E' : '#FFB800';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        {isTransport ? (
          <View style={styles.header}>
            <View style={styles.logoBox}>
              {business.logoUrl ? (
                <Image src={business.logoUrl} style={styles.logo} />
              ) : (
                <View style={{ width: 60, height: 45, backgroundColor: '#eee', borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{(business.businessName || 'B')[0]}</Text>
                </View>
              )}
              <View>
                <Text style={styles.brandName}>{business.businessName?.toUpperCase() || 'BUSINESS'}</Text>
                <Text style={styles.slogan}>{business.slogan || 'Move What Matters'}</Text>
              </View>
            </View>
            <View style={styles.metaBox}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Bill No.:</Text>
                <Text style={styles.metaVal}>{bill.invoiceNo}</Text>
              </View>
              <View style={[styles.metaRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.metaLabel}>Date :</Text>
                <Text style={styles.metaVal}>{dayjs(bill.billDate).format('DD/MM/YYYY')}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.headerGarage}>
            <View style={{ width: '70%' }}>
              <Text style={{ fontSize: 24, fontWeight: 'heavy', marginBottom: 4 }}>Repair Estimate</Text>
              <Text style={{ fontSize: 9, opacity: 0.8 }}>{business.slogan || 'Restoring Vehicles, Reviving Peace of Mind'}</Text>
            </View>
            <View style={{ width: '30%', textAlign: 'right' }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{business.businessName?.toUpperCase()}</Text>
              <Text style={{ fontSize: 8, marginTop: 4 }}>Bill No: {bill.invoiceNo}</Text>
            </View>
          </View>
        )}

        {/* Info/Addressing */}
        <View style={isTransport ? styles.addressArea : styles.addressAreaGarage}>
          <View style={isTransport ? [styles.addrCol, { borderRightWidth: 1, borderColor: '#ccc' }] : styles.addrColGarage}>
            <Text style={isTransport ? styles.addrLabel : styles.addrLabelGarage}>Customer Information</Text>
            <Text style={styles.addrText}><Text style={{ fontWeight: 'bold' }}>Name:</Text> {bill.customerName || bill.billedToName}</Text>
            <Text style={styles.addrText}><Text style={{ fontWeight: 'bold' }}>Address:</Text> {bill.customerAddress || bill.billedToAddress}</Text>
            <Text style={styles.addrText}><Text style={{ fontWeight: 'bold' }}>Phone:</Text> {bill.customerPhone || business.phone}</Text>
          </View>
          <View style={isTransport ? styles.addrCol : styles.addrColGarage}>
            <Text style={isTransport ? styles.addrLabel : styles.addrLabelGarage}>{isTransport ? 'Billed To' : 'Vehicle Information'}</Text>
            {!isTransport ? (
              <>
                <Text style={styles.addrText}><Text style={{ fontWeight: 'bold' }}>Make:</Text> {bill.vehicleCompany || '-'}</Text>
                <Text style={styles.addrText}><Text style={{ fontWeight: 'bold' }}>Model:</Text> {bill.vehicleModel || '-'}</Text>
                <Text style={styles.addrText}><Text style={{ fontWeight: 'bold' }}>Reg No:</Text> {bill.vehicleNo?.toUpperCase() || '-'}</Text>
              </>
            ) : (
              <Text style={styles.addrText}>{bill.billedToAddress}</Text>
            )}
          </View>
        </View>

        {!isTransport && <View style={styles.summaryBannerGarage}><Text>Repair Details</Text></View>}
        {isTransport && <View style={styles.summaryBanner}><Text>Billing Summary</Text></View>}

        {/* Table Content */}
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderTopWidth: isTransport ? 0 : 1 }}>
          <View style={isTransport ? styles.tableHeader : styles.tableHeaderGarage}>
            {isTransport ? (
              <>
                <Text style={styles.colNo}>No.</Text>
                <Text style={styles.colDate}>Date</Text>
                <Text style={styles.colFrom}>Company (From)</Text>
                <Text style={styles.colTo}>Company (To)</Text>
                <Text style={styles.colChalan}>Chalan No.</Text>
                <Text style={styles.colAmount}>Amount</Text>
              </>
            ) : (
              <>
                <Text style={styles.colDesc}>Description</Text>
                <Text style={styles.colQty}>Quantity</Text>
                <Text style={styles.colRate}>Unit Price (₹)</Text>
                <Text style={styles.colAmountGarage}>Total Price (₹)</Text>
              </>
            )}
          </View>

          {items.map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              {isTransport ? (
                <>
                  <Text style={styles.colNo}>{idx + 1}</Text>
                  <Text style={styles.colDate}>{dayjs(item.date).format('DD/MM/YY')}</Text>
                  <Text style={styles.colFrom}>{item.companyFrom || '-'}</Text>
                  <Text style={styles.colTo}>{item.companyTo || '-'}</Text>
                  <Text style={styles.colChalan}>{item.chalanNo || '-'}</Text>
                  <Text style={styles.colAmount}>{parseFloat(item.amount || 0).toLocaleString()}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.colDesc}>{item.description}</Text>
                  <Text style={styles.colQty}>{item.qty || 1}</Text>
                  <Text style={styles.colRate}>{parseFloat(item.rate || item.amount).toLocaleString()}</Text>
                  <Text style={styles.colAmountGarage}>{parseFloat(item.amount).toLocaleString()}</Text>
                </>
              )}
            </View>
          ))}
          
          {!isTransport && (
            <View style={styles.totalRowGarage}>
              <Text style={styles.totalLabelGarage}>Total</Text>
              <Text style={styles.totalValueGarage}>₹{(bill.grandTotal || bill.subtotal || 0).toLocaleString()}</Text>
            </View>
          )}
        </View>

        {isTransport && (
          <View style={styles.totalRowArea}>
            <View style={styles.gratitudeBanner}><Text>Grateful for Moving What Matters to You!</Text></View>
            <View style={styles.totalLabelBox}><Text>TOTAL :</Text></View>
            <View style={styles.totalValBox}><Text>₹{(bill.grandTotal || 0).toLocaleString()}</Text></View>
          </View>
        )}

        {/* Bottom Section */}
        <View style={{ marginTop: 25, flexDirection: 'row', justifyContent: 'space-between' }}>
          {!isTransport ? (
            <View style={styles.termsBoxGarage}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 5 }}>Terms and Conditions</Text>
              <Text style={{ fontSize: 7, color: '#555', lineHeight: 1.4 }}>
                By signing below, the customer agrees to the repair estimate and authorizes {business.businessName} to proceed with repairs. Estimates are valid for 30 days.
              </Text>
            </View>
          ) : (
            <View style={{ width: '60%' }}>
              <Text style={styles.footerBrand}>{business.businessName?.toUpperCase()} <Text style={{ fontWeight: 'normal', color: '#666', fontSize: 9 }}>— {business.slogan}</Text></Text>
            </View>
          )}

          <View style={styles.signBox}>
            <Text style={styles.signLabel}>{isTransport ? `For ${business.businessName},` : 'Customer Signature'}</Text>
            <View style={styles.signLine} />
            <Text style={{ fontSize: 7, color: '#444' }}>{isTransport ? '(Authorized Signatory)' : 'Date'}</Text>
          </View>
        </View>

        {!isTransport && <View style={styles.footerStripeGarage} />}
      </Page>
    </Document>
  );
};
