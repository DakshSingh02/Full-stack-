export const platformLimits = {
  twitter: 280,
  facebook: 63206,
  linkedin: 3000,
  instagram: 2200,
};

export function validatePost(content, platform) {
  const limit = platformLimits[platform] || 280;

  if (!content.trim()) {
    return { isValid: false, error: "Post content cannot be empty." };
  }

  if (content.length > limit) {
    return {
      isValid: false,
      error: `Content exceeds ${platform.toUpperCase()} limit of ${limit} characters.`,
    };
  }

  return { isValid: true, error: null };
}