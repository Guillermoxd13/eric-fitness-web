// Schema.org JSON-LD components. Server components — emit a <script> tag with
// type="application/ld+json" so search engines (Google, Bing) can parse the
// site as a structured product, not just HTML.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eric-fitness-web.vercel.app";

export function OrganizationStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Eric Fitness",
    alternateName: "Eric/Fit",
    url: SITE_URL,
    logo: `${SITE_URL}/icon`,
    founder: {
      "@type": "Person",
      name: "Erickson Zambrano",
      sameAs: [
        "https://www.youtube.com/@erick4trainer",
        "https://www.instagram.com/erick4trainer",
      ],
    },
    sameAs: [
      "https://www.youtube.com/@erick4trainer",
      "https://www.instagram.com/erick4trainer",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "ericksonza9@gmail.com",
      contactType: "customer support",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ServiceStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Eric Fitness Premium",
    serviceType: "Online fitness training",
    description:
      "Plataforma de entrenamientos en vídeo con Erickson Zambrano. Fuerza, hipertrofia, movilidad, mentalidad, hábitos y nutrición.",
    provider: {
      "@type": "Organization",
      name: "Eric Fitness",
      url: SITE_URL,
    },
    areaServed: "Worldwide",
    offers: [
      {
        "@type": "Offer",
        name: "Plan mensual",
        price: "19.99",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "19.99",
          priceCurrency: "USD",
          billingDuration: "P1M",
          unitText: "MONTH",
        },
        category: "Subscription",
        url: `${SITE_URL}/pricing`,
      },
      {
        "@type": "Offer",
        name: "Plan anual",
        price: "179.99",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "179.99",
          priceCurrency: "USD",
          billingDuration: "P1Y",
          unitText: "YEAR",
        },
        category: "Subscription",
        url: `${SITE_URL}/pricing`,
      },
      {
        "@type": "Offer",
        name: "Sesión 1-a-1 con Erickson",
        price: "49.99",
        priceCurrency: "USD",
        category: "OneTime",
        url: `${SITE_URL}/coaching`,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function VideoStructuredData({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  embedUrl,
  duration,
}: {
  name: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  uploadDate?: string | null;
  embedUrl?: string | null;
  duration?: number | null;
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description: description ?? name,
    thumbnailUrl: thumbnailUrl ? [thumbnailUrl] : undefined,
    uploadDate: uploadDate ?? undefined,
    embedUrl: embedUrl ?? undefined,
    // ISO 8601 duration: PT{m}M{s}S
    duration:
      duration != null
        ? `PT${Math.floor(duration / 60)}M${duration % 60}S`
        : undefined,
    publisher: {
      "@type": "Organization",
      name: "Eric Fitness",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon` },
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
