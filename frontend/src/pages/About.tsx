import { Layout } from '@/components/layout/Layout';

const About = () => (
  <Layout>
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-4xl font-bold">About NumisNest</h1>
      <p className="text-muted-foreground text-lg leading-relaxed">
        NumisNest is a dedicated platform for Indian numismatic heritage — preserving and showcasing
        the rich history of Indian coins from ancient eras to modern republic coinage.
      </p>
      <h2 className="text-2xl font-semibold">Our Mission</h2>
      <p className="text-muted-foreground leading-relaxed">
        We aim to make the knowledge and beauty of historical Indian coins accessible to collectors,
        historians, and enthusiasts worldwide. Our curated collection spans thousands of years of
        monetary history across dynasties, empires, and eras.
      </p>
      <h2 className="text-2xl font-semibold">Contact</h2>
      <p className="text-muted-foreground leading-relaxed">
        Have a question or want to inquire about a specific coin?{' '}
        <a href="mailto:official.numisnest@gmail.com" className="text-primary hover:underline">
          official.numisnest@gmail.com
        </a>
      </p>
    </div>
  </Layout>
);
export default About;
