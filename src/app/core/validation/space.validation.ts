// @Component({
//     selector: 'app-your-component',
//     templateUrl: './your-component.html',
//     styleUrls: ['./your-component.css']
//   })
//   export class YourComponent {
//     form: FormGroup;
  
//     constructor() {
//       this.form = new FormGroup({
//         inputField: new FormControl('', [Validators.required, this.onlySpacesValidator])
//       });
//     }
  
//     onlySpacesValidator(control: FormControl): { [key: string]: boolean } | null {
//       const value = control.value;
//       if (value && value.trim().length === 0) {
//         return { containsOnlySpaces: true };
//       }
//       return null;
//     }
//   }
  