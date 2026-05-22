import { images } from '../../assets/images'

export default function AccentUnderline({ className = '' }) {
  return (
    <img
      src={images.underline}
      alt=""
      aria-hidden="true"
      className={`h-1.5 w-28 object-contain sm:w-32 ${className}`}
    />
  )
}
