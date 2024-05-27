import React from 'react'

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
      className={`animate-spin ${sizeClasses[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      style={{
        animation: 'spin 1s linear infinite',
      }}
    >
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="100, 200"
        strokeDashoffset="0"
        style={{
          animation: 'dash 1.5s ease-in-out infinite',
        }}
      ></circle>
      <style jsx>{`
        @keyframes dash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }
      `}</style>
    </svg>
  )
}

export default Spinner
