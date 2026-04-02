import { Layout } from '@/components/layout/Layout';

const Privacy = () => (
  <Layout>
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <p className="text-muted-foreground text-sm">Last updated: January 2025</p>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Information We Collect</h2>
        <p className="text-muted-foreground leading-relaxed">
          We collect only the information necessary to provide our services: your name, email address,
          and wishlist preferences. We do not sell or share your personal data with third parties.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
        <p className="text-muted-foreground leading-relaxed">
          Your information is used solely to manage your account, process coin inquiries, and
          personalise your experience on NumisNest.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p className="text-muted-foreground leading-relaxed">
          For privacy-related questions, email us at{' '}
          <a href="mailto:official.numisnest@gmail.com" className="text-primary hover:underline">
            official.numisnest@gmail.com
          </a>
        </p>
      </section>
    </div>
  </Layout>
);
export default Privacy;
