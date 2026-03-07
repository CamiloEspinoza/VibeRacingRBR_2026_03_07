const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID!;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET!;

export function getLinkedInAuthUrl(state: string, redirectUri: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: redirectUri,
    state,
    scope: "openid profile email w_member_social r_liteprofile",
  });
  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

export async function exchangeLinkedInCode(
  code: string,
  redirectUri: string
): Promise<{ accessToken: string; expiresIn: number }> {
  const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`LinkedIn token exchange failed: ${error}`);
  }

  const data = await res.json();
  return { accessToken: data.access_token, expiresIn: data.expires_in };
}

export async function getLinkedInProfile(accessToken: string): Promise<{ id: string; name: string }> {
  const res = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error("Failed to fetch LinkedIn profile");

  const data = await res.json();
  return { id: data.sub, name: data.name };
}

export interface LinkedInPost {
  id: string;
  text: string;
  createdAt: number;
  author: string;
}

export async function getLinkedInPosts(
  accessToken: string,
  userId: string
): Promise<LinkedInPost[]> {
  const versionDate = "202602";
  const authorUrn = `urn:li:person:${userId}`;

  const res = await fetch(
    `https://api.linkedin.com/rest/posts?author=${encodeURIComponent(authorUrn)}&q=author&count=20&sortBy=LAST_MODIFIED`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": versionDate,
        "X-RestLi-Method": "FINDER",
      },
    }
  );

  if (!res.ok) {
    console.error("LinkedIn posts fetch failed:", await res.text());
    return [];
  }

  const data = await res.json();
  const elements = data.elements || [];

  return elements.map((post: Record<string, unknown>) => ({
    id: post.id as string,
    text: (post.commentary as string) || "",
    createdAt: post.createdAt as number,
    author: post.author as string,
  }));
}
