import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { Product } from '../product';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private router: Router, private data: DataService) { }

  ngOnInit(): void {
    this.getData()
    this.getUser()
  }

  products: Product[]
  cart = []
  user: string

  onLogout() {
    localStorage.removeItem('jwt')
    this.router.navigate([''])
  }

  getData() {
    this.data.getProductData().subscribe((data: Product[]) => {
      this.products = data
    })
  }

  onCart(product: Product) {
    this.cart.push(product)
  }

  getUser() {
    let data = localStorage.getItem('jwt')
    let jwtData = data.split('.')[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);
    this.user = decodedJwtData.email
  }
}
