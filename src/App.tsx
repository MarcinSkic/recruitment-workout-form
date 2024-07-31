import { Button } from './components/ui/button'
import { Calendar } from './components/ui/calendar'
import { FilePicker } from './components/ui/filePicker'
import { Input } from './components/ui/input'
import { Slider } from './components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from './components/ui/toggle-group'
import { Label } from '@/components/ui/label'

function App() {
  return (
    <main className="grid my-24 m-6 ">
      <h2 className="text-2xl mb-6 font-medium">Personal info</h2>
      <div className="grid gap-6 mb-8">
        <div>
          <Label>First Name</Label>
          <Input />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input />
        </div>
        <div>
          <Label>Email Address</Label>
          <Input />
        </div>
        <div className="grid gap-3 pb-8">
          <Label>Age</Label>
          <Slider value={[8]} min={8} max={100} step={1} />
        </div>
        <div>
          <Label>Photo</Label>
          <FilePicker accept="image/*" />
        </div>
      </div>
      <h2 className="text-2xl mb-6 font-medium">Your workout</h2>
      <div className="mb-6">
        <div className="mb-4">
          <Label>Date</Label>
          <Calendar showOutsideDays={false} weekStartsOn={1} modifiers={{ holiday: new Date() }} />
        </div>
        {false && (
          <div className="mb-4">
            <Label>Time</Label>
            <ToggleGroup type="single" variant="outline" size="lg">
              <ToggleGroupItem value="12:00">12:00</ToggleGroupItem>
              <ToggleGroupItem value="14:00">14:00</ToggleGroupItem>
              <ToggleGroupItem value="16:30">16:30</ToggleGroupItem>
              <ToggleGroupItem value="18:30">18:30</ToggleGroupItem>
              <ToggleGroupItem value="20:00">20:00</ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}
      </div>
      <Button size="lg" className="font-medium text-lg">Send Application</Button>
    </main>
  )
}

export default App
