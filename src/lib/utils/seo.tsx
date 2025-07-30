import { Helmet } from 'react-helmet';

type RenderPageMetaProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

export function RenderPageMeta(props: RenderPageMetaProps = {}) {
  const {
    title = 'Learning Africa (The Future of Online Education)',
    description = 'The future of online education is here. Join us at Learning Africa to explore, learn, and grow.',
    image = 'https://learningafrica.com/social-preview.png',
    url = 'https://learningafrica.com',
  } = props;
  return (
    <Helmet>
      {/* General */}
      <title>{title}</title>
      <meta
        name="description"
        content={
          props.description ||
          'The future of online education is here. Join us at Learning Africa to explore, learn, and grow.'
        }
      />
      <link rel="canonical" href="https://learningafrica.com" />

      {/* Open Graph (Facebook, LinkedIn, etc.) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Learning Africa" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@learningafrica" />
      <meta name="twitter:creator" content="@founder_handle" />
    </Helmet>
  );
}
