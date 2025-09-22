'use client';
import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {useRouter} from 'next/navigation';
import {CreateLoginValidator, loginRequest} from '@/lib/validators/login';
import {zodResolver} from '@hookform/resolvers/zod';
import {RotateCw} from 'lucide-react';
import {FC, useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
interface SignInFormProps {
  t: {
    username: {
      label: string;
      placeholder: string;
      error: string;
    };
    password: {
      label: string;
      error: string;
    };
    loginButton: string;
  };
}

const SignInForm: FC<SignInFormProps> = ({t}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword] = useState(false);
  const loginValidator = CreateLoginValidator({
    usernameError: t.username.error,
    passwordError: t.password.error,
  });
  const form = useForm<loginRequest>({
    resolver: zodResolver(loginValidator),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onLogIn = async (data: loginRequest) => {
    try {
      setLoading(true);

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      const response = await res.json();

      if (!res.ok) {
        toast.error('Invalid credentials');
        return;
      }

      // Use window.location for full page reload with new cookie
      window.location.href = response.redirectTo || '/fr';
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onLogIn)} className="mt-8 space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({field}) => (
            <FormItem>
              <FormLabel className="font-semibold text-[#69758C]">{t.username.label}</FormLabel>
              <FormControl>
                <Input className="shadow-xl" placeholder={t.username.placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormLabel className="font-semibold text-[#69758C]">{t.password.label}</FormLabel>
              <FormControl>
                <div className="flex w-full items-center justify-between">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    className="shadow-xl"
                    placeholder="********"
                    {...field}></Input>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="relative h-10 w-full">
          <Button disabled={loading} className="absolute right-0" type="submit">
            {loading && <RotateCw className="mr-3 h-4 w-4 animate-spin" />}
            {t.loginButton}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;
