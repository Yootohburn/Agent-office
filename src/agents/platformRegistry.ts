export type PlatformId = 'shopee' | 'lazada' | 'tiktok' | 'shared'

export interface Platform {
  id: PlatformId
  label: string
  color: string
  description: string
  affiliateProgram: string
  mockCommissionRange: string
  apiStatus: 'not_connected'
}

export const platforms: Platform[] = [
  {
    id: 'shopee',
    label: 'Shopee',
    color: '#ff5722',
    description: 'Shopee Affiliate Program — Southeast Asia e-commerce',
    affiliateProgram: 'Shopee Affiliate',
    mockCommissionRange: '3–10%',
    apiStatus: 'not_connected',
  },
  {
    id: 'lazada',
    label: 'Lazada',
    color: '#2979ff',
    description: 'Lazada Affiliate Program — Southeast Asia e-commerce',
    affiliateProgram: 'Lazada Affiliate',
    mockCommissionRange: '4–12%',
    apiStatus: 'not_connected',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    color: '#00e5ff',
    description: 'TikTok Shop Affiliate — short-form video commerce',
    affiliateProgram: 'TikTok Shop Affiliate',
    mockCommissionRange: '5–20%',
    apiStatus: 'not_connected',
  },
  {
    id: 'shared',
    label: 'Shared',
    color: '#00ff9f',
    description: 'Agents that work across all platforms',
    affiliateProgram: 'All Platforms',
    mockCommissionRange: 'N/A',
    apiStatus: 'not_connected',
  },
]

export function getPlatformById(id: PlatformId): Platform | undefined {
  return platforms.find(p => p.id === id)
}
