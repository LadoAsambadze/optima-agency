import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { userStore } from "@/src/zustand/userStore";
import React, { Dispatch, SetStateAction, useState } from "react";
import { UserValidator } from "../validators/UserValidator";
import { axiosInstance } from "@/src/libs/utlis/axiosInstance";
import { Mail } from "lucide-react";
import { AxiosError } from "axios";

type UserInfoFormProps = {
  setIsVerificationStep: Dispatch<SetStateAction<boolean>>;
};

export default function UserInfoForm({
  setIsVerificationStep,
}: UserInfoFormProps) {
  const form = UserValidator();
  const setUserInfo = userStore((state) => state.setUserInfo);

  // State to track if request is in progress
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    try {
      // Set submitting state to true
      setIsSubmitting(true);

      const userData = {
        email: form.getValues("email"),
      };
      setUserInfo({
        firstname: form.getValues("firstname"),
        lastname: form.getValues("lastname"),
        email: form.getValues("email"),
        password: form.getValues("password"),
        confirmPassword: form.getValues("confirmPassword"),
      });

      const response = await axiosInstance.post("/signup", userData);

      if (response.data.message === "CODE_SEND") {
        setIsVerificationStep(true);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.data.message === "EMAIL_EXIST") {
          form.setError("email", {
            type: "manual",
            message: "Email already exists",
          });
        } else if (
          error.response.data.message === "VERIFICATION_CODE_ALREADY_SENT"
        ) {
          setIsVerificationStep(true);
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      // Set submitting state back to false
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Firstname"
                    {...field}
                    className="h-11"
                    onChange={(e) => field.onChange(e)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Lastname"
                    {...field}
                    className="h-11"
                    onChange={(e) => field.onChange(e)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  {...field}
                  className="h-11"
                  onChange={(e) => field.onChange(e)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Create a password"
                  {...field}
                  className="h-11"
                  onChange={(e) => field.onChange(e)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  {...field}
                  className="h-11"
                  onChange={(e) => field.onChange(e)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="h-11 w-full text-white mt-4"
          // Disable button if form is invalid or request is in progress
          disabled={isSubmitting}
        >
          <Mail className="mr-2 h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
