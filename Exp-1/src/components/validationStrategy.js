// Platform-specific character limits
const platformLimits = {
  twitter: 280,
  linkedin: 3000,
  instagram: 2200,
};

// Validate post content according to selected platforms
const validatePost = (content, platforms) => {
  const errors = {};

  platforms.forEach((platform) => {
    const limit = platformLimits[platform];

    if (content.length > limit) {
      errors[platform] = `Content exceeds ${limit} characters.`;
    }
  });

  return errors;
};

export { platformLimits, validatePost };

