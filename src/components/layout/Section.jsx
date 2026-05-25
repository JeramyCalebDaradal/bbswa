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
    <Container
      maxWidth={false}
      disableGutters
      className={`mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12 ${containerClassName}`}
    >
      {children}
    </Container>
  )

  return (
    <Tag id={id} className={`w-full ${className}`}>
      {content}
    </Tag>
  )
}
