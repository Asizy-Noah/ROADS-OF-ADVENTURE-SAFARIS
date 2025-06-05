// src/auth/guards/session-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Log the entire session object for initial debugging
    

    const sessionUser = request.session?.user;

    
    if (!sessionUser) {
      
      // You might want to implement a redirect here if not authenticated,
      // for example, request.res.redirect('/auth/login');
      // However, ensure this guard is "passthrough" or you handle response outside Nest's lifecycle.
      // For now, just returning false is fine for debugging.
      return false; 
    }

    // Attach user to request object so RolesGuard and other middlewares can access it
    request.user = sessionUser;
    

    return true; // Or add condition: && sessionUser.status === 'active' for stricter routes
  }
}