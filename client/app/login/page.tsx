"use client";
import "@/styles/auth.css";
import TextInput from "../../components/form/TextInput";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthProvider";

interface FormValues {
  email: string;
  password: string;
}

const PageLogin = () => {
  const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const handleSubmitSuccess: SubmitHandler<FormValues> = async ({
    email,
    password,
  }: FormValues) => {
    try {
      await signIn(email, password);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="title">ログイン</h1>
      <div className="content">
        <form className="form" onSubmit={handleSubmit(handleSubmitSuccess)}>
          <div className="input-area">
            <TextInput
              id="email"
              label="メールアドレス"
              placeholder="you@example.com"
              errorMessage={errors.email?.message}
              {...register("email", {
                required: "必須項目です",
              })}
            />
            <TextInput
              id="password"
              label="パスワード"
              placeholder="半角英数6文字以上"
              errorMessage={errors.password?.message}
              {...register("password", {
                required: "必須項目です",
              })}
            />
          </div>
          <button type="submit" className="send-button">
            ログイン
          </button>
        </form>
        <p className="text-black text-base text-center">
          アカウント登録がまだの方は
          <Link href="/register">こちら</Link>
        </p>
      </div>
    </div>
  );
};

export default PageLogin;