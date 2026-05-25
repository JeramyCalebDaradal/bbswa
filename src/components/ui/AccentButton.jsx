import Button from '@mui/material/Button'

export default function AccentButton({ children, className = '', ...props }) {
  return (
    <Button
      variant="contained"
      color="primary"
      sx={{ fontWeight: 400}}
      className={`!px-8 !py-3 !rounded-[18px] !shadow-none hover:!bg-[#e69700] !text-base  ${className}`}
      {...props}
    >
      {children}
    </Button>
  )
}
