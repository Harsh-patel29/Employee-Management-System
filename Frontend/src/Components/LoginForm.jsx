import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../Components/components/ui/button';
import { Input } from '../Components/components/ui/input';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
} from '../Components/components/ui/form';
import { useSelector } from 'react-redux';
const formSchema = z.object({
  Email: z.string().email({ message: 'Please enter correct Email' }),
  Password: z.string().min(6, { message: 'Passoword must be 6 characters' }),
});

export default function LoginForm({ onSubmit }) {
  const { loading } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Email: '',
      Password: '',
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
              <FormLabel className="font-[Inter,sans-serif] text-[#344054] w-100">
                Email:
              </FormLabel>
              <div>{errors?.Email && <span>{errors.Email.message}</span>}</div>
              <FormControl>
                <Input
                  className="w-80 p-[6px] rounded-sm"
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
              <FormLabel className="font-[Inter,sans-serif] text-[#344054] w-100">
                Password:
              </FormLabel>
              <div>
                {errors?.Password && <span>{errors.Password.message}</span>}
              </div>
              <FormControl>
                <Input
                  className="w-80 p-[6px] rounded-sm"
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
          className="w-80 bg-blue-600 hover:bg-blue-700 mt-[15px] font-[Inter,sans-serif]"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  );
}
