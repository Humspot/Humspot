export function generateUsername(separator = '', numDigits = 3, maxLength = 15) {
  const adjectives = ["swift", "brave", "charming", "clever", "gentle", "bold", "quirky"];
  const nouns = ["fox", "owl", "lion", "tiger", "wolf", "bear", "hawk"];

  // Select random adjective and noun
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  // Add random digits for uniqueness
  const randomDigits = Array.from({ length: numDigits }, () => Math.floor(Math.random() * 10)).join('');

  // Combine parts with the separator
  let username = `${randomAdjective}${separator}${randomNoun}${separator}${randomDigits}`;

  // Enforce maximum length if needed
  if (username.length > maxLength) {
    username = username.slice(0, maxLength);
  }

  return username;
}