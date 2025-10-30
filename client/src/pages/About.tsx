import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/i18n";
import MetaTags from "@/components/MetaTags";
import type { AboutPage } from "@shared/schema";

export default function About() {
  const { language } = useLanguage();

  const { data: aboutPage, isLoading } = useQuery<AboutPage>({
    queryKey: ["/api/about"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground" data-testid="text-loading">
          {language === 'me' ? 'Učitavanje...' : 'Loading...'}
        </div>
      </div>
    );
  }

  if (!aboutPage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground" data-testid="text-not-found">
          {language === 'me' ? 'Sadržaj nije pronađen' : 'Content not found'}
        </div>
      </div>
    );
  }

  const title = language === 'me' ? aboutPage.titleME : aboutPage.titleEN;
  const content = language === 'me' ? aboutPage.contentME : aboutPage.contentEN;
  const mission = language === 'me' ? aboutPage.missionME : aboutPage.missionEN;
  const vision = language === 'me' ? aboutPage.visionME : aboutPage.visionEN;

  const aboutSEO = {
    title,
    description: language === 'me'
      ? 'Saznajte više o Brain Box-u - premium poklon paketi sa personalizacijom za korporativne i novogodišnje prilike.'
      : 'Learn more about Brain Box - premium gift packages with personalization for corporate and New Year occasions.',
    keywords: language === 'me'
      ? ['o nama', 'brain box', 'poklon paketi', 'korporativni pokloni', 'misija', 'vizija']
      : ['about us', 'brain box', 'gift packages', 'corporate gifts', 'mission', 'vision'],
    type: 'website' as const
  };

  return (
    <div className="min-h-screen bg-background">
      <MetaTags config={aboutSEO} />
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-title">
              {title}
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          {/* Image */}
          {aboutPage.image && (
            <div className="mb-12">
              <img
                src={aboutPage.image}
                alt={title}
                className="w-full max-w-3xl mx-auto h-64 md:h-96 object-cover rounded-lg shadow-lg"
                data-testid="img-about"
              />
            </div>
          )}

          {/* Main Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg leading-relaxed whitespace-pre-wrap" data-testid="text-content">
              {content}
            </p>
          </div>

          {/* Mission & Vision */}
          {(mission || vision) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {mission && (
                <div className="bg-muted p-8 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4" data-testid="text-mission-title">
                    {language === 'me' ? 'Naša Misija' : 'Our Mission'}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap" data-testid="text-mission">
                    {mission}
                  </p>
                </div>
              )}

              {vision && (
                <div className="bg-muted p-8 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4" data-testid="text-vision-title">
                    {language === 'me' ? 'Naša Vizija' : 'Our Vision'}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap" data-testid="text-vision">
                    {vision}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-16">
            <p className="text-lg text-muted-foreground mb-6" data-testid="text-cta">
              {language === 'me' 
                ? 'Zainteresovani ste za naše poslovne poklon pakete?' 
                : 'Interested in our corporate gift packages?'}
            </p>
            <a
              href="/#contact"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
              data-testid="link-contact"
            >
              {language === 'me' ? 'Kontaktirajte Nas' : 'Contact Us'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
