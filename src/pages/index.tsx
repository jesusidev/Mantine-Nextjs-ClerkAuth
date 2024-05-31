import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { Hero } from '~/components/hero';
import LayoutPage from '~/layouts/page';

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    router.push('/dashboard');
  }

  return (
    <LayoutPage>
      <Hero />
    </LayoutPage>
  );
}
