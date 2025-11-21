import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-product-form',
  standalone: true,
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  imports: [ReactiveFormsModule ,CommonModule],
})
export class ProductFormComponent implements OnInit {

  productForm!: FormGroup;
  isEdit = false;
  productId: any;

  // 📌 Pour gérer l'image
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supabase: SupabaseService
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: ['', Validators.required],
      image_url: [''], // 🔥 important
    });

    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      this.isEdit = true;
      this.loadProduct();
    }
  }

  // 🔥 Charger un produit existant
  async loadProduct() {
    const data = await this.supabase.getProduct(this.productId);

    if (data) {
      this.productForm.patchValue(data);
      this.previewUrl = data.image_url; // preview depuis la DB
    }
  }

  // =====================================================
  // 🔥 GESTION DU FICHIER
  // =====================================================
  onFileChange(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    this.selectedFile = file;

    // Preview immédiate
    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result);
    reader.readAsDataURL(file);
  }

  // =====================================================
  // 🔥 SUBMIT : ADD OU EDIT
  // =====================================================
  async onSubmit() {
    if (this.productForm.invalid) return;

    let imageUrl = this.productForm.value.image_url;

    // ⬆⬆⬆ Si une nouvelle image a été choisie, on l'upload
    if (this.selectedFile) {
      imageUrl = await this.supabase.uploadImage(this.selectedFile);
    }

    const finalProduct = {
      ...this.productForm.value,
      image_url: imageUrl,
    };

    if (this.isEdit) {
      await this.supabase.updateProduct(this.productId, finalProduct);
    } else {
      await this.supabase.addProduct(finalProduct);
    }

    this.router.navigate(['/admin']);
  }
}
