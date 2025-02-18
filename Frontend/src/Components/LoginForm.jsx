import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../Components/components/ui/button";
import { Input } from "../Components/components/ui/input";
import {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "../Components/components/ui/form";

const formSchema = z.object({
  Email: z.string().email("Please enter correct Email"),
  Password: z.string().min(6, "Passoword must be 6 characters"),
});

export default function LoginForm({ onSubmit }) {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Email: "",
      Password: "",
    },
  });

  return (
    <Form {...control}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 items-center justify-center mt-12 "
      >
        <FormField
          control={control}
          name="Email"
          render={({ field }) => (
            <FormItem className="ml-3 ">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="w-70"
                  type="email"
                  placeholder="Enter Your Email"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="Password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  className="w-70"
                  type="password"
                  placeholder="Enter Password"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 mt-16"
        >
          Login
        </Button>
      </form>
    </Form>
  );
}
