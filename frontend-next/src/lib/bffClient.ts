export function bffUrl(path: string) {
  const config = useRuntimeConfig()
  return config.public.BFF_DOMAIN_NAME_WITH_SCHEME + path
}
