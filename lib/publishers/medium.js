export class MediumPublisher {
  constructor({ accessToken }) {
    this.accessToken = accessToken;
    this.baseUrl = "https://api.medium.com/v1";
  }

  async getUserId() {
    const response = await fetch(`${this.baseUrl}/me`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });

    if (!response.ok) {
      throw new Error("Failed to get Medium user info");
    }

    const data = await response.json();
    return data.data.id;
  }

  async publish({ title, content, tags = [], canonicalUrl = null }) {
    const userId = await this.getUserId();
    const endpoint = `${this.baseUrl}/users/${userId}/posts`;

    const postData = {
      title,
      contentFormat: "markdown",
      content,
      tags: tags.slice(0, 5),
      publishStatus: "public",
    };

    if (canonicalUrl) {
      postData.canonicalUrl = canonicalUrl;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Medium publish failed: ${error}`);
    }

    const result = await response.json();
    return {
      externalId: result.data.id,
      externalUrl: result.data.url,
    };
  }
}
