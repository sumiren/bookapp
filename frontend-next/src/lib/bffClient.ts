export function bffUrl(path: string) {
  return process.env.NEXT_PUBLIC_BFF_DOMAIN_NAME_WITH_SCHEME + path
}
