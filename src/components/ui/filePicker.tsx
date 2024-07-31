import * as React from 'react'
import { Button } from './button'
import RiCloseCircleFill from '~icons/ri/close-circle-fill'
import { cn } from '@/lib/utils'

export interface FilePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const FilePicker = React.forwardRef<HTMLInputElement, FilePickerProps>(
  ({ className, onChange, ...props }, outerRef) => {
    const [fileName, setFileName] = React.useState<string>('')
    const innerRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(outerRef, () => innerRef.current!, [])

    return (
      <div
        className={cn(
          'h-20 w-full grid place-items-center rounded-lg border border-input bg-popover px-3 py-2 text-base ring-offset-background cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        onClick={() => innerRef?.current?.click()}
      >
        <input
          className="hidden"
          type="file"
          ref={innerRef}
          onChange={((e) => {
            setFileName(e.target.files?.[0]?.name ?? '')
            if (onChange) {
              onChange(e)
            }
          })}
          {...props}
        />
        {fileName
          ? (
              <div className="flex items-center gap-2">
                <span className="text-base font-medium">{fileName}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-transparent size-6 hover:text-destructive"
                  onClick={(e) => {
                    setFileName('')
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
          : <span className="text-primary underline underline-offset-2 decoration-primary decoration-1">Upload a file</span>}

      </div>
    )
  },
)
FilePicker.displayName = 'FilePicker'

export { FilePicker }
