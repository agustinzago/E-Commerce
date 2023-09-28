'use client'

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { type Store } from '@prisma/client'
import { Trash } from 'lucide-react'
import * as z from 'zod'

interface SettingsFormProps {
  initialData: Store
}

const formSchema = z.object({
  name: z.string().min(1)
})

const SettingsForm: React.FC<SettingsFormProps> = (
  { initialData }
) => {
  return (
    <>
        <div className='flex items-center justify-between'>
            <Heading
                title='Settings'
                description='Manage store preferences'
                />
            <Button
                variant='destructive'
                size='sm'
                onClick={() => {}}
            >
                <Trash className='h-4 v-4'/>
            </Button>
        </div>
        <Separator/>
    </>
  )
}

export default SettingsForm
