export function tokenize(text) {
  // Keep ASCII identifiers intact and split other letters and numbers character by character.
  return text.match(/[A-Za-z0-9_]+|[\p{L}\p{N}]/gu) ?? []
}
