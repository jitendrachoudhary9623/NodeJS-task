# NodeJS-task

# End points

## For Running Tests
### Use npm test
### Please add your mailgun api keys on line number 10 for variables var api_key = "your apikey here ";var domain = "your domain here";
## The app works on port number 3010 
  - http://localhost:3010/form
  -- This will endpoint sends the data to express where it saves to a file
  --- And validates the data
  ---- If data is valid then it sends the email to mentioned email address
### 
  - GET  / all the data 
  -- http://localhost:3010/
   - GET  /latest gets a latest data
  -- http://localhost:3010/latest 
  - GET  /{number} gets data at the specified number
  -- http://localhost:3010/5

  
