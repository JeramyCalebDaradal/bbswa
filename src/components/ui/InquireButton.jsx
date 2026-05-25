import Button from '@mui/material/Button'

export default function InquireButton({ children, className = '', ...props }) {
  return (
    <Button
      variant="contained"
      sx={{ fontWeight: 400 }}
      className={`!px-10 !py-3 !rounded-[18px] !shadow-none !bg-[#272624] hover:!bg-[#191816] !text-white !text-base ${className}`}
      {...props}
    >
      {children}
    </Button>
  )
}
