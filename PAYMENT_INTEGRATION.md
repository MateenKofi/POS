# Payment Integration with Backend API

This document describes the payment integration system that has been added to the POS application.

## Features Added

### 1. **API Integration with TanStack Query**
- Real-time product data from backend
- Automatic sale creation via API
- Proper error handling and loading states
- Query invalidation for real-time updates

### 2. **Enhanced Payment Processing**
- Multiple payment methods (Cash, Credit Card, Debit Card, Mobile Payment)
- Cash handling with automatic change calculation
- Reference/transaction ID for card payments
- Professional receipt generation

### 3. **Authentication System**
- JWT token-based authentication
- Automatic token management
- Role-based access control
- Secure API communication

## API Endpoints Used

### Products
- `GET /api/products` - Fetch all products
- `GET /api/products/search?q=query` - Search products

### Sales
- `POST /api/sales` - Create new sale transaction

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

## How It Works

### 1. **Product Loading**
- Products are fetched from the backend API on component mount
- Real-time search filtering on product name and description
- Stock quantity display for inventory management

### 2. **Payment Flow**
1. User adds products to cart
2. Clicks "Proceed to Payment"
3. Selects payment method
4. Enters payment details (cash amount or reference)
5. Payment is processed via API
6. Sale is created in backend
7. Receipt is generated and displayed

### 3. **Sale Creation**
- Sale data is sent to backend in the format:
```json
{
  "payment_method_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price_at_sale": 19.99
    }
  ]
}
```

## Payment Methods

| ID | Method | Description |
|----|--------|-------------|
| 1 | Cash | Cash payment with change calculation |
| 2 | Credit Card | Credit card payment |
| 3 | Debit Card | Debit card payment |
| 4 | Mobile Payment | Mobile wallet payment |

## Setup Requirements

### Backend API
- Must be running on `http://localhost:3007`
- Must have the endpoints documented in `API_ENDPOINTS.md`
- Must support JWT authentication

### Environment
- Node.js 18+ and pnpm
- All dependencies installed (`@tanstack/react-query`, `react-hook-form`)

## Usage

### Starting the Application
```bash
pnpm dev
```

### Login
1. Use valid credentials from your backend
2. Authentication token is automatically managed
3. Role-based access control is enforced

### Making a Sale
1. Select products from the product grid
2. Adjust quantities in the cart
3. Click "Proceed to Payment"
4. Choose payment method
5. Complete the transaction
6. View and print receipt

## Error Handling

- **Network Errors**: Automatic retry with user-friendly messages
- **Authentication Errors**: Automatic logout and redirect to login
- **Validation Errors**: Form validation with clear error messages
- **API Errors**: Graceful fallback with retry options

## Security Features

- JWT tokens stored securely in localStorage
- Automatic token refresh and validation
- Role-based access control
- Secure API communication with proper headers

## Customization

### Adding New Payment Methods
1. Update `PAYMENT_METHODS` in `src/hooks/useApi.ts`
2. Add corresponding backend payment method records
3. Update payment processing logic if needed

### Modifying Receipt Format
1. Edit the receipt dialog in `src/components/sales-interface.tsx`
2. Customize styling and information display
3. Add additional fields as needed

### API Endpoint Changes
1. Update `src/lib/api.ts` with new endpoints
2. Modify corresponding hooks in `src/hooks/useApi.ts`
3. Update component logic to use new data structures

## Troubleshooting

### Common Issues

1. **Products Not Loading**
   - Check if backend API is running
   - Verify API endpoint `/api/products` is accessible
   - Check browser console for error messages

2. **Authentication Fails**
   - Verify backend authentication endpoint
   - Check JWT token format and expiration
   - Ensure proper CORS configuration

3. **Sale Creation Fails**
   - Verify sale endpoint is accessible
   - Check request payload format
   - Ensure user has proper permissions

### Debug Mode
- Check browser console for detailed error messages
- Use browser dev tools to inspect API requests
- Verify network tab for failed requests

## Future Enhancements

- Receipt printing functionality
- Payment gateway integration
- Offline mode support
- Advanced reporting and analytics
- Multi-currency support
- Customer management integration
