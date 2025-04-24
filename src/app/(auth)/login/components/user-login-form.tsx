"use client"

import * as React from "react"
import { z } from "zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/app/(auth)/login/action"
import { useToast } from "@/hooks/use-toast"
import {loginWithGoogle} from "@/lib/supabase/auth";

// Define validation schema with Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(5, "Password must be at least 5 characters"),
})

type LoginFormInputs = z.infer<typeof loginSchema>

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserLoginForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [loginError, setLoginError] = React.useState<string | undefined>()
  const { toast } = useToast()

  // React Hook Form integration with Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  })

  // Form submission handler
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true)
    setLoginError(undefined)
    try {
      const {user, error} = await login(data)
      if(error || !user) {
        setLoginError(error)
        toast({
          title: error,
          description: error || "Something went wrong.",
        })
      }else {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className={cn("grid gap-6", className)} {...props}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            {/* Email Field */}
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  disabled={isLoading}
                  {...register("email")}
              />
              {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            {/* Password Field */}
            <div className="grid gap-1">
              <Label htmlFor="password">Password</Label>
              <Input
                  id="password"
                  type="password"
                  placeholder="*****"
                  disabled={isLoading}
                  {...register("password")}
              />
              {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            {loginError && (
                <p className="text-sm text-red-500">{loginError}</p>
            )}
            {/* Submit Button */}
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In with Email
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
          </div>
        </div>
        <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={async () => {
              try {
                setIsLoading(true)
                await loginWithGoogle() // GitHub Login
                toast({
                  title: "GitHub login successful",
                  description: "Welcome back!",
                })
              } catch (error:any) {
                toast({
                  title: "GitHub login failed",
                  description: error.message || "Something went wrong.",
                  variant: 'destructive'
                })
              } finally {
                setIsLoading(false)
              }
            }}
        >
          {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
              <Icons.gitHub className="mr-2 h-4 w-4" />
          )}
          GitHub
        </Button>
      </div>
  )
}
