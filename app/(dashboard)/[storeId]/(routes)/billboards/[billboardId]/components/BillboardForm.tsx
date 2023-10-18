'use client'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Billboard } from '@prisma/client'
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
import { useOrigin } from '@/hooks/useOrigin'
import ImageUpload from '@/components/ui/image-upload'

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1)
})

interface BillboardFormProps {
  initialData: Billboard | null
}

type BillboardFormValues = z.infer<typeof formSchema>

const BillboardForm: React.FC<BillboardFormProps> = (
  { initialData }
) => {
  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit Billboard' : 'Create new billboard'
  const description = initialData ? 'Edit Billboard' : 'Add new billboard'
  const toastMessage = initialData ? 'Billboard updated' : 'Buildboard created'
  const action = initialData ? 'Save changes' : 'Create billboard'

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: ''
    }
  })

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/billboards`)
      toast.success(toastMessage)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
      router.refresh()
      router.push('/')
      toast.success('Billboard deleted')
    } catch (error) {
      toast.error('Make sure you remove all categories using this billboard')
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
        <AlertModal isOpen={open} onClose={() => { setOpen(false) }} onConfirm={onDelete} loading={loading}/>
        <div className='flex items-center justify-between'>
            <Heading
                title={title}
                description={description}
                />
            {!initialData && (
              <Button
                disabled={loading}
                variant='destructive'
                size='icon'
                onClick={() => { setOpen(true) }}
              >
                <Trash className='h-4 v-4'/>
              </Button>
            )}
        </div>
        <Separator/>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
            <FormField
              control={form.control}
              name='imageUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => { field.onChange(url) }}
                      onRemove={(url) => { field.onChange('') }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
            <div className="grid grid-cols-3 gap-8">
            </div>
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Billboard label' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
            <div className="grid grid-cols-3 gap-8">
            </div>
            <Button disabled={loading} className='ml-auto' type='submit'>
              {action}
            </Button>
          </form>
        </Form>
        <Separator />
    </>
  )
}

export default BillboardForm
