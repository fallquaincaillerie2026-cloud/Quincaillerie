import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  popularProducts: any[] = []; // 🔥 obligatoire

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    //this.popularProducts = await this.supabase.getProducts();
  }
}
