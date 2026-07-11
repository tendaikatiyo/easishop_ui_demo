EasiShop Developer API Documentation 
Internal reference for the EasiShop platform API 
The API is accessible via the same domain as the main website: https://www.easishop.co.za/api/v1/. All 
endpoints are protected with HTTP Basic Authentication. 
Base URL 
Environment 
Base URL 
Production 
https://www.easishop.co.za/api/v1 
Authentication 
Every request must include HTTP Basic Authentication credentials, supplied by the backend team, in the 
Authorization header. 
Example header: 
Authorization: Basic <base64(username:password)> 
Endpoints 
1. Search Products 
POST /search 
Search for products by name. 
Request body (JSON): 
{ 
"query": "milk" 
} 
Response: a list of product matches with retailer prices. 
2. Dashboard Statistics 
GET /analytics/dashboard-stats 
Returns overall statistics (total products, retailers, average prices, etc.). 
3. Recent Price Changes (Last Week) 
GET /analytics/price-changes/last-week 
Returns products with significant price changes in the past 7 days. 
4. Biggest Price Changes 
GET /analytics/biggest-changes?days=30 
Products with the largest absolute price changes over the last N days (default 30). 
5. Price Volatility 
GET /analytics/volatility?days=30 
Products with the highest price variation (standard deviation) over the period. 
6. Retailer Comparison 
GET /analytics/retailer-comparison 
Average price and product count per retailer. 
Example Usage 
Replace <username> and <password> below with the credentials issued by the backend team. 
cURL 
curl -X POST https://www.easishop.co.za/api/v1/search \ -u <username>:<password> \ -H "Content-Type: application/json" \ -d '{"query":"milk"}' 
Error Handling 
Status Code 
Meaning 
401 
400 
Missing or invalid credentials. 
Malformed request (e.g., missing query). 
500 
Server error — contact backend team. 
Error response format: 
{ "error": "Missing credentials" } 
Important Notes 
● CORS: All origins are allowed during development. 
● Rate limiting: not currently enforced — use responsibly. 
● Image URLs: some images may be relative; ask backend for retailer base URLs if needed. 
● Date format: ISO 8601 (YYYY-MM-DDTHH:MM:SS). 
Support 
If you run into issues or need clarification, reach out to the backend team. 