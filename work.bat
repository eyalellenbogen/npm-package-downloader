cd work
call npm install
call npm list --depth 500 --json > ./list.json 
cd..
node run