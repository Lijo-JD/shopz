import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getProductData() {
    return this.http.get('http://localhost:3000/products')
  }

  addProduct(product: Product) {
    return this.http.post('http://localhost:3000/add', product)
  }

  editProduct(product: Product) {
    return this.http.put('http://localhost:3000/edit', product)
  }

  deleteProduct(product: Product) {
    let url = 'http://localhost:3000/delete/' + product._id
    return this.http.delete(url)
  }
}
