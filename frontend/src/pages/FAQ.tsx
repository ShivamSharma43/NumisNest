import { Layout } from '@/components/layout/Layout';

const faqs = [
  { q: 'How do I add a coin to my wishlist?', a: 'Create a free account, browse the coin collection, and click the heart icon on any coin to add it to your wishlist.' },
  { q: 'How do I inquire about a coin?', a: 'Open the coin detail page and click "Send Inquiry". Fill in your message and we will get back to you via email.' },
  { q: 'Are the coins for sale?', a: 'NumisNest is primarily a reference and collection showcase platform. Use the inquiry form to ask about availability.' },
  { q: 'How do I change my password?', a: 'Log in, go to your Dashboard, open the Profile tab, and use the Change Password section.' },
  { q: 'How are coins categorised?', a: 'Coins are grouped by era (Ancient, Medieval, British, Republic), material (Gold, Silver, Copper, etc.) and rarity rating from 1–5.' },
  { q: 'Who can I contact for support?', a: 'Email us at official.numisnest@gmail.com and we will respond within 24 hours.' },
];

const FAQ = () => (
  <Layout>
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map(({ q, a }) => (
          <div key={q} className="border rounded-xl p-6 space-y-2">
            <h3 className="font-semibold text-lg">{q}</h3>
            <p className="text-muted-foreground leading-relaxed">{a}</p>
          </div>
        ))}
      </div>
    </div>
  </Layout>
);
export default FAQ;
