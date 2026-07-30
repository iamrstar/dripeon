import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
      <SignIn routing="hash" />
    </div>
  );
}
