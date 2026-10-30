import { SignIn } from '@clerk/nextjs';
import { Honeycomb } from '@/components/night/honeycomb';

export default function SignInPage() {
  return (
    <section className="page signin-page">
      <Honeycomb fx={0.5} fy={0.5} max={0.22} seed={29} />
      <div className="center">
        <SignIn />
      </div>
    </section>
  );
}
