# Fireship 100s video feed

Simple Cloudflare Worker that tracks the most recent 10 videos from [Fireship.io](https://www.youtube.com/channel/UCsBjURrPoezykLs9EqgamOA) under the _100SecondsOfCode_ category.

Whenever a new video or a batch of videos are published, the KV-stored feed is updated, and it is notified via Discord Webooks to our Student Group community:

<p align="center">
  <img width="496" alt="image" src="https://user-images.githubusercontent.com/4632429/155833697-79a42f67-bc8c-42e9-8932-14486cd4d208.png">
</p>


## Contribute

1. Install project dependencies:

   `$ yarn install`

2. Setup your `.dev.vars` file with the contents of `.dev.vars.example`

3. Run the project:

   `$ yarn dev`
