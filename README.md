# API for getting NYC MTA Train times
https://mta-real-time.herokuapp.com/

# Source 
http://web.mta.info/developers/developer-data-terms.html#data

# Under Active Development 
Any Feedback is welcome!
# Endpoints

## Stations
@GET Gets all stations in the MTA system

Sample Request:
```
https://mta-real-time.herokuapp.com/stations
```
Sample Response:
```
"101": {
  "Station ID": 293,
  "Complex ID": 293,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "Van Cortlandt Park - 242 St",
  "Borough": "Bx",
  "Daytime Routes": 1,
  "Structure": "Elevated",
  "GTFS Latitude": 40.889248,
  "GTFS Longitude": -73.898583,
  "North Direction Label": "",
  "South Direction Label": "Manhattan"
},
...
```
```

Note: "101" is the station ID for Van Cortlandt Park - 242 St
```
@GET Gets specific station information 

Sample Request:
```
https://mta-real-time.herokuapp.com/stations/101
```
Sample Response:
```
{
  "Station ID": 295,
  "Complex ID": 295,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "231 St",
  "Borough": "Bx",
  "Daytime Routes": 1,
  "Structure": "Elevated",
  "GTFS Latitude": 40.878856,
  "GTFS Longitude": -73.904834,
  "North Direction Label": "242 St",
  "South Direction Label": "Manhattan"
},
...
```

## Trains
@GET Gets info based on trainId
```
trainId = Train Number or Letter e.g (1,2,3,N,Q,R)
```
Sample Request:
```
https://mta-real-time.herokuapp.com/trains/6
```
Sample Response:
```
{
  "stationName": "Pelham Bay Park",
  "stationId": "601",
  "trainRoutes": 6
},
{
  "stationName": "Buhre Av",
  "stationId": "602",
  "trainRoutes": 6
},
...
```
@GET Gets train time info based on trainID and stationID
Sample Request:
```
https://mta-real-time.herokuapp.com/trains/6/601
```
Sample Response:
```
"northBound": [
{
  "routeId": "6",
  "arrival": "Aug 22 2019 9:15:58 PM",
  "stopId": "602N",
  "stopName": "Buhre Av",
  "posixTime": 1566508558,
  "minutesArrival": "8 Mins"
  },
  ...
"southBound": [
  {
  "routeId": "6",
  "arrival": "Aug 22 2019 9:13:30 PM",
  "stopId": "602S",
  "stopName": "Buhre Av",
  "posixTime": 1566508410,
  "minutesArrival": "6 Mins"
  },
  ...
```

@GET Gets all trains arriving in stations now
Sample Request:
```
https://mta-real-time.herokuapp.com/trains/now
```
Sample Response:
```
{
  "stationId": "138",
  "stopName": "WTC Cortlandt",
  "bound": "N",
  "latitude": 40.711835,
  "longitude": -74.012188,
  "train": "1"
},
{
  "stationId": "230",
  "stopName": "Wall St",
  "bound": "S",
  "latitude": 40.706821,
  "longitude": -74.0091,
  "train": "2"
},
...

```
## Twitter
@GET Gets available information regarding subways from @MTASubway

Sample Request:
```
https://mta-real-time.herokuapp.com/tweets
```
@POST Refresh to get latest available information regrading subways from @MTASubway
Sample Request:
```
https://mta-real-time.herokuapp.com/tweets/update
```
@POST Refresh to get latest available information regrading subways from @MTASubway

`/user`

@GET Gets all users information

`/user/:id`

@GET Get user information that matches passed in id

`/user`

@POST Create new user with the following json body 
```
{
  "username": "Test",
  "password": "test",
  "email": "test@gmail.com
}
 ```
 
 `/user/login`
 
 @POST Login with the following json body, will return with user info and jwt token if successful 
 
 ```
 {
  "username": "Test",
  "password": "test"
 }
```

@POST Logout currently logged in user. Route will only work if logged in.

`/user/logout`

@GET Get specified user's favorite trains

`/favorite/:id/trains`

@GET Get specified uer's favorite stations

`/favorite/:id/stations`

@PUT Add a favorite train to user profile

`/favorite/:id/train/:train`

@PUT Add a favorite station to user profile

`/favorite/:id/station/:station`

@PUT Remove a station the user favorited

`/favorite/:id/station/:station/remove`

@PUT Remove a train the user favorited

`/favorite/:id/train/:train/remove`
