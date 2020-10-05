import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { Product } from '../product';
import { User } from '../user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  constructor(private router: Router, private data: DataService, private auth: AuthService) {}

  ngOnInit(): void {
    this.getData()
    this.getUser()
    this.getUsers()
  }

  product = new Product()
  products: Product[]
  user: string
  users: User[]

  addItem = new FormGroup({
    item_name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    item_price: new FormControl('', Validators.required),
  });

  onLogout() {
    localStorage.removeItem('jwt');
    this.router.navigate(['']);
  }

  onAddItem() {
    if (this.product._id) {
      this.data.editProduct(this.product).subscribe((prod) => {
        this.addItem.reset()
        this.getData()
      })
    } else {
      this.product.item_name = this.addItem.value.item_name;
      this.product.item_price = this.addItem.value.item_price;
      this.data.addProduct(this.product).subscribe((prod) => {
        this.addItem.reset()
        this.getData();
      });
    }
  }

  getData() {
    this.data.getProductData().subscribe((data: Product[]) => {
      this.products = data;
    });
  }

  onEdit(product: Product) {
    this.product = product;
  }

  onDelete(product: Product) {
    this.data.deleteProduct(product).subscribe((data) => {
      this.getData()
    })
  }

  getUser() {
    let data = localStorage.getItem('jwt')
    let jwtData = data.split('.')[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);
    this.user = decodedJwtData.email
  }

  getUsers() {
    this.auth.getUsers().subscribe((data: User[]) => {
      this.users = data
    })
  }

  onDeleteUser(user: User) {
    this.auth.deleteUser(user).subscribe((data) => {
      this.getUsers()
    })
  }
}
