import { Layout } from '@/components/layout/Layout';

const Terms = () => (
  <Layout>
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-4xl font-bold">Terms of Service</h1>
      <p className="text-muted-foreground text-sm">Last updated: January 2025</p>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Use of Service</h2>
        <p className="text-muted-foreground leading-relaxed">
          NumisNest is a numismatic reference and inquiry platform. By using this service, you agree
          to use it for lawful purposes only and to provide accurate information when creating an account.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Intellectual Property</h2>
        <p className="text-muted-foreground leading-relaxed">
          All coin descriptions, images, and articles on NumisNest are the property of NumisNest
          or their respective owners. Reproduction without permission is not permitted.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
        <p className="text-muted-foreground leading-relaxed">
          NumisNest provides coin information for reference purposes only. We are not responsible
          for any transactions or decisions made based on information found on this platform.
        </p>
      </section>
    </div>
  </Layout>
);
export default Terms;
