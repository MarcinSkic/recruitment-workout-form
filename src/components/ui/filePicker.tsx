import * as React from 'react'
import { useDrop, useResponsive } from 'ahooks'
import { Button } from './button'
import RiCloseCircleFill from '~icons/ri/close-circle-fill'
import { cn } from '@/lib/utils'
import type { Field } from '@/components/fieldInput'

export interface FilePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  field: Field<File | undefined>
  setField: (field: Field<File | undefined>) => void
}

const FilePicker = React.forwardRef<HTMLInputElement, FilePickerProps>(
  ({ className, field, setField, onChange, ...props }, outerRef) => {
    const [isHovering, setIsHovering] = React.useState(false)
    const innerRef = React.useRef<HTMLInputElement>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)

    React.useImperativeHandle(outerRef, () => innerRef.current!, [])

    useDrop(containerRef, {
      onFiles: (files) => {
        const value = files?.[0]
        const result = field.schema.safeParse(value)

        setField({ ...field, correct: result.success, value })
        setIsHovering(false)
      },
      onDragEnter() {
        setIsHovering(true)
      },
      onDragLeave() {
        setIsHovering(false)
      },
    })

    const responsiveSize = useResponsive()

    return (
      <div
        className={cn(
          'h-24 w-full grid place-items-center rounded-lg border border-input bg-popover px-3 py-2 text-base ring-offset-background cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={containerRef}
        onClick={() => innerRef?.current?.click()}
      >
        <input
          className="hidden"
          type="file"
          ref={innerRef}
          onChange={((event) => {
            const value = event.target.files?.[0]
            const result = field.schema.safeParse(value)

            setField({ ...field, correct: result.success, value })
          })}
          {...props}
        />
        {isHovering
          ? (
              <span className="text-primary space-x-2">
                <span className=" underline underline-offset-2 decoration-primary decoration-1">Drop here</span>
              </span>
            )
          : field.value
            ? (
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium">{field.value.name}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-transparent size-6 hover:text-destructive"
                    onClick={(e) => {
                      setField({ ...field, correct: false, value: undefined })
                      if (innerRef?.current) {
                        innerRef.current.value = ''
                      }
                      e.stopPropagation()
                    }}
                  >
                    <RiCloseCircleFill className="size-6" />
                  </Button>
                </div>
              )
            : (
                <span className="text-primary space-x-2">
                  <span className=" underline underline-offset-2 decoration-primary decoration-1">Upload a file</span>
                  {responsiveSize.sm && <span className="text-muted ">or drag and drop here</span>}
                </span>
              )}

      </div>
    )
  },
)
FilePicker.displayName = 'FilePicker'

export { FilePicker }
