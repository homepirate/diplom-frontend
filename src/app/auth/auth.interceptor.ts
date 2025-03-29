import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { BehaviorSubject, catchError, filter, switchMap, tap, throwError } from "rxjs";

let isRefresing$ = new BehaviorSubject<boolean>(false)

export const AuthTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService)
    const token = authService.token

    if (!token){
        return next(req)
    }

    if (isRefresing$.value){
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