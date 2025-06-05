import { Injectable, type ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    return super.canActivate(context)
  }

  handleRequest(err, user, info) {

    console.log("JwtAuthGuard handleRequest - err:", err);
  console.log("JwtAuthGuard handleRequest - user:", user);
  console.log("JwtAuthGuard handleRequest - info:", info);
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException("Please log in to access this resource")
    }
    return user
  }
}
