#MatchYourPartner Api Router list

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRouter
- POST /request/send/:status/:userId" //ignored|interested

- POST /request/review/:status/:requestId // accepted|interested

## userRouter
- GET /user/feed - get views all profile of others users on platform
- GET /user/connections - views all connections received
- GET /user/requested - views all connections requests