
with open('src/pages/buyer/BuyerMarketplace.jsx', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('|| currentUser.buyerType === \'retail\' || biddingListing.quantity < 500;', 'const isRetail = currentUser.role === \'consumer\' || currentUser.buyerType === \'retail\' || currentUser.buyerTier === \'retailer\' || biddingListing.quantity < 500;')
with open('src/pages/buyer/BuyerMarketplace.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

