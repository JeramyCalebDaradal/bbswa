import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import AccentButton from './AccentButton'

const ROUNDED = {
  none: { px: 0, className: '!rounded-none' },
  sm: { px: 4, className: '!rounded' },
  md: { px: 8, className: '!rounded-lg' },
  lg: { px: 12, className: '!rounded-xl' },
}

function getFieldSx(radiusPx) {
  return {
    margin: 0,
    width: '100%',
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderRadius: `${radiusPx}px`,
      '& fieldset': { border: 'none' },
    },
    '& .MuiInputBase-input': {
      padding: '12px 16px',
      fontSize: '16px',
    },
    '& .MuiInputBase-inputMultiline': {
      padding: '12px 16px',
    },
  }
}

export default function AppointmentForm({ className = '', rounded = 'md' }) {
  const [inquiryType, setInquiryType] = useState('client')
  const radius = ROUNDED[rounded] ?? ROUNDED.md
  const fieldSx = getFieldSx(radius.px)

  return (
    <form
      className={`rounded-none bg-black/40 px-6 py-8 text-white backdrop-blur-sm sm:px-8 sm:py-10 ${className}`}
      onSubmit={(e) => e.preventDefault()}
    >
      <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">Appointment</h2>

      <div className="flex flex-col gap-5 sm:gap-6">
        <TextField placeholder="Name" sx={fieldSx} />
        <TextField placeholder="Email" type="email" sx={fieldSx} />

        <FormControl className="w-full" sx={{ margin: 0 }}>
          <RadioGroup
            row
            value={inquiryType}
            onChange={(e) => setInquiryType(e.target.value)}
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            <FormControlLabel
              value="client"
              control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: '#ffa800' } }} />}
              label="I'm a Client"
              sx={{ color: 'white', mr: 0 }}
            />
            <FormControlLabel
              value="partnership"
              control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: '#ffa800' } }} />}
              label="Partnership"
              sx={{ color: 'white', mr: 0 }}
            />
          </RadioGroup>
        </FormControl>

        <TextField placeholder="Your message" multiline rows={4} sx={fieldSx} />

        <AccentButton type="submit" fullWidth className={`!py-3.5 !text-lg ${radius.className}`}>
          Send
        </AccentButton>
      </div>
    </form>
  )
}
