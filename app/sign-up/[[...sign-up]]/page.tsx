import { SignUp } from '@clerk/nextjs';
import { Honeycomb } from '@/components/night/honeycomb';
import { RememberReturn } from '@/components/auth/remember-return';

export default function SignUpPage() {
  return (
    <section className="page signin-page">
      <Honeycomb fx={0.5} fy={0.5} max={0.22} seed={29} />
      <div className="center">
        <SignUp />
        <RememberReturn />
      </div>
    </section>
  );
}
