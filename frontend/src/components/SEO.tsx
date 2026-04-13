import { Helmet } from "react-helmet";

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: "website" | "article" | "profile";
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  jsonLd?: object;
}

const SEO = ({
  title,
  description,
  canonicalUrl,
  ogType = "website",
  ogImage = "/og-image.jpg",
  twitterCard = "summary_large_image",
  jsonLd,
}: SEOProps) => {
  const siteUrl = "https://goldenphotography.vercel.app";
  const fullUrl = `${siteUrl}${canonicalUrl}`;
  const fullImageUrl = ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Golden Photography Beawar" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@golden_photography_bwr" />
      <meta name="twitter:creator" content="@golden_photography_bwr" />

      {/* Additional Meta Tags */}
      <meta name="author" content="Golden Photography" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="keywords" content="best photographer in beawar, best photographer in ajmer, best photographer in jodhpur, best photographer in jaipur, best photographer in pali, best photographer in rajasthan, best photographer in kishangarh, best photographer in nasirabad, best photographer in pushkar, best photographer in nagaur, best wedding photographer in beawar, best wedding photographer in ajmer, best wedding photographer in jodhpur, best wedding photographer in jaipur, best wedding photographer in pali, best wedding photographer in rajasthan, best pre wedding photographer in beawar, best pre wedding photographer in ajmer, best pre wedding photographer in jodhpur, best pre wedding photographer in jaipur, best pre wedding photographer in pali, best pre wedding photographer rajasthan, pre wedding shoot beawar, pre wedding shoot ajmer, pre wedding shoot rajasthan, wedding photography beawar, wedding photography ajmer, candid wedding photographer beawar, candid wedding photographer ajmer, birthday photography beawar, maternity shoot beawar, maternity photographer ajmer, event photographer beawar, golden photography beawar, photographer near me beawar, photographer near me ajmer, top photographer beawar, top photographer ajmer, professional photographer beawar, gopal das vaishnav photographer" />
      
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
