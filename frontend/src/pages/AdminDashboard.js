import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Tabs, Tab, IconButton, Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [individuals, setIndividuals] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('https://backend-old-smoke-6499.fly.dev/api/admin/individuals').then(r => r.json()),
      fetch('https://backend-old-smoke-6499.fly.dev/api/admin/groups').then(r => r.json())
    ]).then(([indData, grpData]) => {
      setIndividuals(Array.isArray(indData) ? indData : []);
      setGroups(Array.isArray(grpData) ? grpData : []);
      setLoading(false);
    });
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #e3f0ff 0%, #f8e1f4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 1200,
          width: '100%',
          px: { xs: 2, sm: 5 },
          py: { xs: 3, sm: 5 },
          borderRadius: 5,
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.10)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeIn 1s',
          transition: 'box-shadow 0.3s',
        }}
      >
        <Box sx={{ height: 8, width: '100%', background: 'linear-gradient(90deg, #1976d2 0%, #9c27b0 100%)', borderRadius: '8px 8px 0 0', position: 'absolute', top: 0, left: 0 }} />
        <IconButton
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', top: 16, left: 8, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', borderRadius: '50%', padding: 8, zIndex: 2 }}
          aria-label="Back"
          size="large"
        >
          <ArrowBackIcon style={{ fontSize: 32, color: '#1976d2' }} />
        </IconButton>
        <Button
          variant="outlined"
          color="error"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            py: 1,
            fontSize: 16,
            transition: 'all 0.2s',
            '&:hover, &:focus': {
              background: '#f8bbd0',
              color: '#b71c1c',
              borderColor: '#b71c1c',
              boxShadow: '0 4px 16px rgba(183, 28, 28, 0.12)'
            }
          }}
          onClick={() => {
            localStorage.removeItem('admin_token');
            window.location.href = '/admin/login';
          }}
        >
          Logout
        </Button>
        <img src="/logo.png" alt="Multi Ministries Logo" style={{ width: 120, margin: '32px auto 20px auto', display: 'block' }} />
        <Typography variant="h4" fontWeight={700} color="primary" gutterBottom sx={{ mt: 2 }}>
          Admin Dashboard
        </Typography>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ flex: 1 }}>
            <Tab label="Individual Registrations" />
            <Tab label="Group Registrations" />
          </Tabs>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              ml: 2,
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              py: 1,
              fontSize: 16,
              transition: 'all 0.2s',
              '&:hover, &:focus': {
                background: '#ede7f6',
                color: '#512da8',
                borderColor: '#512da8',
                boxShadow: '0 4px 16px rgba(76, 0, 130, 0.12)'
              }
            }}
            onClick={() => {
              const toCSV = (rows, headers) => {
                const esc = v => '"' + String(v).replace(/"/g, '""') + '"';
                return [headers.map(esc).join(','), ...rows.map(row => headers.map(h => esc(row[h] ?? '')).join(','))].join('\n');
              };
              if (tab === 0) {
                // Individual
                const headers = ['name','email','phone','church','country','accommodation','payment','created_at'];
                const csv = toCSV(individuals, headers);
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'individual_registrations.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              } else {
                // Group
                const headers = ['leader_name','leader_email','leader_phone','leader_church','leader_country','accommodation','payment','total','discount','created_at','members'];
                const rows = groups.map(g => ({ ...g, members: Array.isArray(g.members) ? g.members.map(m => `${m.name} (${m.email})`).join('; ') : g.members }));
                const csv = toCSV(rows, headers);
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'group_registrations.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }
            }}
          >
            Export CSV
          </Button>
        </Box>
      {loading ? <CircularProgress /> : (
        tab === 0 ? (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Church</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Accommodation</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {individuals.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.church}</TableCell>
                    <TableCell>{row.country}</TableCell>
                    <TableCell>{row.accommodation}</TableCell>
                    <TableCell>{row.payment}</TableCell>
                    <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        ) : (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Leader Name</TableCell>
                  <TableCell>Leader Email</TableCell>
                  <TableCell>Leader Phone</TableCell>
                  <TableCell>Church</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Members</TableCell>
                  <TableCell>Accommodation</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.leader_name}</TableCell>
                    <TableCell>{row.leader_email}</TableCell>
                    <TableCell>{row.leader_phone}</TableCell>
                    <TableCell>{row.leader_church}</TableCell>
                    <TableCell>{row.leader_country}</TableCell>
                    <TableCell>
                      {Array.isArray(row.members) ? row.members.map((m, idx) => (
                        <div key={idx}>{m.name} ({m.email})</div>
                      )) : row.members}
                    </TableCell>
                    <TableCell>{row.accommodation}</TableCell>
                    <TableCell>{row.payment}</TableCell>
                    <TableCell>{row.total}</TableCell>
                    <TableCell>{row.discount}</TableCell>
                    <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )
      )}
      </Paper>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}

export default AdminDashboard;
