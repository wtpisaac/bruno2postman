# bruno2postman
an experimental, WIP utility to convert Bruno collections into Postman
collections.

installation:
```
npm i -g bruno2postman
```

usage:
```
bruno2postman <input bruno collection folder> <output postman json file>
```

e.g.,
```
bruno2postman ~/Dev/Bruno/StarWarsAPI ./StarWars.json
```

## Features
this tool is VERY incomplete, and lacks substantial functionality. i am
building this primarily for the case where you need to give someone a set of
HTTP requests quickly, and they don't use Bruno.

currently, this handles:
- basic HTTP requests with JSON bodies
- headers
- query params
- folder/hiearchical structure

it does not support:
- graphql
- non-JSON bodies
- probably other things!

it will likely never support:
- scripts (I assume these are totally incompatible)
- tests (I assume these are totally incompatible)

this will also likely **crash and burn** on invalid input data. there is a 
substantial lack of error handling at play. you are warned.

it may also break on valid data! i'm basically reverse engineering what Bruno
can do, because I have no idea how to read their parsing code :).

## Support
testing on Linux; will probably work on macOS; good luck on Windows (but
please feel free to PR fixes for Windows to get it working)

## License
Licensed under the MIT License.
