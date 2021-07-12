# Aircall

## Instructions

How to launch unit tests:

```sh
npm install
npm test
```

## Concurrency issues

In order to avoid repeated notifications when 2 alerts (for a monitored service) are received at the same time, 
the method PagerRepositoryPort.create return a boolean value to indicate if the incident has been created. This method 
gives priority to the request which arrives first, while rejecting next requests, returning false as result.