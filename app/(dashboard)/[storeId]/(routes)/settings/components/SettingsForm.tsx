'use client'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Store } from '@prisma/client'
import { Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { AlertModal } from '@/components/modals/AlertModal'
import { ApiAlert } from '@/components/ui/apiAlert'

interface SettingsFormProps {
  initialData: Store
}

const formSchema = z.object({
  name: z.string().min(1)
})

type SettingFormValues = z.infer<typeof formSchema>

const SettingsForm: React.FC<SettingsFormProps> = (
  { initialData }
) => {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })

  const onSubmit = async (data: SettingFormValues) => {
    try {
      await axios.patch(`/api/stores/${params.storeId}`, data)
      router.refresh()
      toast.success('Store updated.')
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      await axios.delete(`/api/stores/${params.storeId}`)
      router.refresh()
      router.push('/')
      toast.success('Store deleted')
    } catch (error) {
      toast.error('Make sure you remove your products and categories first.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
        <AlertModal isOpen={open} onClose={() => { setOpen(false) }} onConfirm={onDelete} loading={loading}/>
        <div className='flex items-center justify-between'>
            <Heading
                title='Settings'
                description='Manage store preferences'
                />
            <Button
                disabled={loading}
                variant='destructive'
                size='icon'
                onClick={() => { setOpen(true) }}
            >
                <Trash className='h-4 v-4'/>
            </Button>
        </div>
        <Separator/>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
            <div className="grid grid-cols-3 gap-8">
              <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Store name' {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
            </div>
            <Button disabled={loading} className='ml-auto' type='submit'>
              Save changes
            </Button>
          </form>
        </Form>
        <Separator />
        <ApiAlert
          title='NEXT_PUBLIC_API_URL'
          description={`${origin}/api/${params.storeId}`}
          variant='public' />
    </>
  )
}

export default SettingsForm
