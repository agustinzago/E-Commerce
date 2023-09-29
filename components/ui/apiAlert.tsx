'use client'

import { Copy, Server } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './alert'
import { Badge, type BadgeProps } from './badge'
import { Button } from './button'
import { toast } from 'react-hot-toast'

interface ApiAlertProps {
  title: string
  description: string
  variant: 'public' | 'admin'
}

const textMap: Record<ApiAlertProps['variant'], string> = {
  public: 'Public',
  admin: 'admin'
}
const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive'
}

export const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  description,
  variant = 'public'
}) => {
  const onCopy = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    navigator.clipboard.writeText(description)
    toast.success('API route copied to the clipboard')
  }
  return (
        <Alert>
            <Server className='h-4 w-4'/>
            <AlertTitle className='felx items-center gap-x-2'>
                { title }
                <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
            </AlertTitle>
            <AlertDescription className='mt-4 flex items-center justify-between'>
                <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold'>
                    {description}
                </code>
                <Button variant='outline' size='icon' onClick={onCopy}>
                    <Copy className='h-4 w-4' />
                </Button>
            </AlertDescription>
        </Alert>
  )
}
