export interface OFFProduct {
  product_name: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
fiber_100g?: number;
'vitamin-a_100g'?: number;
'vitamin-c_100g'?: number;
calcium_100g?: number;
iron_100g?: number;

  };
  code: string;
  serving_size?: string;
}

export async function fetchProductByBarcode(barcode: string): Promise<OFFProduct | null> {
export async function fetchProductByBarcode(barcode: string): Promise<OFFProduct | null> {
  try {
    const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=product_name,nutrients,code,serving_size`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.product) return null;
    return data.product as OFFProduct;
  } catch {
    return null;
  }
}

}
