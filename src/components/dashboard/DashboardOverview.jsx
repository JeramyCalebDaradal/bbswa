import { Box, Card, Grid, Typography } from '@mui/material'
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material'
import '../styles/dashboard-content.css'

const StatCard = ({ title, value, change, icon: Icon }) => (
  <Card className="stat-card">
    <Box className="stat-card-content">
      <Box className="stat-icon-wrapper">
        <Icon className="stat-icon" />
      </Box>
      <Box className="stat-text">
        <Typography className="stat-title">{title}</Typography>
        <Typography className="stat-value">{value}</Typography>
        {change && <Typography className="stat-change">{change}</Typography>}
      </Box>
    </Box>
  </Card>
)

export default function DashboardOverview() {
  const stats = [
    {
      title: 'Total Posts',
      value: '24',
      change: '+3 this month',
      icon: TrendingUpIcon,
    },
    {
      title: 'Active Tags',
      value: '12',
      change: '+2 new tags',
      icon: TrendingUpIcon,
    },
    {
      title: 'Categories',
      value: '8',
      change: 'Fully organized',
      icon: TrendingUpIcon,
    },
  ]

  return (
    <Box className="dashboard-section">
      <Box className="section-header">
        <Typography variant="h5" className="section-title">
          Dashboard Overview
        </Typography>
        <Typography className="section-subtitle">
          Welcome back! Here's your dashboard summary.
        </Typography>
      </Box>

      <Grid container spacing={3} className="stats-grid">
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.title}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Card className="recent-activity-card">
        <Box className="card-header">
          <Typography variant="h6" className="card-title">
            Recent Activity
          </Typography>
        </Box>
        <Box className="activity-list">
          <Box className="activity-item">
            <Typography className="activity-text">
              You published a new post: "Getting Started with Security"
            </Typography>
            <Typography className="activity-time">2 hours ago</Typography>
          </Box>
          <Box className="activity-item">
            <Typography className="activity-text">
              Added new tag: "Cybersecurity"
            </Typography>
            <Typography className="activity-time">5 hours ago</Typography>
          </Box>
          <Box className="activity-item">
            <Typography className="activity-text">
              Updated category: "Technical Articles"
            </Typography>
            <Typography className="activity-time">1 day ago</Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}
