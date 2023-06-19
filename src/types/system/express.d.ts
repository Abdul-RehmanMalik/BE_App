export interface CustomRequest extends ExpressRequest {
  accessToken?: string
  query: Query;
  user?: import('../').RequestUser
}
