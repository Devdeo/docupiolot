import { MetadataRoute } from 'next';
 
// IMPORTANT: You should replace this with your actual domain
const URL = 'https://docupilot.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${URL}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
