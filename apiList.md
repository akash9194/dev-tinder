# Dev Tinder APIs
 
## authRouter
 -POST /signup
 -POST /login
 -POST /logout

## profileRouter
 -GET /profile/view
 -PATCH /profile/edit
 -PATCH /profile/password

## connectionRequest Router
-POST /request/send/interested/:userId
-POST /request/send/ignored/:userId
-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId

## userRouter
-GET /user/requests/received
-GET /user/connections

-GET /user/feed - Gets you the profiles of other users on the platform

 Status: ignore, interested, accepted, rejected



