import { Link } from 'react-router-dom'
import { company } from '../../shared/company'

export default function Logo({ tone = 'color', className = 'h-10 sm:h-11', onClick }) {
  return (
    <Link to="/" onClick={onClick} className="inline-flex shrink-0" aria-label={`${company.name} home page`}>
      <img
        src={`/images/logo/logo-horizontal-${tone === 'white' ? 'white' : 'color'}.png`}
        alt={company.name}
        width="900"
        height="264"
        className={`w-auto ${className}`}
      />
    </Link>
  )
}
