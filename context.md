- EasiShop is a price comparison website based in South Africa
- the platform was founded by two students at Stellenbosch University
- the platform aims to assist consumers with finding the best price
- it also allows users to  create shopping lists 
- the data is scraped from five retailers 
- Woolworths
- Checkers (chk)
- Shoprite (srt)
- Dischem (pharmacy and beauty only) (dsc)
- PicnPay (pnp)

there is a consumer facing platform and another platform only accessible the admins where they can see analytics 
- I Tendai am handling the frontend my co-founder Tinashe will work on connecting the frontend to the backend
- we want to revamp the UI/UX of the site so this repo is to serve as a demo and for the scafollding 
- check design md files
- we want users to immediately get on the app and search or select categories to view by
- the idea is to mimic the way a user naturally shops in a store, the user always has an agenda when they enter a store

- another thing i want to emphasise this time around is ease of backward navigation
- another is having 2 focuses on UI
- first is desktop focus, there must be effiecient use of space in this focus
- secondly is a mobile UI that feels like a native app experience, so the use of drawers and floating widgets 
- to enhance our app's virality we want a mobile UI that makes it easy for us to demonstrate our major selling point(price comp) in one screenshot so in this regard it would be nice to have a price comparison page UI that draws less emphasise to the product picture and more to showing the price comparison
- our copywriting should be layman and concise and friendly and human like
- since this is a demo for storage of things that need a backend we can use localstorage and cookie session trackie
- the demo should be assuming that the user has an account

- for ease of maintaining I want the site to have reusable components so I can make one change in one place and not worry about it

- if a product is not available at certain retailer dont display that retailer on the comparison page

- the onboarding on the site must be geared towards conversions
- there must be an account profile where users can edit their account names, adjust marketing preferences 
- even though we dont have price analytics data just build the dashboards with generated data in a json file
- extract a random sample of products and prices and product images from the api and store them in a json for the purpose of the demo 
- get enough coverage for the different categories
- there should also be a barcode scanning feature on the search but this will use the client side rendering
- we do plan on including location based pricing so it is wise to have a mechanism that checks for the user's location via their device's gps 
- primary call to action on a product card is getting them to add product to list, a simple heart button will do that 
- on the product card show the lowest price that thing is available at
- if possible try show also on the comparison page where a user could get the best value e.g cheaper R/kg 

- the app should use skeletons when components are taking too long to load
- on top of backward nav the page should have breadcrumbing

another thing is that we want to track user behaviour and what users are doing on the website create scaffolding for that too this will form the basis of our B2B offering to FMCG companies in South Africa

- in production only users with accounts can create lists 
we also want users to sign up for price alerts so they should also be allowed to toggle that 
- allow users to add loyalty cards 


- social links
https://www.tiktok.com/@easishop_za
https://www.instagram.com/easishop_za
https://www.facebook.com/easishopza
https://www.linkedin.com/company/easishop


- features
- create and saving lists
- explore by category, exploring top deals by categories 
- product search via text or barcode



the main categories
Toiletries
Household
Kids
Wine & Bubbles
Cleaning
Fruits & Vegetables
Meat, Poultry & Fish
Bakery
Milk & Dairy
Pantry
Beverages & Juices
Deli
Frozen
Fragrance
Skincare
Makeup
Haircare
Mens Grooming
Bath and Body
Kids & Baby
Cellphones


#more context
``` 
<title>EasiShop – Compare Grocery Prices & Save Money in South Africa</title>
    <meta name="description" content="Easishop helps South Africans compare grocery prices from top retailers and save money. Find the best deals and plan your shopping smartly.">
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-ED0VPFKXPX"></script>

  <!-- Basic Open Graph Tags -->
<meta property="og:title" content="EasiShop - Compare Prices from Different Retailers" />
<meta property="og:description" content="Find the best deals from different stores. Save money by comparing grocery prices with EasiShop!" />
<meta property="og:image" content="https://easishop.co.za/flyer1.png" />
<meta property="og:url" content="https://easishop.co.za" />
<meta property="og:type" content="website" />

<!-- Twitter Card Tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="EasiShop - Compare Prices from Different Retailers" />
<meta name="twitter:description" content="Get the lowest prices from top stores. EasiShop makes grocery shopping smarter!" />
<meta name="twitter:image" content="https://easishop.co.za/flyer1.png" />
<meta name="twitter:url" content="https://easishop.co.za" />
<!-- SEO -->
    <meta name="robots" content="index, follow">
<meta http-equiv="Content-Language" content="en-ZA">
<link rel="canonical" href="https://easishop.co.za">
<meta name="keywords" content="grocery price comparison, South Africa groceries, supermarket deals, food prices South Africa, save money shopping,easy shop,easishop,easishop,checkers specials,pnp specials this week,shoprite specials this week,shoprite,checkers, pick n pay, woolworths, compare prices">


```