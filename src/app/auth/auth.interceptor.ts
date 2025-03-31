import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { BehaviorSubject, catchError, filter, switchMap, tap, throwError } from "rxjs";


export const AuthTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService)
    const token = authService.getToken()

    if (!token){
        console.log("No token")
        return next(req)
    }

    return next(addToken(req, token)).pipe(
        catchError(error => {
            if (error.status == 403) {
            }

            return throwError(error)
        })
    )
}




const addToken = (req: HttpRequest<any>, token: string) =>{

    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    }
    )
}