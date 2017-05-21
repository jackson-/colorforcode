import { RECEIVE_ROUTER_STATE } from '../constants'

export const receiveRouterState = router => ({
  router,
  type: RECEIVE_ROUTER_STATE
})
