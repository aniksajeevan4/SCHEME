import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonService } from 'src/app/core/env/common-services/common.service';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { TransactionData } from 'src/app/core/models/schemeform.model';
import { glInItState } from 'src/app/core/store/Auth/auth.action';
import { AppState } from 'src/app/core/store/app.state';
import { saveSchemeFormData } from 'src/app/core/store/schemeFormStore/schemeform.action';
import { getSchemeFormOnSaveData } from 'src/app/core/store/schemeFormStore/schemeform.selectors';
// import { transactionData } from 'src/app/core/store/schemeFormStore/schemeform.selectors';

@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.scss'],
})
export class ProductMasterComponent implements OnInit {
  //variables

  public loadComponent1: boolean = true;
  public loadComponent2: boolean = false;
  public productsList: any = [];
  public selectedProduct: number = 0;
  public transactionData: any
  constructor(private env: EnvFunction, private commonService: CommonService, private appStore: Store<AppState>) { }

  ngOnInit(): void {
  }


   updateEditableStatus(formId: number, id: number) {
    const schemeFormView = [
      { id: 1, formName: 'Scheme Info', jsonName: 'schemeInfo', completed: false, editable: false, editMode: true, isOpen: false },
        { id: 2, formName: 'Scheme General Info', jsonName: 'generalInfo', completed: false, editable: false, editMode: false, isOpen: false },
        { id: 3, formName: 'Scheme Applicable To', jsonName: 'schemeApplicableTo', completed: false, editable: false, editMode: false, isOpen: false },
        { id: 4, formName: 'Scheme Interest Configuration', jsonName: 'schemeInterestConfiguration', completed: false, editable: false, editMode: false, isOpen: false },
        { id: 5, formName: 'Interest View', jsonName: 'schemeInterestDefinition', completed: false, editable: false, editMode: false, isOpen: false },
        { id: 6, formName: 'Scheme Charges', jsonName: 'schemeCharges', completed: false, editable: false, editMode: false, isOpen: false },
        { id: 7, formName: 'Additional details',jsonName: 'additionalDetails' , completed: false, editable: false, editMode: false, isOpen: false },
]
    ;
  
    return schemeFormView.map(form => {
      if (form.id === formId) {
        return form; // Return the matched object as it is
      }
      return { ...form, editable: false }; // Create a new object with editable set to true for all other objects
    });
  }
  

  //get Channel types for listing>>>>>>>>>>>>>>>>>>
  private getproductsList() {
    this.productsList = [
      { id: 1, title: 'product 1' },
      { id: 2, title: 'product 2' },
    ];
  }
}
