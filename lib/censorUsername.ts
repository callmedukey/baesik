function censorUsername(username: string) {
  const length = username.length;
  const halfLength = Math.ceil(length / 2); // Calculate half the length, rounded up
  const visiblePart = username.slice(0, halfLength); // Get the first half of the username
  const censoredPart = "*".repeat(length - halfLength); // Generate a string of asterisks for the second half
  return visiblePart + censoredPart; // Combine the visible and censored parts
}

export default censorUsername;
