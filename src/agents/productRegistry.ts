// Product data model and mock data — Phase 1 mock only

export interface ProductScore {
  demo_score: number
  price_score: number
  commission_score: number
  impulse_score: number
  risk_score: number
  content_angle_score: number
  platform_fit_score: number
  final_score: number
}

export interface ProductRecord {
  id: string
  product_url: string
  marketplace: 'shopee' | 'lazada' | 'tiktok'
  shop_name: string
  title_th: string
  title_raw: string
  category: string
  subcategory: string
  price_now: number
  price_normal: number
  discount_pct: number
  rating: number
  review_count: number
  sold_count: number
  commission_rate: number
  est_commission_baht: number
  claim_risk: 'low' | 'medium' | 'high'
  return_risk: 'low' | 'medium' | 'high'
  suitability_score: number
  scores: ProductScore
}

export const APPROVED_CATEGORIES = [
  'จัดระเบียบบ้าน',
  'ของตกแต่งคอนโด',
  'ทำความสะอาด',
  'อุปกรณ์โต๊ะทำงาน',
  'อุปกรณ์ชาร์จ',
  'อุปกรณ์โทรศัพท์',
  'อุปกรณ์รถยนต์ราคาประหยัด',
] as const

export const AVOID_CATEGORIES = [
  'เครื่องใช้ไฟฟ้าขนาดใหญ่',
  'ไฟฟ้าและเครื่องมือช่าง',
  'อุปกรณ์ health/beauty ที่มี claim',
  'อิเล็กทรอนิกส์ราคาสูง > ฿5,000',
] as const

export const mockProducts: ProductRecord[] = [
  {
    id: 'prod-001',
    product_url: 'https://shopee.th/mock/storage-box-6in1',
    marketplace: 'shopee',
    shop_name: 'OrganizePlus Official',
    title_th: 'กล่องจัดระเบียบ 6-in-1 ชั้นวาง condo',
    title_raw: 'Storage Box Set 6-in-1 Organizer Shelf',
    category: 'จัดระเบียบบ้าน',
    subcategory: 'กล่องเก็บของ',
    price_now: 299,
    price_normal: 450,
    discount_pct: 33,
    rating: 4.8,
    review_count: 312,
    sold_count: 1840,
    commission_rate: 0.10,
    est_commission_baht: 840,
    claim_risk: 'low',
    return_risk: 'low',
    suitability_score: 88,
    scores: { demo_score: 9, price_score: 8, commission_score: 7, impulse_score: 8, risk_score: 2, content_angle_score: 9, platform_fit_score: 8, final_score: 84 },
  },
  {
    id: 'prod-002',
    product_url: 'https://lazada.co.th/mock/spin-mop',
    marketplace: 'lazada',
    shop_name: 'CleanHome Store',
    title_th: 'ไม้ถูพื้น Spin Mop พร้อมถัง 360°',
    title_raw: 'Spin Mop with Bucket 360 Rotation Self-Wring',
    category: 'ทำความสะอาด',
    subcategory: 'ไม้ถู',
    price_now: 590,
    price_normal: 890,
    discount_pct: 34,
    rating: 4.6,
    review_count: 187,
    sold_count: 920,
    commission_rate: 0.10,
    est_commission_baht: 570,
    claim_risk: 'low',
    return_risk: 'low',
    suitability_score: 74,
    scores: { demo_score: 8, price_score: 7, commission_score: 6, impulse_score: 6, risk_score: 2, content_angle_score: 8, platform_fit_score: 7, final_score: 74 },
  },
  {
    id: 'prod-003',
    product_url: 'https://tiktokshop.com/mock/charger-3in1',
    marketplace: 'tiktok',
    shop_name: 'TechGadget TH',
    title_th: 'ที่ชาร์จ 3-in-1 MagSafe-style แท่นชาร์จไร้สาย',
    title_raw: '3-in-1 Wireless Charging Station MagSafe Compatible',
    category: 'อุปกรณ์อิเล็กทรอนิกส์',
    subcategory: 'อุปกรณ์ชาร์จ',
    price_now: 390,
    price_normal: 590,
    discount_pct: 34,
    rating: 4.7,
    review_count: 524,
    sold_count: 3210,
    commission_rate: 0.10,
    est_commission_baht: 1220,
    claim_risk: 'medium',
    return_risk: 'low',
    suitability_score: 91,
    scores: { demo_score: 9, price_score: 8, commission_score: 9, impulse_score: 9, risk_score: 4, content_angle_score: 9, platform_fit_score: 9, final_score: 91 },
  },
  {
    id: 'prod-004',
    product_url: 'https://shopee.th/mock/mousepad-rgb-xxl',
    marketplace: 'shopee',
    shop_name: 'DeskSetup Store',
    title_th: 'แผ่นรองเมาส์ RGB XXL 80×30 cm',
    title_raw: 'RGB Gaming Mouse Pad XXL Extended 800x300mm',
    category: 'อุปกรณ์คอมพิวเตอร์',
    subcategory: 'แผ่นรองเมาส์',
    price_now: 189,
    price_normal: 320,
    discount_pct: 41,
    rating: 4.5,
    review_count: 203,
    sold_count: 1150,
    commission_rate: 0.10,
    est_commission_baht: 630,
    claim_risk: 'low',
    return_risk: 'low',
    suitability_score: 79,
    scores: { demo_score: 7, price_score: 9, commission_score: 6, impulse_score: 8, risk_score: 2, content_angle_score: 7, platform_fit_score: 8, final_score: 79 },
  },
]
