import React from 'react';
import { Container, Typography, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // Get payment type from state (if available)
  const payment = location.state?.payment;
  const summary = location.state?.summary;

  return (
    <Container maxWidth="sm" style={{ marginTop: '3rem', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Registration Successful!</Typography>
      <Typography variant="body1" gutterBottom>
        Thank you for registering for the REACH2025 Multi-Ministries Event. We have received your details.
      </Typography>
      {summary && (
        <div style={{ textAlign: 'left', margin: '2rem auto', maxWidth: 600, background: '#f6f6f6', padding: 16, borderRadius: 8 }}>
          <Typography variant="h6" gutterBottom>Registration Summary</Typography>
          {/* Group Registration Summary */}
          {summary.leader && summary.members ? (
            <>
              <Typography variant="subtitle1" gutterBottom><b>Group Leader:</b></Typography>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><b>Name:</b> {summary.leader.name}</li>
                <li><b>Email:</b> {summary.leader.email}</li>
                <li><b>Phone:</b> {summary.leader.phone}</li>
                <li><b>Church/Organization:</b> {summary.leader.church}</li>
                <li><b>Country:</b> {summary.leader.country}</li>
              </ul>
              <Typography variant="subtitle1" gutterBottom><b>Group Members:</b></Typography>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {summary.members.map((m, i) => (
                  <li key={i}>{i + 1}. <b>Name:</b> {m.name}, <b>Email:</b> {m.email}</li>
                ))}
              </ul>
              <Typography variant="subtitle1" gutterBottom><b>Accommodation:</b> {summary.accommodation === 'dorm' ? 'Dormitory' : 'Day Pass'}</Typography>
              <Typography variant="subtitle1" gutterBottom><b>Payment Option:</b> {summary.payment === 'paynow' ? 'Pay Now' : 'Pay at Venue'}</Typography>
              {summary.discount > 0 && (
                <Typography color="primary"><b>Discount applied:</b> -R{summary.discount.toFixed(2)}</Typography>
              )}
              <Typography variant="h6" gutterBottom><b>Total:</b> R{summary.total.toFixed(2)}</Typography>
            </>
          ) : (
            // Individual Registration Summary
            <>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><b>Name:</b> {summary.name}</li>
                <li><b>Church/Organization:</b> {summary.church}</li>
                <li><b>Country:</b> {summary.country}</li>
                <li><b>Email:</b> {summary.email}</li>
                <li><b>Phone:</b> {summary.phone}</li>
                <li><b>Emergency Contact Name:</b> {summary.emergencyName}</li>
                <li><b>Emergency Contact Number:</b> {summary.emergencyContact}</li>
                <li><b>Accommodation:</b> {summary.accommodation === 'dorm' ? 'Dormitory' : summary.accommodation === 'daypass' ? 'Day Pass' : ''}</li>
                {summary.accommodation === 'dorm' && (
                  <li><b>Bedding Confirmed:</b> {summary.bedding ? 'Yes' : 'No'}</li>
                )}
                {summary.accommodation === 'daypass' && (
                  <li><b>Days Selected:</b> {summary.dayPass && summary.dayPass.length > 0 ? summary.dayPass.map(d => d.replace('day', 'Day ')).join(', ') : ''}</li>
                )}
                <li><b>Payment Option:</b> {summary.payment === 'now' ? 'Pay Now' : 'Pay at Venue'}</li>
              </ul>
            </>
          )}
        </div>
      )}
      {payment === 'now' ? (
        <>
          <Typography variant="h6" color="secondary" gutterBottom>
            Please proceed to payment to complete your registration.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="https://multiministries.co.za/get-involved/#donate"
            target="_blank"
            rel="noopener"
            style={{ marginTop: 24 }}
          >
            Proceed to Payment
          </Button>
        </>
      ) : (
        <Typography variant="h6" color="primary" gutterBottom style={{ marginTop: 24 }}>
          Please remember to bring payment to the venue.
        </Typography>
      )}
      <IconButton
        onClick={() => navigate(-1)}
        style={{ position: 'absolute', top: 24, left: 24, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', borderRadius: '50%', padding: 8 }}
        aria-label="Back"
        size="large"
      >
        <ArrowBackIcon style={{ fontSize: 32, color: '#1976d2' }} />
      </IconButton>
    </Container>
  );
}
