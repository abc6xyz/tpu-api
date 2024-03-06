## Deploy Server  
- install packages  
`npm i`  
- run server  
`npm run build & npm run start` or `npm run server`
  
Default port: `5000`  

## Test  
### Run model  
~~~
curl --request POST \
  --url http://localhost:5000/api/model/run \
  --header "Content-Type: application/json" \
  --header "Authorization: r8_1lRn9l5QQJv0pgRqUu2ZkgBuC1wcMBe337HTI" \
  --data '{"model": "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", "input": { "prompt": "An astronaut riding a rainbow unicorn, cinematic, dramatic"}}'
~~~