import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription, fromEventPattern, Observable } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { Store, select } from '@ngrx/store';
import * as fromProduct from '../state/products.reducer';
import * as productActions from '../state/products.actions';
import { dispatch } from 'rxjs/internal/observable/range';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';
  

  displayCode: boolean;

  products: Product[];

  // Used to highlight the selected product in the list
  selectedProduct: Product | null;
  componentActive: boolean = true;
  products$: Observable<Product[]>;
  errorMessage$: Observable<string>;
  // sub: Subscription;
 
  constructor( private store:Store<fromProduct.State>,private productService: ProductService) { }

  ngOnInit(): void {
   /*  this.sub = this.productService.selectedProductChanges$.subscribe(
      selectedProduct => this.selectedProduct = selectedProduct
    ); */
  this.store.pipe(select(fromProduct.getCurrentProduct)).subscribe(
      currentProduct => this.selectedProduct = currentProduct
    );

    /* this.productService.getProducts().subscribe(
      (products: Product[]) => this.products = products,
      (err: any) => this.errorMessage = err.error
    ); */
    this.store.dispatch( new productActions.Load());
    this.products$ = this.store.pipe(select(fromProduct.getProducts));
    /* this.store.pipe(select(fromProduct.getProducts)).subscribe(
      (products:Product[] )=> this.products = products 
    ); */

      this.store.pipe(select(fromProduct.getShowProductCode)).subscribe(
        // showProductCode => this.displayCode =showProductCode
         showProductCode => this.displayCode = showProductCode
    );

     this.errorMessage$ =    this.store.pipe(select(fromProduct.getError))  
  }

  

  ngOnDestroy(): void {
    // this.sub.unsubscribe();
    this.componentActive = false;
  }

  checkChanged(value: boolean): void {
    // this.displayCode = value;
    this.store.dispatch( new productActions.ToggleProductCode(value));
  }

  newProduct(): void {
    // this.productService.changeSelectedProduct(this.productService.newProduct());
    this.store.dispatch( new productActions.InitializeCurrentProduct());
  }

  productSelected(product: Product): void {
    // this.productService.changeSelectedProduct(product);
    this.store.dispatch(new productActions.SetCurrentProduct(product)); 
  }

}
