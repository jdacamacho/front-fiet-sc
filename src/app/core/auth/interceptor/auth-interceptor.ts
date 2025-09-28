import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');
  let headers = req.headers || new Headers(); 
  if (token)
    headers = headers.set('Authorization', `Bearer ${token}`);
  const authReq = req.clone({ headers });
  return next(authReq);
};
