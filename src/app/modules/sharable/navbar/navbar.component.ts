import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { AppState } from 'src/app/core/store/app.state';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { getAppStateData, getUserId } from 'src/app/core/store/Auth/auth.selectors';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  currentDate:any;
  private unsubscription: Subscription;
  public userDetails:any

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
    private appStore:Store<AppState>
  ) { }

  ngOnInit(): void {
    this.currentDate=new Date();
    this.unsubscription=this.appStore.select(getAppStateData).subscribe((data)=>{
      const userData={
           bName:data.currentBranchName,
           bId:data.currentBranchId,
           navbranch:data.currentBranchId + "-" + data.currentBranchName,
           userId:data.userId,
           userName:data.userName,
           name:data.name,
           homeBranch:data.branchName,
           email:data.email,
           homeUrl:"http://localhost:4200/general/apps"
      }
      this.userDetails=userData
    })

  }

  /**
   * Sidebar toggle on hamburger button click
   */
  toggleSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  open(content: any) {
    Swal.fire({
      text: 'Do you want to Switch Branch',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#7987a1',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        // this.modalRef = this.modalService
        //   .open(content, { ariaLabelledBy: 'modal-basic-title' })
        //   .result.then((result) => {
        //     this.modalRef.componentInstance.foo = 'bar';
        //     this.closeResult = `Closed with: ${result}`;
        //   });
      }
    });
  }

  /**
   * Logout
   */
  onLogout(e: Event) {
    e.preventDefault();
    localStorage.removeItem('isLoggedin');

    if (!localStorage.getItem('isLoggedin')) {
      this.router.navigate(['/auth/login']);
    }
  }

  ngOnDestroy(): void {
    if (this.unsubscription)
      this.unsubscription.unsubscribe();
  }

}
