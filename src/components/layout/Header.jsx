import { useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { images } from '../../assets/images'
import { navLinks } from '../../data/homeContent'

export default function Header({ overlay = false }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header
        className={`relative z-20 w-full ${
          overlay ? 'bg-transparent' : 'bg-black'
        }`}
      >
        <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 pt-10">
          <a href="#home" className="shrink-0">
            <img src={images.logo} alt="Black Bear Securities" className="h-17 w-auto sm:h-17" />
          </a>

          <nav className="hidden items-center gap-4 lg:flex xl:gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm transition-colors xl:text-base ${
                  link.active ? 'font-semibold text-bbs-orange' : 'text-white hover:text-bbs-orange'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <IconButton
            color="inherit"
            edge="end"
            className="!text-white lg:!hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </IconButton>
        </div>
      </header>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box className="flex w-72 flex-col bg-black text-white" role="presentation">
          <div className="flex items-center justify-between p-4">
            <img src={images.logo} alt="Black Bear Securities" className="h-8" />
            <IconButton onClick={() => setOpen(false)} aria-label="Close menu" className="!text-white">
              <CloseIcon />
            </IconButton>
          </div>
          <List>
            {navLinks.map((link) => (
              <ListItemButton key={link.label} component="a" href={link.href} onClick={() => setOpen(false)}>
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    className: link.active ? 'text-bbs-orange font-semibold' : 'text-white',
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  )
}
