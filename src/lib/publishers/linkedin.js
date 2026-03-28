export class LinkedInPublisher {
  constructor({ accessToken }) {
    this.accessToken = accessToken;
    this.baseUrl = "https://api.linkedin.com/v2";
  }

  async getProfileUrn() {
    const response = await fetch(`${this.baseUrl}/me`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });

    if (!response.ok) {
      throw new Error("Failed to get LinkedIn profile");
    }

    const data = await response.json();
    return `urn:li:person:${data.id}`;
  }

  async publish({ title, content, excerpt, externalUrl = null }) {
    const authorUrn = await this.getProfileUrn();

    const shareText = `${title}\n\n${excerpt || content.substring(0, 250)}`;

    const postData = {
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: shareText },
          shareMediaCategory: externalUrl ? "ARTICLE" : "NONE",
          ...(externalUrl && {
            media: [
              {
                status: "READY",
                originalUrl: externalUrl,
                title: { text: title },
                description: { text: excerpt || "" },
              },
            ],
          }),
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    const response = await fetch(`${this.baseUrl}/ugcPosts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`LinkedIn publish failed: ${error}`);
    }

    const result = await response.json();
    return {
      externalId: result.id,
      externalUrl: `https://www.linkedin.com/feed/update/${result.id}`,
    };
  }
}
