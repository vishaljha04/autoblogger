import crypto from "crypto";

export class TwitterPublisher {
  constructor({ apiKey, apiSecret, accessToken, accessTokenSecret }) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.accessToken = accessToken;
    this.accessTokenSecret = accessTokenSecret;
    this.baseUrl = "https://api.twitter.com/2";
  }

  generateOAuthHeader(method, url) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomBytes(16).toString("hex");

    const params = {
      oauth_consumer_key: this.apiKey,
      oauth_nonce: nonce,
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: timestamp,
      oauth_token: this.accessToken,
      oauth_version: "1.0",
    };

    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join("&");

    const baseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
    const signingKey = `${encodeURIComponent(this.apiSecret)}&${encodeURIComponent(this.accessTokenSecret)}`;
    const signature = crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");

    params.oauth_signature = signature;

    return (
      "OAuth " +
      Object.keys(params)
        .sort()
        .map((key) => `${encodeURIComponent(key)}="${encodeURIComponent(params[key])}"`)
        .join(", ")
    );
  }

  async publish({ title, content, excerpt, externalUrl = null }) {
    const tweetText = this.formatTweet(title, excerpt, externalUrl);
    const url = `${this.baseUrl}/tweets`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.generateOAuthHeader("POST", url),
      },
      body: JSON.stringify({ text: tweetText }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Twitter publish failed: ${error}`);
    }

    const result = await response.json();
    return {
      externalId: result.data.id,
      externalUrl: `https://twitter.com/i/web/status/${result.data.id}`,
    };
  }

  formatTweet(title, excerpt, url) {
    const maxLength = 280;
    const urlLength = url ? 24 : 0;
    const available = maxLength - urlLength - 2;

    let text = title;
    if (text.length < available && excerpt) {
      const remaining = available - text.length - 3;
      if (remaining > 20) {
        text += " - " + excerpt.substring(0, remaining);
      }
    }

    if (text.length > available) {
      text = text.substring(0, available - 3) + "...";
    }

    return url ? `${text}\n\n${url}` : text;
  }
}
