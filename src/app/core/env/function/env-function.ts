import { AbstractControl, FormGroup } from "@angular/forms";
import { Store } from "@ngrx/store";
import { AppState } from "../../store/app.state";
import { fetchSchemeFormViewState, getSchemeFormOnSaveData } from "../../store/schemeFormStore/schemeform.selectors";
import { SchemeFormService } from "src/app/modules/scheme-forms/services/scheme-form.service";
import { SchemeFormViewState, SchemeSaveDetails } from "../../models/schemeform.model";
import { disableOtherForms, enableAllEditSchemeFormViewState, saveSchemeFormData, switchSchemeFormIsOpenAndEditModeStatus, switchToNextSchemeForm, updateSchemeFormSchemeName, updateSchemeFormsEditMode, updateSchemeFormsisTranMode, updateSchemeId, updateTranNumber, updateTransactionDetails } from "../../store/schemeFormStore/schemeform.action";
import { Injectable } from "@angular/core";
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "../common-services/common.service";
import { DatePipe } from "@angular/common";
import { CacheService } from "../../cache/cacheService/cache.service";
import { CacheKey } from "../../cache/cacheKey/cache-key";
import { HttpParams } from "@angular/common/http";
import html2pdf from 'html2pdf.js';

@Injectable()
export class EnvFunction {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appStore: Store<AppState>,
    private schemeFormService: SchemeFormService,
    private commonService: CommonService,
    // private datePipe: DatePipe,
    private cacheService: CacheService
  ) { }
  // constructor(private swal:){}
  public getFormError(form: FormGroup|AbstractControl, controlName: string): string {
    if (form.get(controlName)?.hasError('required')) return 'Field required.';
    else if (form.get(controlName)?.hasError('min')) return 'Minimum numbers required.';
    else if (form.get(controlName)?.hasError('max')) return 'Maximum numbers exceeds.';
    else if (form.get(controlName)?.hasError('minlength')) return 'Minimum characters required.';
    else if (form.get(controlName)?.hasError('maxlength')) return 'Maximum characters exceeds.';
    else if (form.get(controlName)?.hasError('alreadyexist')) return 'Already exist.';
    else if (form.get(controlName)?.hasError('repeatfound')) return 'Repeating of data found.';
    else if (form.get(controlName)?.hasError('pattern')) return 'Invalid format';
    else if (form.get(controlName)?.hasError('FromToDate')) return 'Minimum date required';
    else if (form.get(controlName)?.hasError('minmax')) return 'Min should be less than or equal to Max';
    else if (form.get(controlName)?.hasError('invalidId')) return 'Invalid id';
    else if (form.get(controlName)?.hasError('IdNotFound')) return 'Id not found';
    else if (form.get(controlName)?.hasError('invalidFile')) return 'Invalid file';
    else if (form.get(controlName)?.hasError('fileUploadFail')) return 'File upload failed';
    else if (form.get(controlName)?.hasError('invalidOTP')) return 'Invalid OTP';
    else if (form.get(controlName)?.hasError('invalidIFSC')) return 'Invalid IFSC';
    else if (form.get(controlName)?.hasError('checking')) return 'checking...';
    else if (form.get(controlName)?.hasError('maxDate')) return 'Maximun date exceeds';
    else if (form.get(controlName)?.hasError('minDate')) return 'Minimum date required';
    else if (form.get(controlName)?.hasError('middleNumValidation')) return 'Value should be between Min charge and Max charge';
    else if (form.get(controlName)?.hasError('middleNumValidationInterest')) return 'Interest Rate should be between Min Interest and Max Interest';
    else if (form.get(controlName)?.hasError('middleNumValidationCharge')) return 'Definite Charge should be between Min Charge and Max Charge';
    else if (form.get(controlName)?.hasError('middleNumValidation')) return 'Value must between Min and Max charge';
    else if (form.get(controlName)?.invalid) return 'Invalid data.';
    return '';
  }

  public removeError(form:any, controlName: string, errorName: string) {
    const control = form.get(controlName);
    const errors = control?.errors;

    if (errors && errors[errorName]) {
      delete errors[errorName];
      control.setErrors(Object.keys(errors).length ? errors : null);
    }
  }

  public showResponseErrorMessage(message: string) {
    console.log(message);
  }

  public saveSchemeFormTempdata(formId: number = 1, formData: any) {

    let schemeFormState: any;
    this.appStore.select(getSchemeFormOnSaveData).subscribe(
      (data) => { schemeFormState = data; }
    );
    let schemeCode: string = '';
    const formJsonName: string = this.getSchemeFormJsonName(formId);
    const strigifiedJson: string = formData;
    const isNewScheme: boolean = schemeFormState.schemeDetails ? false : true;
    let schemeJsonData: any;
    if (isNewScheme) {
      schemeCode = formData.schemeCode;
        schemeJsonData = {
          schemeId: 0,
          fetchedSchemeId: schemeFormState.fetchedSchemeId,
          schemeInfo: strigifiedJson,
          generalInfo:null,
          schemeApplicableTo: null,
          schemeInterestConfiguration: null,
          schemeInterestDefinition: null,
          schemeCharges: null,
          additionalDetails: null,
        
      }
    }
    else {
      schemeJsonData = JSON.parse(schemeFormState.schemeDetails);
      if (formId == 1) schemeJsonData.schemeInfo = strigifiedJson;
      else if (formId == 2) schemeJsonData.generalInfo = strigifiedJson;
      else if (formId == 3) schemeJsonData.schemeApplicableTo = strigifiedJson;
      else if (formId == 4) schemeJsonData.schemeInterestConfiguration = strigifiedJson;
      else if (formId == 5) schemeJsonData.schemeInterestDefinition = strigifiedJson;
      else if (formId == 6) schemeJsonData.schemeCharges = strigifiedJson;
      else if (formId == 7) schemeJsonData.additionalDetails = strigifiedJson;

      schemeCode = schemeJsonData.schemeInfo.schemeCode;
    }

    try {
      this.schemeFormService.saveSchemeData(schemeCode, formJsonName, schemeJsonData, isNewScheme).subscribe(
        async (data: any) => {
          if (data.statusCode == 200) {
            schemeJsonData.schemeId = data.result;
            this.appStore.dispatch(updateSchemeFormSchemeName({ schemeCode: schemeCode }))
            this.appStore.dispatch(saveSchemeFormData({ schemejson: JSON.stringify(schemeJsonData) }));
            this.showSwalToast1('Saved Successfuly','', 'success',1500).then((swalResult: any) => {
              if (swalResult) {
                this.appStore.dispatch(switchToNextSchemeForm({ formId: formId }));
              }
            })

            if (formId ==7) {
              // this.router.navigate(['/'], { relativeTo: this.route });
              this.showSwalToast1('Saved Successfuly','', 'success',1500)            };
          } else this.showResponseErrorMessage('Something went wrong while Saving scheme form')
        },
        (error) => { this.showResponseErrorMessage('Something went wrong while Saving scheme form') }
      );
    }
    catch (error) {
      this.showResponseErrorMessage('Something went wrong while Saving scheme form')
    }
  }

  public saveSchemeFormLiveData(formId: number = 1, formData: any) {
    let schemeFormState: any;
    this.appStore.select(getSchemeFormOnSaveData).subscribe(
      (data) => { schemeFormState = data; }
    );
    const schemeCode: string = schemeFormState.schemeCode;
    const formJsonName: string = this.getSchemeFormJsonName(formId);
    const strigifiedJson: string = JSON.stringify(formData);
    let schemeJsonData: any;
    schemeJsonData = JSON.parse(schemeFormState.schemeDetails);
    schemeJsonData[formJsonName] = formData;
    // this.appStore.dispatch(enableOtherForms({ formId: formId }))
    this.appStore.dispatch(updateSchemeFormSchemeName({ schemeCode: schemeCode }))
    this.appStore.dispatch(saveSchemeFormData({ schemejson: JSON.stringify(schemeJsonData) }));
    this.appStore.dispatch(switchSchemeFormIsOpenAndEditModeStatus({ formId: formId, status: false }));
    this.appStore.dispatch(switchToNextSchemeForm({ formId: formId }))
  }
  public generateTran(userId: any, branchId: number, featureId: number, Amount: number, Method: string, incAuthcount: number, loanCount: number, body: any) {
    return this.commonService.generateTran(userId, branchId, featureId, Amount, Method, incAuthcount, loanCount, body);
  }

  public generateTran1(swalTitle:string, editedDetailsCacheKey: string, tranDetailsCacheKey: string, userId: any, branchId: number, featureId: number, Amount: number, Method: string, incAuthcount: number, loanCount: number) {
    this.cacheService.set(CacheKey.tranIsDisabled, false, 0)

    if (this.cacheService.has(editedDetailsCacheKey) && this.cacheService.has(tranDetailsCacheKey)) {
      const editedJsonData = this.cacheService.get(editedDetailsCacheKey)
      const tranJsonData = this.cacheService.get(tranDetailsCacheKey)
      let params = new HttpParams();
      params = params.set('editedData', JSON.stringify(editedJsonData));
      params = params.set('updatedData', JSON.stringify(tranJsonData));
      this.commonService.generateTran(userId, branchId, featureId, Amount, Method, incAuthcount, loanCount, params).subscribe(
        (data: any) => {
          if (data.statusCode == 200) {
            this.cacheService.set(CacheKey.tranIsDisabled, true, 0);
            this.cacheService.set(CacheKey.tranGenerated, true, 0);
            this.showSwalAlert( swalTitle,  data.result + ' sent for verification successfully','success').then(() => {
              // Call your function here
              // console.log(jsonData, 'data.schemeDetails.schemeTempId');
              // this.DeletePending(jsonData.schemeId)
            });
          } else {
            // Failure
            this.cacheService.set(CacheKey.tranIsDisabled, true, 0);
            this.showSwalAlert('', 'Something went wrong !!', 'error');
          }
        },
        (error: any) => {
          // Error
          this.cacheService.set(CacheKey.tranIsDisabled, true, 0);
          this.showSwalAlert('', 'Something went wrong !!', 'error');
        }
      )
    }
    else {
    this.cacheService.set(CacheKey.tranIsDisabled, true, 0)
      this.showSwalAlert('', 'Please fill all the details !!', 'warning');
    }
  }

  //send back for review
  public sendBackReview(tranNum: number, userId: any, branchId: number, featureId: number, Reason: string, amount: number, loanCount: number, incAuthcount: number, body: any) {
    return this.commonService.sendBackReview(tranNum, userId, branchId, featureId, Reason, amount, loanCount, incAuthcount, body)
  }

  public sendBackReview1(tranNum: number, mainData:any, updatedData:any, userId: any, branchId: number, featureId: number, Reason: string, amount: number, loanCount: number, incAuthcount: number): Promise<any> {
    let params = new HttpParams();
    params = params.set('updatedData', updatedData);
    return new Promise<any>((resolve, reject) => {
      this.commonService.sendBackReview(tranNum, userId, branchId, featureId, Reason, amount, loanCount, incAuthcount, params).subscribe((res: any) => {
        if (res.statusCode == 200) {
          resolve(res.result);
        } else {
          resolve(null);
        }
      },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  public getTransactionData(tranNum: number, branchId: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.commonService.getTransactionData(tranNum, branchId).subscribe((res: any) => {
        if (res.statusCode == 200) {
          resolve(res.result);
          this.appStore.dispatch(updateSchemeId({ schemeId: JSON.parse(res.result[0].updatedData).schemeId }));
          this.appStore.dispatch(updateSchemeFormsisTranMode({ status: true }));
          this.appStore.dispatch(updateSchemeFormsEditMode({ status: true }));
          this.appStore.dispatch(saveSchemeFormData({ schemejson: res.result[0].updatedData }));
          this.appStore.dispatch(updateTranNumber({ tranNum: res.result[0].tranNumber }));
          this.appStore.dispatch(enableAllEditSchemeFormViewState());
        } else {
          resolve(null);
        }
      },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  public getTransactionData1(tranNum: number, branchId: any) {
    return new Promise<any>((resolve, reject) => {
      this.commonService.getTransactionData(tranNum, branchId).subscribe((res: any) => {
        if (res.statusCode == 200) {
          resolve(res.result);
          // this.appStore.dispatch(updateSchemeFormSchemeName({schemeName:schemeName}))

          this.appStore.dispatch(updateSchemeId({ schemeId: JSON.parse(res.result[0].updatedData).schemeId }));
          this.appStore.dispatch(updateSchemeFormsisTranMode({ status: true }));
          this.appStore.dispatch(updateSchemeFormsEditMode({ status: true }));
          this.appStore.dispatch(saveSchemeFormData({ schemejson: res.result[0].updatedData }));
          this.appStore.dispatch(updateTranNumber({ tranNum: res.result[0].tranNumber }));
          this.appStore.dispatch(enableAllEditSchemeFormViewState());

        } else {
          resolve(null);
        }
      },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  public getTransactionDataCommon(tranNum: number, branchId: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.commonService.getTransactionData(tranNum, branchId).subscribe((res: any) => {
        if (res.statusCode == 200) {
          resolve(res.result);
          this.appStore.dispatch(updateTransactionDetails({ editedData: JSON.parse(res.result[0].editedData) }));
        } else {
          resolve(null);
        }
      },
        (error: any) => {
          reject(error);
        }
      );
    });
  }


  public getCommonTransactionData(tranNum: number, branchId: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.commonService.getTransactionData(tranNum, branchId).subscribe((res: any) => {
        if (res.statusCode == 200) {
          resolve(res.result);
        } else {
          resolve(null);
        }
      },
        (error: any) => {
          reject(error);
        }
      );
    });
  }


  private getSchemeFormJsonName(formId: number = -1) {
    let schemeFormViewArray: any;
    this.appStore.select(fetchSchemeFormViewState).subscribe((data) => { schemeFormViewArray = data });
    const JsonRowName: SchemeFormViewState = schemeFormViewArray.find((item: SchemeFormViewState) => (item.id == formId) ? item : null);
    return JsonRowName.jsonName;
  }

  public getDescriptionById(array: any[], searchProperty: any, value: any, description: string): string {
    const filteredElements = array.find((item) => item[searchProperty] == value);
    return filteredElements[description];
  }
  public getDescriptionByNumber(array: any[], searchProperty: any, value: any, description: string): number {
    const filteredElement = array.find((item) => item[searchProperty] == value);
    return filteredElement ? filteredElement[description] : 0;
  }

  goToNextSchemeForm(formId: number) {
    this.appStore.dispatch(switchToNextSchemeForm({ formId: formId }))
  }

  public replaceKey(jsonArray: any[], oldKey: string, newKey: string) {
    // Iterate over the JSON array
    const transformedArray = jsonArray.map((item: any) => {
      if(item)
      {
      const newItem = { ...item };
      if (newItem.hasOwnProperty(oldKey)) {
        // Replace the key if it matches the old key
        newItem[newKey] = newItem[oldKey];
        delete newItem[oldKey];
      }
      return newItem;
    }
    });

    return transformedArray;
  }

  public addCustomKeyToJson(jsonArray: any, keyName: string, keyValue: any) {
    const newDataArray = jsonArray.map((item: any) => ({ ...item, [keyName]: keyValue }));
    return newDataArray;
  }

  public calculateAge(dob: string = ''): number {
    if (dob) {
      const userDOB = new Date(dob);
      const currentDate = new Date();
      if (currentDate < userDOB) return 0;
      const userDOBYear = userDOB.getFullYear();
      const userDOBMonth = userDOB.getMonth();
      const userDOBDay = userDOB.getDate();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const currentDay = currentDate.getDate();
      let userAge: number = currentYear - userDOBYear;
      if ((currentYear == userDOBYear)) userAge = 0
      else if (currentMonth == userDOBMonth && (currentDay < userDOBDay)) userAge = userAge - 1;
      else if (currentMonth < userDOBMonth) userAge == userAge - 1;
      return userAge;
    }
    return 0;
  }

  // public showSwalAlert(title: string, subString: string, iconType: any = 'info') {
  //   Swal.fire(title, subString, iconType).then(
  //     (data) => {
  //       if (data) return true;
  //       else return false;
  //     }
  //   );
  // }

  public ifFormValueChanges() {
    this.appStore.dispatch(disableOtherForms({ formId: 1 }))
  }


  //Swall alert functions----------------------------------------------------------------------------------------------------------------------------------------
  public showSwalAlert(title: string, subString: string, iconType: any = 'info'): Promise<boolean> {
    return new Promise((resolve) => {
      Swal.fire({ title: title, text: subString, icon: iconType, }).then((result) => {
        if (result.isConfirmed) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  public showSwalConfirm(title: string, subString: string, iconType: any = 'info', confirmButtonText: string, cancelButtonText: string, showCancelButton: boolean): Promise<boolean> {
    return new Promise((resolve) => {
      Swal.fire({ title: title, text: subString, icon: iconType, cancelButtonText: cancelButtonText, showCancelButton: showCancelButton, confirmButtonText: confirmButtonText}).then((result) => {
        if (result.isConfirmed) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  public showSwalToast(title:string='', description:string='', iconType:any='info', timer:number=3000){
    return new Promise(
      (resolve)=>{
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: timer,
          timerProgressBar: true,
          title: title,
          text: description,
          icon: iconType,
        }).then((result) => {
      if (result.isConfirmed) {
        resolve(true);
      } else {
        resolve(false);
      }
    })});
  }
// This is just an example of a custom method that displays a toast and resolves a promise after user interaction
public showSwalToast1(message: string, title: string, type: 'success' | 'error', duration: number): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    Swal.fire({
      title: title,
      text: message,
      icon: type,
      timer: duration,
      timerProgressBar: true,
      showConfirmButton: false,
      position: 'top-end',
      toast: true,
    }).then(() => {
      resolve(true); // Resolve the promise with true after the toast disappears
    });
  });
}

  //date formation funtions------------------------------------------------------------------------------------------------------------------------------------------------------------------------


  public formattedDate(date:Date)
  {
  const startDate = new Date(date)
  const Eday = startDate.getDate().toString().padStart(2, '0');
  const Emonth = (startDate.getMonth() + 1).toString().padStart(2, '0');
  const Eyear = startDate.getFullYear();
  // const Ehours = startDate.getHours().toString().padStart(2, '0');
  // const Eminutes = startDate.getMinutes().toString().padStart(2, '0');
  // const Eseconds = startDate.getSeconds().toString().padStart(2, '0');
  const formattedEndDate = `${Eyear}-${Emonth}-${Eday}`;
  //${Ehours}:${Eminutes}:${Eseconds}
  return formattedEndDate
}
//convert to yyyy-mm-dd format
public convertDateFormat(inputDate: string): string {
  // Split the input date into day, month, and year components
  const dateComponents = inputDate.split('-');
  const day = dateComponents[0];
  const month = dateComponents[1];
  const year = dateComponents[2];

  // Create a new Date object in 'yyyy-MM-dd' format
  const dateObject = new Date(`${year}-${month}-${day}`);

  // Get the formatted date in 'yyyy-MM-dd' format
  const formattedDate = dateObject.toISOString().split('T')[0];

  return formattedDate;
}
//check if this in dd/mm/yyyy format
public isValidDateFormat(dateStr: string) {
  const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // dd-MM-yyyy format
  return dateRegex.test(dateStr);
}

  //file upload functions----------------------------------------------------------------------------------------------------------------------------------------------------------------------

  //on selection a file
  public onFileSelect(fileName: string, event: any, controlValue: any, maxSize: number = 153600, minSize: number = 50000, allowedType: string = "application/pdf") {
    let fileDetails: any = null;
    if (event.target.files.length > 0) {
      const MAX_SIZE: number = maxSize;
      const MIN_SIZE: number = minSize;
      const allowed_type = [allowedType];
      const dotCount = event.target.files[0].name.split('.').length - 1;
      if (event.target.files[0].type != allowed_type) {
        fileDetails = {
          file: null,
          message: "File Must be in Pdf Format"
        }
      }

      else if (event.target.files[0].size < MIN_SIZE) {
        fileDetails = {
          file: null,
          message: "Minimum file size allowed to be uploaded is 50KB"
        }
      }
      else if (event.target.files[0].size > MAX_SIZE) {
        fileDetails = {
          file: null,
          message: "Maximum file size allowed to be uploaded is 150KB"
        }
      }
      else if (dotCount>1) {
        fileDetails = {
          file: null,
          message: "Invalid File Name"
        }
      }
      else if (
        event.target.files[0].size < MAX_SIZE &&
        event.target.files[0].size > MIN_SIZE
      ) {
        const file = event.target.files[0];
        const tempFileName = fileName + ".pdf";
        fileDetails = {
          fileName: tempFileName,
          file: event.target.files[0],
          valueOfControl: controlValue,
          message: "Success"
        }
      }
      else {
        fileDetails = {
          file: null,
          message: "Something went wrong. while getting file info"
        }
      }
    }
    else {
      fileDetails = {
        file: null,
        message: "Something went wrong. while getting file info"
      }
    }

    return fileDetails;
  }


  //to upload a file
  public glFileupload(fileName: string, file: any, imageType: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let fileUploadDetails = null;
      const File = new FormData();
      File.append("file", file);
      this.commonService.glFileUpload(fileName, File, imageType).subscribe(
        (data: any) => {
        if (data.statusCode == 200)  {
          fileUploadDetails = {
            status: true,
            filePath: data.result,
            message: 'successfully uploaded file'
          }
          resolve(fileUploadDetails);
        }
        else  {resolve(null);}
      },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  //OTP Functions----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //send otp to the mobile number
  public sendOTP(customerId:number|null=null, phoneNumber:number, verifiedSource:number, kycDocId:number|null=null, kycNumber:string|null=null, flag:string='CIS'): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let otpGenerateStatus = null;
      const File = new FormData();
      this.commonService.sendOTP(customerId, phoneNumber, verifiedSource, kycDocId, kycNumber, flag).subscribe(
        (data: any) => {
          if (data.statusCode == 200) {
            otpGenerateStatus = {
              status: data.result,
              message: data.message
            }
            resolve(otpGenerateStatus);
          }
          else if(data.statusCode == 404){
            otpGenerateStatus = {
              status: false,
              message: data.message
            }
          resolve(otpGenerateStatus);
          }
          else { resolve(null); };
        },
        (error) => { reject(error); }
      );
    });
  }

  //verify sended OTP------------------------------------------------------------------------------
  public verifyOTP(phoneNumber:number, OTP:number, flag:string='CIS'): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let otpVerificationStatus = null;
      this.commonService.verifyOTP(phoneNumber, OTP, flag).subscribe(
        (data: any) => {
          console.log('otp verify function env', data)
          if(data.statusCode == 200) {
            otpVerificationStatus = {
              status : data.result=='True'?true:false,
              message : data.message
            }
            resolve(otpVerificationStatus);
          }
          else{
            otpVerificationStatus = {
              status : false,
              message : data.message
            }
            resolve(otpVerificationStatus)
          }
        },
        (err) => { reject(err) }
      );
  });
}


//Bank related functions----------------------------------------------------------------------------------------
public checkIFSCExist(ifsc:string){
  return new Promise<any>((resolve, reject) => {
    this.commonService.checkIFSCExist(ifsc).subscribe(
      (data:any)=>{
        if(data.statusCode == 200) resolve(data.result)
        else resolve(null)
      },
      (error)=>{
        reject(null)
      }
    ) });
}



//PDF service functions------------------------------------------------------------------------------------------
generatePDF(content:any, fileNmae:string='unknown'):any {
  let pdfSrc:any = null;
  const options = {
    margin: 10,
    filename: fileNmae,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  return html2pdf()
    .from(content)
    .set(options)
    .outputPdf('datauristring');
}

printGeneratedPdf(pdfString:string='') {
  if(!pdfString){
    this.showSwalToast('Failed', 'PDF generation failed', 'error', 500);
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = pdfString;
  document.body.appendChild(iframe);

  iframe.onload = () => {
    // Wait for the iframe to load the PDF content
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe); // Remove the iframe after printing
    }, 1000);
  };
}


openPdfONNewTab(content:any) {
  const win = window.open('', '_blank');
  win?.document.write(content);
  win?.document.close();
  if(win){
    win.onload = () => {
    win?.print();
    win?.close();
  };}
}

public printPDF(pdfContent: Blob | string) {
  // Check if the browser supports printing
  if (window) {
    // Create a new window to open the PDF content
    const printWindow = window.open('', '_blank', 'height=800,width=600');

    if (printWindow) {
      // Write the PDF content to the new window
      printWindow.document.write(
        `<iframe width="100%" height="100%" src="${
          typeof pdfContent === 'string' ? pdfContent : URL.createObjectURL(pdfContent)
        }"></iframe>`
      );

      // Wait for the PDF content to be loaded in the new window
      printWindow.document.addEventListener('DOMContentLoaded', () => {
        // Call the print method on the new window
        printWindow.print();
      });
    } else {
      // Failed to open a new window
      console.error('Failed to open a new window for printing.');
    }
  } else {
    // Printing not supported in this browser
    console.error('Printing is not supported in this browser.');
  }
}

public printPDF2(blob: Blob){
  // Create a Blob URL from the Blob
  const pdfUrl = URL.createObjectURL(blob);

  // Create a hidden anchor element to trigger the print
  const anchor = document.createElement('a');
  anchor.href = pdfUrl;
  anchor.target = '_blank'; // Open in a new tab (optional)
  anchor.download = 'generated.pdf'; // Specify a filename for the downloaded file
  anchor.click();

  // Clean up: revoke the Blob URL
  setTimeout(() => {
    URL.revokeObjectURL(pdfUrl);
  }, 100); // Adjust the delay as needed to ensure the download is initiated
}
}

