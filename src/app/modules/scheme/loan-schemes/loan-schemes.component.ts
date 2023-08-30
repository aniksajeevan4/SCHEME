import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SchemeService } from '../services/scheme.service';
import { Router } from '@angular/router';
import { SchemeDetails } from 'src/app/core/models/scheme.model';
@Component({
  selector: 'app-loan-schemes',
  templateUrl: './loan-schemes.component.html',
  styleUrls: ['./loan-schemes.component.scss']
})
export class LoanSchemesComponent implements OnInit {
 // variables
 public ProductDetailsList: SchemeDetails[]
 public selectedProduct:any
 public productList:any=[]
 public schemes:any=[
  {schemeId:1,schemeName:'Mahila Loan'},
  {schemeId:2,schemeName:'Vehicle Loan'},
  {schemeId:3,schemeName:'Gold Loan'},
 ]

 private sub = new Subscription();

 constructor(private router:Router,private http:SchemeService) {}

 ngOnInit(): void {
   this.getProductDetailsList()
   this.getProductList()
 }

 private getProductDetailsList() {
  this.productList=[
    {productId:1,productCode:'productId 1'},
    {productId:2,productCode:'productId 2'},
    {productId:3,productCode:'productId 3'},
  ]

     this.ProductDetailsList = [
       {
         product: 123,
         schemeCode: 456,
         name: "Scheme 1",
         effectiveFrom: new Date("2023-05-18"),
       },
       {
         product: 789,
         schemeCode:12,
         name: "Scheme 2",
         effectiveFrom: new Date("2023-06-01"),
       },
     ]
 }

 private getProductList(){

 }

 newScheme(){
   this.router.navigate(['/scheme/schemeform'])
 }


 ngOnDestroy(): void {
   this.sub.unsubscribe();
 }


}
