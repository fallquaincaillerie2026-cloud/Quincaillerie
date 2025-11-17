import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SupabaseService } from './core/services/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , RouterLink],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  status = 'En cours...';

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.from('products').select('*');
    this.status = error ? 'Erreur de connexion ❌' : 'Connexion réussie ✅';
  }

  async addDummyProduct() {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.from('products').insert([
      {
        name: 'Marteau de test',
        description: 'Outil de test ajouté depuis Angular',
        price: 9.99,
        image_url: '',
      },
    ]);

    if (error) alert('Erreur : ' + error.message);
    else alert('Produit ajouté avec succès 🎉');
  }
}
