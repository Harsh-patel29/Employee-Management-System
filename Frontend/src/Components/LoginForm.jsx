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
  Email: z.string().email({ message: "Please enter correct Email" }),
  Password: z.string().min(6, { message: "Passoword must be 6 characters" }),
});

export default function LoginForm({ onSubmit }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
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
        className="flex flex-col items-center gap-6"
      >
        <FormField
          control={control}
          name="Email"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Email:</FormLabel>
              <div>{errors?.Email && <span>{errors.Email.message}</span>}</div>
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
              <FormLabel>Password:</FormLabel>
              <div>
                {errors?.Password && <span>{errors.Password.message}</span>}
              </div>
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
          className="w-[80%] bg-blue-600 hover:bg-blue-700 xl:mt-10 lg:mt-8 md:mt-4 sm:w-[80%] sm:mt-5"
        >
          Login
        </Button>
      </form>
    </Form>
  );
}
