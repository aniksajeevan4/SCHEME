import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product1',
  templateUrl: './product1.component.html',
  styleUrls: ['./product1.component.scss']
})
export class Product1Component implements OnInit {


  public securityList: any = [];
  public repaymentSequenceList: any = [];
  public paymentList: any = [];
  public rePaymentList: any = [];
  public statusList: any = [];


  constructor() {}

  ngOnInit(): void {
    this.getSecurityList();
    this.getRepaymentSequenceList();
    this.getPaymentListt();
    this.getRePaymentList();
    this.getStatusList();

  }

  //get Channel types for listing>>>>>>>>>>>>>>>>>>
  private getSecurityList() {
    this.securityList = [
      { id: 1, title: 'security 1' },
      { id: 2, title: 'security 2' },
    ];
  }

  private getRepaymentSequenceList() {
    this.repaymentSequenceList = [
      { id: 1, title: 'repaymentSequenceList 1' },
      { id: 2, title: 'repaymentSequenceList 2' },
    ];
    
  }

  private getPaymentListt() {
    this.paymentList = [
      { id: 1, title: 'paymentList 1' },
      { id: 2, title: 'paymentList 2' },
    ];
  }

  private getRePaymentList() {
    this.rePaymentList = [
      { id: 1, title: 'rePaymentList 1' },
      { id: 2, title: 'rePaymentList 2' },
    ];
  }

  private getStatusList() {
    this.statusList = [
      { id: 1, title: 'statusList 1' },
      { id: 2, title: 'statusList 2' },
    ];
  }
}
