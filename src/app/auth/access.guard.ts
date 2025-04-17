import { inject } from "@angular/core"
import { AuthService } from "./auth.service"
import { Router } from "@angular/router"
import { CookieService } from "ngx-cookie-service"

export const canActivateAuth = () => {
    const cookieSvc   = inject(CookieService);


    if (!cookieSvc.check('token')) {
        return inject(Router).createUrlTree(['/login'])
    }

    return
}