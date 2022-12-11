import { Component, ViewChild, HostListener, OnInit,NgZone } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd ,Router} from '@angular/router';
import { AuthenticationService } from './shared/authentication.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  opened = true;
  isLoginPage=false;
  isUserLoggedIn=false;
  userName="";
  displayProgressbar=false;

  @ViewChild('sidenav',{static:true}) sidenav: MatSidenav;

  ngOnInit() {
    console.log(window.innerWidth);
    if (window.innerWidth < 768) {
      if(this.sidenav) this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      if(this.sidenav) this.sidenav.fixedTopGap = 55;
      this.opened = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 768) {
      if(this.sidenav)  this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      if(this.sidenav)  this.sidenav.fixedTopGap = 55;
      this.opened = true;
    }
  }

  isBiggerScreen() {
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    if (width < 768) {
      return true;
    } else {
      return false;
    }
  }

  constructor(
    private router:Router,
    private ngZone:NgZone,
    private authenticationservice:AuthenticationService){
      this.initPage();
      this.handleMenu();
    
    }

    initPage(){
      let user =this.authenticationservice.getLoggedInUser();
      this.isUserLoggedIn=user.isLoggedIn;
      this.userName=this.authenticationservice.getDisplayNmae();

    }

    public toggleProgressBar=(state:boolean)=>{
      this.displayProgressbar=state;

    };



    public setUsername=(un:string)=>{ this.userName=un;}

    handleMenu(){
      this.router.events.subscribe((event:any)=>{
        if(event instanceof NavigationEnd){
          var pages=["/login","/register"]
          this.isLoginPage=pages.includes(event.url);
        }
      });
    }

    logOut(){
      this.authenticationservice.logout();
      this.ngZone.run(()=>this.router.navigateByUrl("/login"));

    }
}
