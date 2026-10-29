export function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret && secret !== 'change_me_in_production') return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set to a strong value in production');
  }
  return 'dev-secret';
}
