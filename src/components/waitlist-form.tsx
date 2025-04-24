'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
// import { addToWaitlist } from '../actions'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? 'Joining...' : 'Join Waitlist'}
    </Button>
  )
}

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const { toast } = useToast()

  async function addToWaitlist(formData: FormData) {
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get('email'),
      }),
    });
    return res.json()
  }

  async function handleSubmit(formData: FormData) {
    const result = await addToWaitlist(formData)
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
    } else {
      toast({
        title: "Success",
        description: result.success,
      })
      setEmail('')
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className={`flex flex-col md:flex-row gap-4 justify-center`}>
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-grow max-w-md bg-transparent relative z-10"
        />
        <SubmitButton />
      </div>
    </form>
  )
}


