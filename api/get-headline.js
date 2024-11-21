import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);

    // Try to find the headline in <title> and <meta property="og:title">
    let headline = dom.window.document.querySelector('meta[property="og:title"]')?.content
                  || dom.window.document.querySelector('meta[name="og:title"]')?.content
                  || dom.window.document.title;

    // If there is no headline, return a default message
    if (!headline) {
      return res.status(404).json({ error: 'Headline not found' });
    }

    return res.status(200).json({ title: headline });

  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch URL' });
  }
}
