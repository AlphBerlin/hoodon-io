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
import { useToast } from "@/hooks/use-toast"
import {signup} from "@/app/(auth)/signup/action";
import {loginWithGoogle} from "@/lib/supabase/auth";

// Define validation schema with Zod
const signupSchema = z
    .object({
      email: z.string().email("Invalid email address").nonempty("Email is required"),
      password: z.string().min(5, "Password must be at least 5 characters"),
      confirmPassword: z.string(),
      agreeToTerms: z.literal(true, {
        errorMap: () => ({ message: "You must agree to the terms and conditions" }),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords must match",
    })

type SignupFormInputs = z.infer<typeof signupSchema>

interface UserSignupFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserSignupForm({ className, ...props }: UserSignupFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { toast } = useToast()

  // React Hook Form integration with Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
  })

  // Form submission handler
  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    setIsLoading(true)
    try {
      await signup(data)
      toast({
        title: "Signup successful",
        description: "Welcome aboard!",
      })
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Something went wrong.",
      })
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
            {/* Confirm Password Field */}
            <div className="grid gap-1">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="*****"
                  disabled={isLoading}
                  {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            {/* Terms and Conditions */}
            <div className="flex items-center gap-2">
              <input
                  type="checkbox"
                  id="agreeToTerms"
                  {...register("agreeToTerms")}
                  disabled={isLoading}
                  className="h-4 w-4 border-gray-300 rounded"
              />
              <Label htmlFor="agreeToTerms">
                I agree to the{" "}
                <a href="/terms-and-conditions" className="underline">
                  Terms & Conditions
                </a>
              </Label>
              {errors.agreeToTerms && (
                  <p className="text-sm text-red-500">{errors.agreeToTerms.message}</p>
              )}
            </div>
            {/* Submit Button */}
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign Up
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or sign up with
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
                await loginWithGoogle()
                toast({
                  title: "Google signup successful",
                  description: "Welcome aboard!",
                })
              } catch (error: any) {
                toast({
                  title: "Google signup failed",
                  description: error.message || "Something went wrong.",
                  variant: "destructive",
                })
              } finally {
                setIsLoading(false)
              }
            }}
        >
          {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
              <Icons.google className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
      </div>
  )
}
