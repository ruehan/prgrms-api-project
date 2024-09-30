import React from 'react'

interface AlertProps {
  children: React.ReactNode
  variant?: 'default' | 'destructive'
}

interface AlertTitleProps {
  children: React.ReactNode
}

interface AlertDescriptionProps {
  children: React.ReactNode
}

export const Alert: React.FC<AlertProps> = ({ children, variant = 'default' }) => {
  const baseClasses = 'p-4 rounded-lg border'
  const variantClasses =
    variant === 'destructive'
      ? 'bg-red-50 border-red-300 text-red-800'
      : 'bg-blue-50 border-blue-300 text-blue-800'

  return (
    <div className={`${baseClasses} ${variantClasses}`} role="alert">
      {children}
    </div>
  )
}

export const AlertTitle: React.FC<AlertTitleProps> = ({ children }) => {
  return <h4 className="mb-2 text-lg font-medium">{children}</h4>
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ children }) => {
  return <div className="text-sm">{children}</div>
}

// Usage example:
export const AlertExample: React.FC = () => {
  return (
    <Alert>
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>This is an informational alert.</AlertDescription>
    </Alert>
  )
}

export const DestructiveAlertExample: React.FC = () => {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Something went wrong. Please try again.</AlertDescription>
    </Alert>
  )
}
