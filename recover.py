
with open('src/pages/buyer/BuyerMarketplace.jsx', 'r', encoding='utf-8') as f:
    text = f.read()
bad_str = 'const isRetail = currentUser.role === \'consumer\' || currentUser.buyerType === \'retail\' || currentUser.buyerTier === \'retailer\' || biddingListing.quantity < 500;'
original_text = text.replace(bad_str, '')
with open('src/pages/buyer/BuyerMarketplace.jsx', 'w', encoding='utf-8') as f:
    f.write(original_text)
print('File recovered successfully!')

