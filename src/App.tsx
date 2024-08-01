import { useState } from 'react'
import { z } from 'zod'
import type { Field } from './components/fieldInput'
import FieldInput from './components/fieldInput'
import FieldDateTime from './components/fieldDateTime'
import { Button } from '@/components/ui/button'
import { FilePicker } from '@/components/ui/filePicker'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

function App() {
  const [firstName, setFirstName] = useState<Field<string>>({ value: '', correct: false, schema: z.string().min(1, 'First name is required') })
  const [lastName, setLastName] = useState<Field<string>>({ value: '', correct: false, schema: z.string().min(1, 'Last name is required') })
  const [email, setEmail] = useState<Field<string>>({ value: '', correct: false, schema: z.string().min(1, 'Email is required').email('Please use correct formatting.\nExample: address@email.com') })
  const [age, setAge] = useState<Field<number>>({ value: 8, correct: true, schema: z.number().min(8).max(100) })
  const [photo, setPhoto] = useState<Field<File | undefined>>({ value: undefined, correct: false, schema: z.instanceof(File) })

  const [date, setDate] = useState<Field<Date | undefined>>({ value: undefined, correct: false, schema: z.date() })

  const valid = firstName.correct && lastName.correct && email.correct && age.correct && photo.correct && date.correct

  function onAgeChange([value]: number[]) {
    setAge({ ...age, correct: age.schema.safeParse(value).success, value })
  }

  return (
    <form className="grid my-24 m-6">
      <h2 className="text-2xl mb-6 font-medium">Personal info</h2>
      <div className="grid gap-6 mb-8">
        <div>
          <Label>First Name</Label>
          <FieldInput field={firstName} setField={setFirstName} />
        </div>
        <div>
          <Label>Last Name</Label>
          <FieldInput field={lastName} setField={setLastName} />
        </div>
        <div>
          <Label>Email Address</Label>
          <FieldInput field={email} setField={setEmail} />
        </div>
        <div className="grid gap-3 pb-8">
          <Label>Age</Label>
          <Slider value={[age.value]} onValueChange={onAgeChange} min={8} max={100} step={1} />
        </div>
        <div>
          <Label>Photo</Label>
          <FilePicker accept="image/*" field={photo} setField={setPhoto} />
        </div>
      </div>
      <h2 className="text-2xl mb-6 font-medium">Your workout</h2>
      <FieldDateTime field={date} setField={setDate} />
      <Button
        type="submit"
        disabled={!valid}
        size="lg"
        className="font-medium text-lg"
      >
        Send Application
      </Button>
    </form>
  )
}

export default App
