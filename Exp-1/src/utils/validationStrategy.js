const platformLimits = {
  twitter: 280,
  linkedin: 3000,
  instagram: 2200,
};

const validatePost = (content, platforms) => {
  const errors = {};

  platforms.forEach((platform) => {
    const limit = platformLimits[platform];

    if (content.length > limit) {
      errors[platform] =
        `Content exceeds ${limit} characters.`;
    }
  });

  return errors;
};

export { platformLimits, validatePost };
