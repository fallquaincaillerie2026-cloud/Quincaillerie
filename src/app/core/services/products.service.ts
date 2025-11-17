import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private table = 'products';

  constructor(private supabase: SupabaseService) {}

  // Récupérer tous les produits
  async getAllProducts() {
    const client = this.supabase.getClient();
    return await client.from(this.table).select('*').order('id', { ascending: true });
  }

  // Ajouter un produit
  async addProduct(product: any) {
    const client = this.supabase.getClient();
    return await client.from(this.table).insert([product]);
  }

  // Modifier un produit
  async updateProduct(id: number, product: any) {
    const client = this.supabase.getClient();
    return await client.from(this.table).update(product).eq('id', id);
  }

  // Supprimer un produit
  async deleteProduct(id: number) {
    const client = this.supabase.getClient();
    return await client.from(this.table).delete().eq('id', id);
  }
}
