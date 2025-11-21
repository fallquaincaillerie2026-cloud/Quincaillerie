import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {

  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // 🔥 Getter sécurisé
  getClient() {
    return this.client;
  }

  // ==========================================================
  // 1️⃣ GET PRODUCTS
  // ==========================================================
  async getProducts() {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) console.error(error.message);
    return data;
  }

  // ==========================================================
  // 2️⃣ GET ONE PRODUCT
  // ==========================================================
  async getProduct(id: number) {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) console.error(error.message);
    return data;
  }

  // ==========================================================
  // 3️⃣ ADD PRODUCT
  // ==========================================================
  async addProduct(product: any) {
    const { error } = await this.client
      .from('products')
      .insert(product);

    if (error) console.error(error.message);
  }

  // ==========================================================
  // 4️⃣ UPDATE PRODUCT
  // ==========================================================
  async updateProduct(id: number, product: any) {
    const { error } = await this.client
      .from('products')
      .update(product)
      .eq('id', id);

    if (error) console.error(error.message);
  }

  // ==========================================================
  // 5️⃣ DELETE PRODUCT
  // ==========================================================
  async deleteProduct(id: number) {
    const { error } = await this.client
      .from('products')
      .delete()
      .eq('id', id);

    if (error) console.error(error.message);
  }

  // ==========================================================
  // 6️⃣ UPLOAD IMAGE (corrigé + typé)
  // ==========================================================
  async uploadImage(file: File): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;

    // 1. UPLOAD
    const { data: uploadData, error: uploadError } = await this.client.storage
      .from('products')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Erreur upload :', uploadError.message);
      return '';
    }

    // 2. GET PUBLIC URL
    const { data: urlData } = this.client.storage
      .from('products')
      .getPublicUrl(uploadData.path);

    return urlData?.publicUrl || '';
  }
}
