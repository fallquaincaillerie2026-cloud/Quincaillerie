import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() product: any | null = null; // si null => add mode
  @Output() saved = new EventEmitter<any>(); // émet la payload (le modèle)
  @Output() cancelled = new EventEmitter<void>();

  model = {
    name: '',
    description: '',
    price: null as number | null,
    image_url: ''
  };

  isEdit = false;

  ngOnInit() {
    this.applyInput();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']) {
      this.applyInput();
    }
  }

  private applyInput() {
    if (this.product) {
      this.isEdit = true;
      this.model = {
        name: this.product.name ?? '',
        description: this.product.description ?? '',
        price: this.product.price ?? null,
        image_url: this.product.image_url ?? ''
      };
    } else {
      this.isEdit = false;
      this.model = { name: '', description: '', price: null, image_url: '' };
    }
  }

  onSaveClick() {
    // validation simple
    if (!this.model.name || this.model.price === null || this.model.price === undefined) {
      alert('Le nom et le prix sont obligatoires');
      return;
    }
    // émet la payload au parent
    this.saved.emit({
      name: this.model.name,
      description: this.model.description,
      price: Number(this.model.price),
      image_url: this.model.image_url || ''
    });
  }

  onCancelClick() {
    this.cancelled.emit();
  }
}
