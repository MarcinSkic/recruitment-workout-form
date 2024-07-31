import React from 'react'
import type { ZodSchema } from 'zod'
import type { InputProps } from '@/components/ui/input'
import { Input } from '@/components/ui/input'
import PajamasStatusAlert from '~icons/pajamas/status-alert'
import { cn } from '@/lib/utils'

export interface Field<T> {
  value: T
  correct: boolean
  schema: ZodSchema<T>
}

interface FieldInputProps extends InputProps {
  field: Field<string>
  setField: (field: Field<string>) => void
}

export default function FieldInput({ field, setField, ...props }: FieldInputProps) {
  const [touched, setTouched] = React.useState(false)
  const [dirty, setDirty] = React.useState(false)
  const [error, setError] = React.useState('')

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    const result = field.schema.safeParse(value)

    if (result.success) {
      setDirty(false)
      setError('')
    }
    else if (dirty) {
      setError(result.error.issues[0].message)
    }

    setField({ ...field, correct: result.success, value })
    setTouched(true)
  }

  function onBlur() {
    if (touched) {
      const result = field.schema.safeParse(field.value)

      if (!result.success) {
        setDirty(true)
        setError(result.error.issues[0].message)
      }
    }
  }

  return (
    <div>
      <Input
        className={cn(dirty && 'ring-2 ring-destructive ring-offset-0 bg-[hsl(0,_89%,_96%)]')}
        value={field.value}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
      {error && (
        <div className="flex items-start gap-2 mt-1">
          <PajamasStatusAlert className="size-4 mt-1 text-destructive" />
          <span className="font-normal text-sm whitespace-pre">{error}</span>
        </div>
      )}
    </div>
  )
}
