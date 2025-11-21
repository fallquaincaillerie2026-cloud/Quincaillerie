import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [NgFor, NgIf],
})
export class AdminComponent implements OnInit {

  products: any[] = [];

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.products = (await this.supabase.getProducts()) ?? [];
  }

  goToAdd() {
    this.router.navigate(['/admin/add']);
  }

  editProduct(id: number) {
    this.router.navigate(['/admin/edit', id]);
  }

  async deleteProduct(id: number) {
    if (confirm('Supprimer ce produit ?')) {
      await this.supabase.deleteProduct(id);
      this.products = (await this.supabase.getProducts()) ?? [];
    }
  }
}
