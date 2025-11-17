import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Retourne l'instance du client
  getClient(): SupabaseClient {
    return this.client;
  }

  // Récupère tous les produits
  async getProducts() {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase getProducts error', error);
      throw error;
    }
    return data || [];
  }

  // Récupère un produit par id
  async getProductById(id: number) {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase getProductById error', error);
      throw error;
    }
    return data;
  }

  // Ajoute un produit
  async addProduct(product: { name: string; description?: string; price: number; image_url?: string }) {
    const { data, error } = await this.client
      .from('products')
      .insert([product]);

    if (error) {
      console.error('Supabase addProduct error', error);
      throw error;
    }
    return data;
  }

  // Met à jour un produit
  async updateProduct(id: number, product: { name?: string; description?: string; price?: number; image_url?: string }) {
    const { data, error } = await this.client
      .from('products')
      .update(product)
      .eq('id', id);

    if (error) {
      console.error('Supabase updateProduct error', error);
      throw error;
    }
    return data;
  }

  // Supprime un produit
  async deleteProduct(id: number) {
    const { data, error } = await this.client
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase deleteProduct error', error);
      throw error;
    }
    return data;
  }
}
