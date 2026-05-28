import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  IconButton,
  Divider,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Article as BlogIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import '../styles/sidebar.css'

export default function Sidebar({ activeSection, setActiveSection, isMobileOpen, setIsMobileOpen }) {
  const navigate = useNavigate()
  const [blogExpanded, setBlogExpanded] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleNavigation = (section) => {
    setActiveSection(section)
    if (window.innerWidth < 768) {
      setIsMobileOpen(false)
    }
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <DashboardIcon /> },
    { id: 'profile', label: 'Profile Settings', icon: <PersonIcon /> },
  ]

  const sidebarContent = (
    <Box className="sidebar-content">
      <Box className="sidebar-header">
        <Typography variant="h6" className="sidebar-logo">
          Dashboard
        </Typography>
        <IconButton
          className="sidebar-close-btn"
          onClick={() => setIsMobileOpen(false)}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ my: 2 }} />

      <List className="sidebar-menu">
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.id)}
              className={`sidebar-menu-item ${activeSection === item.id ? 'active' : ''}`}
            >
              <ListItemIcon className="sidebar-icon">{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setBlogExpanded(!blogExpanded)}
            className="sidebar-menu-item"
          >
            <ListItemIcon className="sidebar-icon">
              <BlogIcon />
            </ListItemIcon>
            <ListItemText primary="Blog" />
            {blogExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
        </ListItem>

        <Collapse in={blogExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className="sidebar-submenu">
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation('blog-posts')}
                className={`sidebar-submenu-item ${activeSection === 'blog-posts' ? 'active' : ''}`}
              >
                <ListItemText primary="Posts" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation('blog-tags')}
                className={`sidebar-submenu-item ${activeSection === 'blog-tags' ? 'active' : ''}`}
              >
                <ListItemText primary="Tags" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation('blog-categories')}
                className={`sidebar-submenu-item ${activeSection === 'blog-categories' ? 'active' : ''}`}
              >
                <ListItemText primary="Categories" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>

      <Divider sx={{ my: 2 }} />

      <Box className="sidebar-footer">
        <ListItemButton
          onClick={handleLogout}
          className="sidebar-logout-btn"
        >
          <ListItemIcon className="sidebar-icon">
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <>
      <IconButton
        className="sidebar-mobile-toggle"
        onClick={() => setIsMobileOpen(true)}
        size="small"
      >
        <MenuIcon />
      </IconButton>

      {/* Desktop Sidebar */}
      <aside className="sidebar-desktop">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        className="sidebar-drawer"
      >
        {sidebarContent}
      </Drawer>
    </>
  )
}
