
## How to run this application

1. Clone this repository locally
2. Run `npm install` to install dependencies
3. Setup mysql database from config/receipt_tracker.sql
3. Configure your .env file according to the sample .env called env.sample, which has the following fields:-
   GOOGLE_APPLICATION_CREDENTIALS=./config/cred.json (this will be your Goolge Vision API credentials, in case you want to use this. This is highly reommended for higher accuracy but its chargeable)
   APP_API_BASE_URL=http://localhost:3000 (change the url and port as per your choosing)
   APP_API_PORT=3000
   APP_URL=http://localhost:3001 (this is the react frontend url and port, which needs to change as per your setting)
   GROQ_API_KEY = You need to add a groq API key here. This will be used to parse the extrated text from vision api to generate a JSON file
   GROQ_API_BASE_URL= https://api.groq.com/openai/v1
   MYSQL_DB_USERNAME=receipt_tracker - change this as needed
   MYSQL_DB_PASSWORD=receipt_tracker - change this as needed
   MYSQL_DB_NAME=receipt_tracker - change this as needed
   UPLOAD_PATH=./uploads - this is the folder which all the processed receipts will be uploaded

## Unit tests
Only postman tests have been carried out and there are no unit test routines with this code. 

## AI models used
Google Vision API - For extraction of receipt data from the images
Tesseract.js - For extraction of receipt data from the images
Groq/llama-3.3-70b-versatile - For extraction of relevant information in a structured JSON files from the output of vision models

## Sample JSON file generated from the nest endpoint
{
    "date": "2021-03-25T18:30:00.000Z",
    "currency": "USD",
    "vendor_name": "SSTOPaSHOP",
    "tax": "1.73",
    "amount": 17.32,
    "image_url": "b035f91c-7073-40b0-8fa4-a490532d5a99.jpg",
    "id": 72,
    "created_at": "2025-05-05T15:43:21.000Z",
    "updated_at": "2025-05-05T15:43:21.000Z",
    "receipt_items": [
        {
            "description": "SB BGICE CB 10LB",
            "price": 2.99,
            "quantity": 3,
            "tax": "0.90",
            "amount": 8.97,
            "receipt": {
                "id": 72,
                "date": "2021-03-25T18:30:00.000Z",
                "currency": "USD",
                "vendor_name": "SSTOPaSHOP",
                "tax": "1.73",
                "amount": 17.32,
                "image_url": "b035f91c-7073-40b0-8fa4-a490532d5a99.jpg",
                "created_at": "2025-05-05T15:43:21.000Z",
                "updated_at": "2025-05-05T15:43:21.000Z"
            },
            "id": 482,
            "created_at": "2025-05-05T15:43:21.000Z"
        },
        {
            "description": "HALLMARK CARD",
            "price": 2,
            "quantity": 1,
            "tax": "0.20",
            "amount": 2,
            "receipt": {
                "id": 72,
                "date": "2021-03-25T18:30:00.000Z",
                "currency": "USD",
                "vendor_name": "SSTOPaSHOP",
                "tax": "1.73",
                "amount": 17.32,
                "image_url": "b035f91c-7073-40b0-8fa4-a490532d5a99.jpg",
                "created_at": "2025-05-05T15:43:21.000Z",
                "updated_at": "2025-05-05T15:43:21.000Z"
            },
            "id": 483,
            "created_at": "2025-05-05T15:43:21.000Z"
        },
        {
            "description": "HALLMARK CARD",
            "price": 0.99,
            "quantity": 1,
            "tax": "0.10",
            "amount": 0.99,
            "receipt": {
                "id": 72,
                "date": "2021-03-25T18:30:00.000Z",
                "currency": "USD",
                "vendor_name": "SSTOPaSHOP",
                "tax": "1.73",
                "amount": 17.32,
                "image_url": "b035f91c-7073-40b0-8fa4-a490532d5a99.jpg",
                "created_at": "2025-05-05T15:43:21.000Z",
                "updated_at": "2025-05-05T15:43:21.000Z"
            },
            "id": 484,
            "created_at": "2025-05-05T15:43:21.000Z"
        },
        {
            "description": "MR CHARITY",
            "price": 0,
            "quantity": 1,
            "tax": "0.00",
            "amount": 0,
            "receipt": {
                "id": 72,
                "date": "2021-03-25T18:30:00.000Z",
                "currency": "USD",
                "vendor_name": "SSTOPaSHOP",
                "tax": "1.73",
                "amount": 17.32,
                "image_url": "b035f91c-7073-40b0-8fa4-a490532d5a99.jpg",
                "created_at": "2025-05-05T15:43:21.000Z",
                "updated_at": "2025-05-05T15:43:21.000Z"
            },
            "id": 485,
            "created_at": "2025-05-05T15:43:21.000Z"
        }
    ]
}


## Future todos and improvements 
a. Groq API timeouts
b. More vision model exploration to reduce cost from Google api calls
c. Hosting LLama/other free language and vision models on bedrock
d. Saving receipts and data on s3
e. Authentication
f. Duplicate reciept rejection
g. More swagger details for APIs