import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
      <SignUp routing="hash" />
    </div>
  );
}
