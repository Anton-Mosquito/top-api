import { AuthGuard } from "@nestjs/passport";

export class JwtAuthGard extends AuthGuard('jwt') {}