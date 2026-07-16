import { AuthForm } from "@/components/auth/auth-form";

export default function SignUpPage() {
  return (
    <div className="py-4 md:py-10">
      <AuthForm mode="signup" />
    </div>
  );
}
