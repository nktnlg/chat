import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "../services/auth.service";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor{
  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //console.log(`intercept attempt, isAuth:${this.auth.isAuthenticated()} / Token: ${this.auth.getToken()}`)
    if (this.auth.isAuthenticated()){
      //console.log('intercept isAuthenticated passed true')
      req = req.clone(
        {
          setHeaders: {
            Authorization: this.auth.getToken()
          }
        }
      )
    }
    return next.handle(req).pipe(
      catchError(
        (error: HttpErrorResponse)=> this.handleAuthError(error)
      )
    )
  }

  private handleAuthError(error: HttpErrorResponse): Observable<any>{

    if (error.status === 401) {
      this.router.navigate(['/'], {
        queryParams: {
          sessionExpired: true
        }
      })
    }

    return throwError(error)
  }
  //end
}
