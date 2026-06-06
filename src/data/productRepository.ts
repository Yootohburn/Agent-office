import type { Product } from './types'
import { dbGetAll, dbInsert, dbUpdate } from './localStorageDatabase'

const COL = 'products'

export const productRepository = {
  getAll(): Product[] {
    return dbGetAll<Product>(COL)
  },

  getById(id: string): Product | undefined {
    return dbGetAll<Product>(COL).find(p => p.product_id === id)
  },

  insert(product: Product): void {
    dbInsert(COL, product)
  },

  update(id: string, patch: Partial<Product>): void {
    dbUpdate<Product & Record<string, unknown>>(COL, 'product_id', id, patch)
  },
}
