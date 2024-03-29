import { I } from "@angular/cdk/keycodes";
import { Injectable } from "@angular/core";
import{ActivatedRouteSnapshot,CanActivate,Router,RouterStateSnapshot,UrlTree }from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "./authentication.service";

@Injectable({
    providedIn: "root",
})

export class AuthGuard implements CanActivate{
    constructor(
        private router:Router,
        private authService:AuthenticationService
    ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let isAuth=this.authService.isLoggedIn();
        if(!isAuth){
            this.router.navigate(["login"]);
        }
        return isAuth;
    }
}
