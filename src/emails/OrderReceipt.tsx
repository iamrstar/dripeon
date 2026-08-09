import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Img,
  Hr,
  Row,
  Column,
} from '@react-email/components';

interface OrderReceiptProps {
  orderId: string;
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  products: any[];
  totalAmount: number;
}

export const OrderReceipt = ({
  orderId,
  shippingAddress,
  products,
  totalAmount,
}: OrderReceiptProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logoText}>DRIPEON</Text>
          </Section>
          
          <Section style={bodySection}>
            <Text style={heading}>Order Confirmed</Text>
            <Text style={paragraph}>
              Hi {shippingAddress?.name || 'there'},
            </Text>
            <Text style={paragraph}>
              Thank you for your purchase! We've received your payment and are getting your order ready to be shipped. 
              We will notify you with the tracking details as soon as it ships.
            </Text>
            <Text style={orderIdStyle}>
              Order ID: #{orderId}
            </Text>
            
            <Hr style={hr} />

            <Text style={subheading}>Order Summary</Text>
            
            <Section style={tableSection}>
              {products?.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={{ width: '70%' }}>
                    <Text style={itemName}>{item.name}</Text>
                    <Text style={itemMeta}>Size: {item.size} | Qty: {item.quantity}</Text>
                  </Column>
                  <Column style={{ width: '30%', textAlign: 'right' as const }}>
                    <Text style={itemPrice}>₹{item.price * item.quantity}</Text>
                  </Column>
                </Row>
              ))}
              
              <Row style={totalRow}>
                <Column style={{ width: '70%' }}>
                  <Text style={totalLabel}>Total Paid</Text>
                </Column>
                <Column style={{ width: '30%', textAlign: 'right' as const }}>
                  <Text style={totalValue}>₹{totalAmount}</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            <Text style={subheading}>Shipping Details</Text>
            <Text style={addressText}>
              {shippingAddress?.name}<br />
              {shippingAddress?.street}<br />
              {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zip}
            </Text>

            <Hr style={hr} />
            <Text style={footerText}>
              If you have any questions about your order, reply to this email or contact info.dripeon@gmail.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  padding: '32px',
  backgroundColor: '#000000',
  textAlign: 'center' as const,
};

const logoText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '900',
  letterSpacing: '-1px',
  margin: '0',
};

const bodySection = {
  padding: '32px',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0 0 20px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555',
  margin: '0 0 16px',
};

const orderIdStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#888',
  backgroundColor: '#f5f5f5',
  padding: '8px 12px',
  borderRadius: '4px',
  display: 'inline-block',
  margin: '10px 0',
};

const subheading = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  margin: '24px 0 16px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '24px 0',
};

const tableSection = {
  width: '100%',
};

const itemRow = {
  borderBottom: '1px solid #eee',
  paddingBottom: '12px',
  marginBottom: '12px',
};

const itemName = {
  fontSize: '15px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0 0 4px',
};

const itemMeta = {
  fontSize: '13px',
  color: '#888',
  margin: '0',
};

const itemPrice = {
  fontSize: '15px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0',
};

const totalRow = {
  paddingTop: '16px',
};

const totalLabel = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0',
};

const totalValue = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0',
};

const addressText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#555',
  backgroundColor: '#f9f9f9',
  padding: '16px',
  borderRadius: '4px',
  margin: '0',
};

const footerText = {
  fontSize: '13px',
  lineHeight: '20px',
  color: '#888',
  textAlign: 'center' as const,
  margin: '20px 0 0',
};

export default OrderReceipt;
