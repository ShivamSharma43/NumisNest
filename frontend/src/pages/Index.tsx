import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedCoins } from '@/components/home/FeaturedCoins';
import { CoinTypeHighlights } from '@/components/home/CoinTypeHighlight';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedCoins />
      <CoinTypeHighlights />
    </Layout>
  );
};

export default Index;
