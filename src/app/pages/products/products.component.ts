import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {

  products: any[] = [];
  loading = true;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    try {
      this.products = await this.supabase.getProducts();
    } catch (err) {
      console.error('Erreur lors du chargement des produits', err);
    }
    this.loading = false;
  }
}
