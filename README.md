# API for getting NYC MTA Train times
https://mta-real-time.herokuapp.com/

# Usage
`/stations`

@GET Gets all stations in the MTA system

`/stations/${stationId}`

@GET Gets specific station information 


`trains/${trainId}/${stationId}`

trainId = Train Number or Letter e.g (1,2,3,N,Q,R)

stationId = ID found in `/data/stations`

`/tweets`

@GET Gets available information regarding subways from @MTASubway

`/tweets/update`

@POST Refresh to get latest available information regrading subways from @MTASubway

`/user`

@GET Gets all users information

`/user/:id`

@GET Get user information that matches passed in id

`/user`

@POST Create new user with the following json body 
{
  "username": "Test",
  "password": "test",
  "email": "test@gmail.com
}
  
 `/user/login`
 
 @POST Login with the following json body, will return with user info and jwt token if successful 
 {
  "username": "Test",
  "password": "test"
 }

@POST Logout currently logged in user. Route will only work if logged in.

`/user/logout`

