# Torflix Web App

## Development

Starting the app

```sh
./bin/web_server
```

## Architecture


#### app.state

`app.state` is a hot stream

`app.events` is a cold stream



- state is derived entirely from streams
- all actions are emitted over a single events stream
- resources:
  - listen to the eventStream
  - emit a stateStream
- resource state is rolled into app state via stream merging
- all streams need to be hot streams that emit on subscription



