import { Injectable } from "@angular/core";
import { AmazonAIPredictionsProvider } from "@aws-amplify/predictions";

import { CognitoUserPool } from "amazon-cognito-identity-js";
import { group } from "console";

import { environment } from "src/environments/environment";


interface UserContext {
    isLoggedIn: boolean;
    username: string;
    email: string;
    group: string[];
    isAdmin: boolean;
}

@Injectable({
    providedIn: "root",
})

export class AuthenticationService {
    constructor() { }

    logout() {
        let cognitouser = this.getCognitoUser();
        window.sessionStorage.clear();
        cognitouser.signOut();

    }

    isLoggedIn(): boolean {
        let user = this.getLoggedInUser();
        return user.isLoggedIn;

    }

    getCurrentUsername(): string {

        return this.sessionGet("username");
    }

    getDisplayNmae(): string {
        const displayname = this.sessionGet("displayname");
        const currentUsername = this.getCurrentUsername();
        console.log('${displayname},${currentUsername}');
        return displayname ? displayname : currentUsername;
    }

    getLoggedInUser(): UserContext {
        let sessionUser = this.sessionGet(this.getCurrentUsername);
        if (sessionUser) {
            return sessionUser;

        }


        let user: UserContext = {
            isLoggedIn: false,
            username: "",
            email: "",
            group: [],
            isAdmin: false,

        };

        let cognitoUser = this.getCognitoUser();

        if (cognitoUser != null) {
            cognitoUser.getSession((err: any, session: any) => {
                if (err) {
                    console.log(err.message || JSON.stringify(err));

                } else {
                    user = this.getParsedCognitoSession(session);
                    this.sessionSet(user.username, user);
                }
            });
        }

        return user;
    }



    private getCognitoUser(): any {
        let poolData = {
            UserPoolId: environment.cognitoUserPoolId,
            ClientId: environment.cognitoAppClientId,
        };

        var userPool = new CognitoUserPool(poolData);
        var cognitoUser = userPool.getCurrentUser();
        return cognitoUser;
    }

    getParsedCognitoSession(session): UserContext {
        const AdminRole = "admin";
        const isAuthenticated = session.isValid();
        var payload = session.getIdToken().payload;

        const userName = payload["cognito:username"];
        const group = payload["cognito:groups"];

        let user: UserContext = {
            isLoggedIn: isAuthenticated,
            username: userName,
            email: payload["email"],
            group: group,
            isAdmin: this.isAdmin(AdminRole, group),
        };
        return user;

    }

    isAdmin(userName, group): boolean {
        if (group == null) return false;
        return group.includes(userName);
    }
    sessionGet(key) {
        let stringValue = window.sessionStorage.getItem(key);
        if (stringValue !== null) {
            let value = JSON.parse(stringValue);
            let expirationDate = new Date(value.expirationDate);
            if (expirationDate > new Date()) {
                return value.value;
            } else {
                window.sessionStorage.removeItem(key);
            }

        }
        return null;
    }

    sessionSet(key, value, expirationInMin = 10) {
        let expirationDate = new Date(
            new Date().getTime() + 60000 * expirationInMin
        );
        let newValue = {
            value: value,
            expirationDate: expirationDate.toISOString(),
        };
        window.sessionStorage.setItem(key, JSON.stringify(newValue));
    }


}





