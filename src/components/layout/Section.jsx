import Container from '@mui/material/Container'

export default function Section({
  id,
  children,
  className = '',
  containerClassName = '',
  as: Tag = 'section',
  disableContainer = false,
}) {
  const content = disableContainer ? (
    children
  ) : (
    <Container maxWidth="xl" className={`px-4 sm:px-6 lg:px-8 ${containerClassName}`}>
      {children}
    </Container>
  )

  return (
    <Tag id={id} className={`w-full ${className}`}>
      {content}
    </Tag>
  )
}
