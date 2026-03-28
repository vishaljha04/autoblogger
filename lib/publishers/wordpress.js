export class WordPressPublisher {
  constructor({ apiUrl, username, appPassword }) {
    this.apiUrl = apiUrl;
    this.username = username;
    this.appPassword = appPassword;
  }

  async publish({ title, content, excerpt, slug, imageUrl, categories = [], tags = [] }) {
    const endpoint = `${this.apiUrl}/wp-json/wp/v2/posts`;

    const postData = {
      title,
      content,
      excerpt,
      slug,
      status: "publish",
      categories,
      tags,
    };

    if (imageUrl) {
      postData.featured_media = await this.uploadImage(imageUrl);
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${this.username}:${this.appPassword}`).toString("base64"),
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`WordPress publish failed: ${error}`);
    }

    const result = await response.json();
    return {
      externalId: String(result.id),
      externalUrl: result.link,
    };
  }

  async uploadImage(imageUrl) {
    try {
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();

      const uploadEndpoint = `${this.apiUrl}/wp-json/wp/v2/media`;
      const response = await fetch(uploadEndpoint, {
        method: "POST",
        headers: {
          "Content-Disposition": 'attachment; filename="blog-image.png"',
          "Content-Type": "image/png",
          Authorization: "Basic " + Buffer.from(`${this.username}:${this.appPassword}`).toString("base64"),
        },
        body: Buffer.from(imageBuffer),
      });

      if (!response.ok) return null;
      const media = await response.json();
      return media.id;
    } catch {
      return null;
    }
  }
}
