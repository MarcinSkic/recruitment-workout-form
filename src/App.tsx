import { FilePicker } from './components/ui/filePicker'
import { Input } from './components/ui/input'
import { Slider } from './components/ui/slider'
import { Label } from '@/components/ui/label'

function App() {
  return (
    <main className="grid mt-24 m-6">
      <h2 className="text-2xl mb-6 font-medium">Personal info</h2>
      <div className="grid gap-6">
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

    </main>
  )
}

export default App
