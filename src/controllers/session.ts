import { Request, Security, Route, Tags, Example, Get } from 'tsoa'
import { UserResponse } from './users'
import { UserRequest } from '../types/UserRequest'

interface SessionResponse extends UserResponse {
  isActivated: boolean
  name: string
  id: number
  profilePicture: string
}

@Security('bearerAuth')
@Route('/session')
@Tags('Session')
export class SessionController {
  /**
   * @summary Get session info.
   *
   */
  @Example<UserResponse>({
    id: 123,
    name: 'johnusername',
    isActivated: false,
  })
  @Get('/')
  public async session(@Request() req: UserRequest): Promise<SessionResponse> {
    console.log('session api called')
    return session(req)
  }
}

const session = (req: UserRequest) => ({
  id: req.user!.id,
  name: req.user!.name,
  isActivated: req.user!.isActivated,
  profilePicture: req.user!.profilePicture,
})
