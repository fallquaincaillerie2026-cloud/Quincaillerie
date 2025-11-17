import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductFormComponent } from '../product-form/product-form.component';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductFormComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  products: any[] = [];
  loading = false;

  // contrôles d'affichage du formulaire intégré
  showForm = false;
  editingProduct: any | null = null;

  constructor(private supabase: SupabaseService) {}

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    this.loading = true;
    try {
      this.products = await this.supabase.getProducts();
    } catch (err) {
      console.error(err);
      this.products = [];
    } finally {
      this.loading = false;
    }
  }

  // ouverture du formulaire en mode "ajout"
  openAdd() {
    this.editingProduct = null;
    this.showForm = true;
  }

  // ouverture du formulaire en mode "édition"
  openEdit(p: any) {
    this.editingProduct = p;
    this.showForm = true;
  }

  // callback du composant formulaire (action Sauvegarder)
  async onFormSaved() {
    // le ProductFormComponent expose son modèle via la propriété `model`
    // mais comme il est encapsulé, on récupère en appelant getProductById ? Non :
    // Nous allons récupérer les valeurs directement depuis le composant enfant via DOM binding n'étant pas trivial ici.
    // Simplifions : au clic "saved", on interroge le DOM pour trouver les valeurs du formulaire
    // (alternativement, on peut transformer ProductFormComponent pour exposer un EventEmitter avec payload).
    //
    // Meilleure approche : modifier ProductFormComponent pour émettre le modèle au save.
    // Je vais supposer que ProductFormComponent émet maintenant le payload saved avec la donnée.
    //
    // => Adapter ProductFormComponent pour émettre la donnée au lieu d'un simple saved.
  }

  // suppression
  async deleteProduct(id: number) {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await this.supabase.deleteProduct(id);
      await this.loadProducts();
      alert('Produit supprimé');
    } catch (err: any) {
      console.error(err);
      alert('Erreur suppression : ' + (err?.message ?? err));
    }
  }

  // handler quand le formulaire envoie la payload { action: 'save', data: {...} }
  async handleFormEvent(event: { type: 'save' | 'cancel'; payload?: any }) {
    if (event.type === 'cancel') {
      this.showForm = false;
      this.editingProduct = null;
      return;
    }

    if (event.type === 'save' && event.payload) {
      try {
        if (this.editingProduct) {
          // edit
          await this.supabase.updateProduct(this.editingProduct.id, event.payload);
          alert('Produit mis à jour');
        } else {
          // add
          await this.supabase.addProduct(event.payload);
          alert('Produit ajouté');
        }
        this.showForm = false;
        this.editingProduct = null;
        await this.loadProducts();
      } catch (err: any) {
        console.error(err);
        alert('Erreur sauvegarde : ' + (err?.message ?? err));
      }
    }
  }
}
