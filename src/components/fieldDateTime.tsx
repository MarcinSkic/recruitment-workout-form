import { useEffect, useMemo, useState } from 'react'
import type { ActiveModifiers } from 'react-day-picker'
import { z } from 'zod'
import { isSameDay, parse } from 'date-fns'
import type { Field } from './fieldInput'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { CalendarProps } from '@/components/ui/calendar'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import MdiInformation from '~icons/mdi/information'

export type FieldDateTimeProps = CalendarProps & {
  field: Field<Date | undefined>
  setField: (field: Field<Date | undefined>) => void
}

const DateMetadataSchema = z.array(z.object({
  date: z.string(),
  name: z.string(),
  type: z.enum(['NATIONAL_HOLIDAY', 'OBSERVANCE']),
}))

export default function FieldDateTime({ field, setField, ...props }: FieldDateTimeProps) {
  const [year, setYear] = useState(new Date().getFullYear())
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [dateIsAvailable, setDateIsAvailable] = useState(false)
  const [time, setTime] = useState<string>()
  const [holidayDates, setHolidayDates] = useState<{ date: Date, name: string, type: 'NATIONAL_HOLIDAY' | 'OBSERVANCE' }[]>([])
  const [observanceDates, setObservanceDates] = useState<{ date: Date, name: string, type: 'NATIONAL_HOLIDAY' | 'OBSERVANCE' }[]>([])
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<string>('')

  const holidayMatcher = useMemo(() => [{ dayOfWeek: [0] }, ...holidayDates.map(d => d.date)], [holidayDates])
  const observanceMatcher = useMemo(() => observanceDates.map(d => d.date), [observanceDates])

  useEffect(() => {
    let ignore = false

    async function getSpecialDates() {
      setLoading(true)

      try {
        const response = await Promise.all([fetch(`https://api.api-ninjas.com/v1/holidays?country=PL&year=${year}&type=national_holiday`, {
          headers: {
            'X-Api-Key': import.meta.env.VITE_API_KEY,
          },
        }), fetch(`https://api.api-ninjas.com/v1/holidays?country=PL&year=${year}&type=observance`, {
          headers: {
            'X-Api-Key': import.meta.env.VITE_API_KEY,
          },
        })])
        const [holidays, observances] = (await Promise.all(response.map(r => r.json()))).map((dates) => {
          const parsedDates = DateMetadataSchema.parse(dates)
          return parsedDates.map(d => ({
            date: new Date(d.date),
            name: d.name,
            type: d.type,
          }))
        },
        )

        setHolidayDates(holidays)
        setObservanceDates(observances)
      }
      catch (e) {
        console.error(e)
        setInfo('Loading holidays failed. Please refresh page to try again.')
      }

      if (ignore)
        return

      setLoading(false)
    }

    getSpecialDates()

    return () => {
      ignore = true
    }
  }, [year])

  function onMonthChange(month: Date) {
    setYear(month.getFullYear())
  }

  function onDateSelect(date: Date, _triggerDate: Date, modifiers: ActiveModifiers) {
    if (!date) {
      setDate(undefined)
      setDateIsAvailable(false)
      setInfo('')
      updateDateField(undefined, false, time)
      return
    }

    let dateIsAvailable = true
    if (modifiers.holiday) {
      const text = holidayDates.find(d => isSameDay(d.date, date))?.name ?? 'sunday'
      setInfo(`It is ${text}.`)
      dateIsAvailable = false
    }
    else if (modifiers.observance) {
      const text = observanceDates.find(d => isSameDay(d.date, date))?.name ?? ''
      setInfo(`It is ${text}.`)
    }
    else {
      setInfo('')
    }

    setDateIsAvailable(dateIsAvailable)
    setDate(date)
    updateDateField(date, dateIsAvailable, time)
  }

  function onTimeSelect(time: string) {
    setTime(time)
    updateDateField(date, dateIsAvailable, time)
  }

  function updateDateField(date: Date | undefined, dateIsAvailable: boolean, time: string | undefined) {
    if (date && dateIsAvailable && time) {
      setField({
        ...field,
        value: parse(time, 'HH:mm', date),
        correct: true,
      })
    }
    else {
      setField({
        ...field,
        value: undefined,
        correct: false,
      })
    }
  }

  return (
    <div className="mb-6">
      <div className="mb-4">
        <Label>Date</Label>
        <Calendar
          mode="single"
          selected={date}
          // @ts-expect-error: Type „Dispatch<SetStateAction<Date | undefined>>” cannot be assigned to type „SelectRangeEventHandler”
          onSelect={onDateSelect}
          disabled={loading}
          disableNavigation={loading}
          onMonthChange={onMonthChange}
          showOutsideDays={false}
          weekStartsOn={1}
          modifiers={{ holiday: holidayMatcher, observance: observanceMatcher }}
          {...props}
        />
        {info && (
          <div className="flex items-center gap-2 mt-2">
            <MdiInformation className="text-secondary" />
            <div className="text-sm font-normal">{info}</div>
          </div>
        )}
      </div>
      {dateIsAvailable && (
        <div className="mb-4">
          <Label>Time</Label>
          <ToggleGroup type="single" variant="outline" size="lg" value={time} onValueChange={onTimeSelect}>
            <ToggleGroupItem value="12:00">12:00</ToggleGroupItem>
            <ToggleGroupItem value="14:00">14:00</ToggleGroupItem>
            <ToggleGroupItem value="16:30">16:30</ToggleGroupItem>
            <ToggleGroupItem value="18:30">18:30</ToggleGroupItem>
            <ToggleGroupItem value="20:00">20:00</ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}
    </div>
  )
}
