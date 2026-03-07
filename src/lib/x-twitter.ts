import { TwitterApi } from "twitter-api-v2";

const X_CLIENT_ID = process.env.X_CLIENT_ID!;
const X_CLIENT_SECRET = process.env.X_CLIENT_SECRET!;

export function createXAuthClient() {
  return new TwitterApi({ clientId: X_CLIENT_ID, clientSecret: X_CLIENT_SECRET });
}

export function getXAuthUrl(
  client: TwitterApi,
  redirectUri: string,
  state: string
): { url: string; codeVerifier: string } {
  const { url, codeVerifier } = client.generateOAuth2AuthLink(redirectUri, {
    scope: ["tweet.read", "users.read", "offline.access"],
    state,
  });
  return { url, codeVerifier };
}

export async function exchangeXCode(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> {
  const client = createXAuthClient();
  const result = await client.loginWithOAuth2({
    code,
    codeVerifier,
    redirectUri,
  });

  return {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken || "",
    expiresIn: result.expiresIn,
  };
}

export interface XPost {
  id: string;
  text: string;
  createdAt: string;
  authorId: string;
}

export async function getXPosts(accessToken: string): Promise<XPost[]> {
  const client = new TwitterApi(accessToken);

  try {
    const me = await client.v2.me();
    const userId = me.data.id;

    const timeline = await client.v2.userTimeline(userId, {
      max_results: 20,
      "tweet.fields": ["created_at", "author_id", "text"],
      exclude: ["retweets", "replies"],
    });

    return (
      timeline.data.data?.map((tweet) => ({
        id: tweet.id,
        text: tweet.text,
        createdAt: tweet.created_at || "",
        authorId: tweet.author_id || userId,
      })) || []
    );
  } catch (error) {
    console.error("X posts fetch failed:", error);
    return [];
  }
}

export async function refreshXToken(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  const client = createXAuthClient();
  const result = await client.refreshOAuth2Token(refreshToken);

  return {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken || refreshToken,
    expiresIn: result.expiresIn,
  };
}
