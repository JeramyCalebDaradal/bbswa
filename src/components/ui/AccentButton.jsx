import Button from '@mui/material/Button'

export default function AccentButton({ children, className = '', ...props }) {
  return (
    <Button
      variant="contained"
      color="primary"
      className={`!px-8 !py-3 !text-base !shadow-none hover:!bg-[#e69700] ${className}`}
      {...props}
    >
      {children}
    </Button>
  )
}
