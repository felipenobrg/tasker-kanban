export interface LoadingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const Spinner = (props: LoadingProps) => {
  const { size = 'md' } = props
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
    xl: 'w-12 h-12',
  }
  return (
    <svg
      className={`animate-spin text-primary-500 ${sizeClasses[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
    >
      <rect width="256" height="256" fill="none" />
      <path
        d="M168,40a97,97,0,0,1,56,88,96,96,0,0,1-192,0A97,97,0,0,1,88,40"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  )
}

export default Spinner
