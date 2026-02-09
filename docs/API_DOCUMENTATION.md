# API Documentation

### ConferenceOS REST API Reference

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Public Endpoints](#public-endpoints)
4. [Admin Endpoints](#admin-endpoints)
5. [Payment Endpoints](#payment-endpoints)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Examples](#examples)

---

## Overview

### Base URL

```
Development: http://localhost:3000/api
Production:  https://your-domain.com/api
```

### Request Format

All requests should use:
- **Content-Type**: `application/json` (for JSON data)
- **Content-Type**: `multipart/form-data` (for file uploads)

### Response Format

All responses return JSON:

```json
{
    "data": {},
    "error": null
}
```

Or in case of error:

```json
{
    "error": "Error message",
    "details": "Additional information"
}
```

---

## Authentication

### Admin Endpoints

Admin endpoints require Supabase authentication. Include the auth token in headers:

```http
Authorization: Bearer <supabase-jwt-token>
```

### Public Endpoints

No authentication required for public endpoints.

---

## Public Endpoints

### Registration

#### Register Attendee

```http
POST /api/register
```

**Request Body:**
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "org": "University Name",
    "role": "Professor",
    "dietary": "Vegetarian",
    "ticketType": "EARLY_BIRD",
    "attendanceMode": "IN_PERSON",
    "couponCode": "EARLY2026"
}
```

**Response:**
```json
{
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "ticketType": "EARLY_BIRD",
    "hasPaid": false,
    "paymentStatus": "PENDING",
    "createdAt": "2026-02-09T12:00:00Z"
}
```

**Status Codes:**
- `201`: Registration successful
- `400`: Invalid data
- `500`: Server error

---

### Paper Submission

#### Submit Paper

```http
POST /api/paper/submit
```

**Request Body (multipart/form-data):**
```
authorName: "Dr. Jane Smith"
coAttributes: "Dr. John Doe, Dr. Alice Brown"
email: "jane@university.edu"
whatsappNumber: "+1234567890"
country: "USA"
organization: "MIT"
title: "AI in Healthcare"
track: "Machine Learning"
file: <PDF file>
```

**Response:**
```json
{
    "id": 1,
    "authorName": "Dr. Jane Smith",
    "title": "AI in Healthcare",
    "status": "PENDING",
    "fileUrl": "https://storage.supabase.co/...",
    "createdAt": "2026-02-09T12:00:00Z"
}
```

**Status Codes:**
- `201`: Submission successful
- `400`: Invalid data or file
- `500`: Server error

---

#### Check Paper Status

```http
GET /api/paper/status?email=jane@university.edu
```

**Response:**
```json
[
    {
        "id": 1,
        "title": "AI in Healthcare",
        "status": "UNDER_REVIEW",
        "submittedAt": "2026-02-09T12:00:00Z",
        "reviews": [
            {
                "reviewerName": "Anonymous",
                "score": 8,
                "comments": "Excellent work"
            }
        ]
    }
]
```

---

### Contact & Inquiries

#### Submit Contact Form

```http
POST /api/contact
```

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "General Inquiry",
    "message": "I have a question about..."
}
```

**Response:**
```json
{
    "success": true,
    "message": "Message sent successfully"
}
```

---

#### Submit Conference Inquiry

```http
POST /api/inquiries
```

**Request Body:**
```json
{
    "fullName": "John Doe",
    "email": "john@example.com",
    "whatsappNumber": "+1234567890",
    "country": "USA"
}
```

**Response:**
```json
{
    "id": 1,
    "fullName": "John Doe",
    "createdAt": "2026-02-09T12:00:00Z"
}
```

---

### Newsletter

#### Subscribe to Newsletter

```http
POST /api/newsletter
```

**Request Body:**
```json
{
    "email": "john@example.com"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Subscribed successfully"
}
```

**Status Codes:**
- `201`: Subscription successful
- `409`: Email already subscribed
- `400`: Invalid email
- `500`: Server error

---

### Speakers

#### Get All Speakers

```http
GET /api/speakers
```

**Response:**
```json
[
    {
        "id": 1,
        "name": "Dr. John Smith",
        "role": "Chief AI Officer",
        "affiliation": "Tech Corp",
        "bio": "Expert in machine learning...",
        "photoUrl": "https://...",
        "type": "KEYNOTE",
        "displayOrder": 0
    }
]
```

---

### Important Dates

#### Get Important Dates

```http
GET /api/dates
```

**Response:**
```json
[
    {
        "id": 1,
        "event": "Paper Submission Deadline",
        "date": "2026-03-15T00:00:00Z",
        "note": "Extended deadline",
        "isActive": true,
        "order": 0
    }
]
```

---

### Awards

#### Submit Award Nomination

```http
POST /api/awards/nominations
```

**Request Body:**
```json
{
    "category": "Best Paper",
    "nomineeName": "Dr. Jane Smith",
    "affiliation": "MIT",
    "justification": "Outstanding research in..."
}
```

**Response:**
```json
{
    "id": 1,
    "category": "Best Paper",
    "nomineeName": "Dr. Jane Smith",
    "createdAt": "2026-02-09T12:00:00Z"
}
```

---

### Exit Feedback

#### Submit Exit Feedback

```http
POST /api/exit-feedback
```

**Request Body:**
```json
{
    "email": "john@example.com",
    "ticketType": "EARLY_BIRD",
    "abandonReason": "Too expensive",
    "additionalNotes": "Would consider if cheaper"
}
```

**Response:**
```json
{
    "success": true,
    "couponOffered": true,
    "couponCode": "COMEBACK20"
}
```

---

## Admin Endpoints

### Site Settings

#### Get All Settings

```http
GET /api/settings
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
[
    {
        "id": 1,
        "key": "shortName",
        "value": "WARS",
        "updatedAt": "2026-02-09T12:00:00Z"
    },
    {
        "id": 2,
        "key": "year",
        "value": "2026",
        "updatedAt": "2026-02-09T12:00:00Z"
    }
]
```

---

#### Update Settings

```http
PATCH /api/settings
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "shortName": "WARS",
    "year": "2026",
    "fullName": "World AI & Robotics Summit 2026",
    "location": "Singapore",
    "venue": "Marina Bay Sands",
    "tagline": "Bridging Intelligent Systems",
    "theme": "Neural Fusion '26",
    "whatsapp": "+65 1234 5678",
    "email": "info@conference.com"
}
```

**Response:**
```json
[
    {
        "id": 1,
        "key": "shortName",
        "value": "WARS",
        "updatedAt": "2026-02-09T12:00:00Z"
    }
]
```

---

### Speakers Management

#### Create Speaker

```http
POST /api/speakers
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
```
name: "Dr. John Smith"
role: "Chief AI Officer"
affiliation: "Tech Corp"
bio: "Expert in machine learning..."
type: "KEYNOTE"
file: <image file>
```

**Response:**
```json
{
    "id": 1,
    "name": "Dr. John Smith",
    "role": "Chief AI Officer",
    "photoUrl": "https://storage.supabase.co/...",
    "displayOrder": 0
}
```

---

#### Update Speaker

```http
PUT /api/speakers
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
```
id: "1"
name: "Dr. John Smith"
role: "Chief AI Officer"
affiliation: "Tech Corp"
bio: "Updated bio..."
type: "KEYNOTE"
file: <new image file> (optional)
```

**Response:**
```json
{
    "id": 1,
    "name": "Dr. John Smith",
    "role": "Chief AI Officer",
    "photoUrl": "https://storage.supabase.co/...",
    "displayOrder": 0
}
```

---

#### Delete Speaker

```http
DELETE /api/speakers?id=1
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
    "message": "Speaker deleted"
}
```

---

#### Reorder Speakers

```http
PATCH /api/speakers
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "orders": [
        { "id": 1, "displayOrder": 0 },
        { "id": 2, "displayOrder": 1 },
        { "id": 3, "displayOrder": 2 }
    ]
}
```

**Response:**
```json
{
    "success": true
}
```

---

### Committee Management

#### Create Committee Member

```http
POST /api/committee
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "Dr. Jane Doe",
    "role": "Program Chair",
    "photoUrl": "https://...",
    "displayOrder": 0
}
```

**Response:**
```json
{
    "id": 1,
    "name": "Dr. Jane Doe",
    "role": "Program Chair",
    "displayOrder": 0
}
```

---

#### Update Committee Member

```http
PATCH /api/committee?id=1
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "Dr. Jane Doe",
    "role": "Conference Chair",
    "displayOrder": 0
}
```

---

#### Delete Committee Member

```http
DELETE /api/committee?id=1
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
    "success": true
}
```

---

### Ticket Pricing

#### Get All Prices

```http
GET /api/prices
```

**Response:**
```json
[
    {
        "id": 1,
        "type": "EARLY_BIRD",
        "label": "Early Bird",
        "price": 299,
        "currency": "USD",
        "updatedAt": "2026-02-09T12:00:00Z"
    }
]
```

---

#### Update Price

```http
PATCH /api/prices?id=1
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "price": 349,
    "label": "Early Bird (Extended)"
}
```

**Response:**
```json
{
    "id": 1,
    "type": "EARLY_BIRD",
    "label": "Early Bird (Extended)",
    "price": 349,
    "currency": "USD"
}
```

---

### Important Dates Management

#### Create Important Date

```http
POST /api/dates
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "event": "Paper Submission Deadline",
    "date": "2026-03-15T23:59:59Z",
    "note": "Extended deadline",
    "order": 0,
    "isActive": true
}
```

**Response:**
```json
{
    "id": 1,
    "event": "Paper Submission Deadline",
    "date": "2026-03-15T23:59:59Z",
    "note": "Extended deadline",
    "order": 0,
    "isActive": true
}
```

---

#### Update Important Date

```http
PATCH /api/dates?id=1
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "date": "2026-03-20T23:59:59Z",
    "note": "Final extension"
}
```

---

#### Delete Important Date

```http
DELETE /api/dates?id=1
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
    "success": true
}
```

---

### Testimonials

#### Get All Testimonials

```http
GET /api/testimonials
```

**Response:**
```json
[
    {
        "id": 1,
        "name": "John Doe",
        "designation": "Professor, MIT",
        "message": "Excellent conference!",
        "photoUrl": "https://...",
        "rating": 5,
        "isActive": true,
        "order": 0
    }
]
```

---

#### Create Testimonial

```http
POST /api/testimonials
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "John Doe",
    "designation": "Professor, MIT",
    "message": "Excellent conference!",
    "photoUrl": "https://...",
    "rating": 5,
    "isActive": true,
    "order": 0
}
```

---

#### Update Testimonial

```http
PATCH /api/testimonials?id=1
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "message": "Updated testimonial text",
    "rating": 5
}
```

---

#### Delete Testimonial

```http
DELETE /api/testimonials?id=1
```

**Headers:**
```http
Authorization: Bearer <token>
```

---

### Coupons

#### Get All Coupons

```http
GET /api/coupons
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
[
    {
        "id": 1,
        "code": "EARLY2026",
        "discountType": "PERCENTAGE",
        "discountValue": 20,
        "maxUses": 100,
        "usedCount": 45,
        "validFrom": "2026-01-01T00:00:00Z",
        "validUntil": "2026-03-31T23:59:59Z",
        "isActive": true
    }
]
```

---

#### Validate Coupon

```http
POST /api/coupons/validate
```

**Request Body:**
```json
{
    "code": "EARLY2026",
    "ticketPrice": 299
}
```

**Response:**
```json
{
    "valid": true,
    "discountAmount": 59.8,
    "finalPrice": 239.2,
    "message": "Coupon applied successfully"
}
```

**Error Response:**
```json
{
    "valid": false,
    "message": "Coupon expired"
}
```

---

#### Create Coupon

```http
POST /api/coupons
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "code": "SUMMER2026",
    "discountType": "PERCENTAGE",
    "discountValue": 15,
    "maxUses": 50,
    "validFrom": "2026-06-01T00:00:00Z",
    "validUntil": "2026-08-31T23:59:59Z",
    "isActive": true
}
```

---

### Paper Reviews

#### Submit Review

```http
POST /api/paper/review
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "paperId": 1,
    "reviewerName": "Dr. Anonymous",
    "score": 8,
    "comments": "Excellent research methodology..."
}
```

**Response:**
```json
{
    "id": 1,
    "paperId": 1,
    "reviewerName": "Dr. Anonymous",
    "score": 8,
    "comments": "Excellent research methodology...",
    "createdAt": "2026-02-09T12:00:00Z"
}
```

---

## Payment Endpoints

### Razorpay Integration

#### Create Payment Order

```http
POST /api/razorpay/order
```

**Request Body:**
```json
{
    "amount": 29900,
    "currency": "INR",
    "attendeeId": 1
}
```

**Response:**
```json
{
    "orderId": "order_xxxxxxxxxxxxx",
    "amount": 29900,
    "currency": "INR",
    "key": "rzp_live_xxxxx"
}
```

---

#### Verify Payment

```http
POST /api/razorpay/verify
```

**Request Body:**
```json
{
    "razorpay_order_id": "order_xxxxxxxxxxxxx",
    "razorpay_payment_id": "pay_xxxxxxxxxxxxx",
    "razorpay_signature": "signature_string",
    "attendeeId": 1
}
```

**Response:**
```json
{
    "success": true,
    "message": "Payment verified successfully"
}
```

**Error Response:**
```json
{
    "success": false,
    "message": "Invalid signature"
}
```

---

#### Payment Feedback

```http
POST /api/razorpay/feedback
```

**Request Body:**
```json
{
    "attendeeId": 1,
    "status": "success",
    "paymentId": "pay_xxxxxxxxxxxxx",
    "orderId": "order_xxxxxxxxxxxxx"
}
```

**Response:**
```json
{
    "success": true,
    "attendee": {
        "id": 1,
        "hasPaid": true,
        "paymentStatus": "COMPLETED"
    }
}
```

---

## Error Handling

### Error Response Format

```json
{
    "error": "Error message",
    "details": "Additional information",
    "code": "ERROR_CODE"
}
```

### Common Error Codes

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid auth token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate entry |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

### Error Examples

**Validation Error:**
```json
{
    "error": "Validation failed",
    "details": {
        "email": "Invalid email format",
        "name": "Name is required"
    }
}
```

**Authentication Error:**
```json
{
    "error": "Unauthorized",
    "message": "Invalid or expired token"
}
```

**Not Found Error:**
```json
{
    "error": "Resource not found",
    "message": "Speaker with ID 999 does not exist"
}
```

---

## Rate Limiting

### Limits

- **Public endpoints**: 100 requests per 15 minutes per IP
- **Authenticated endpoints**: 1000 requests per 15 minutes per user
- **Payment endpoints**: 10 requests per minute per IP

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1612345678
```

### Rate Limit Exceeded Response

```json
{
    "error": "Rate limit exceeded",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 900
}
```

---

## Examples

### Complete Registration Flow

```javascript
// 1. Register attendee
const registerResponse = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        ticketType: 'EARLY_BIRD',
        attendanceMode: 'IN_PERSON'
    })
});

const attendee = await registerResponse.json();

// 2. Create payment order
const orderResponse = await fetch('/api/razorpay/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        amount: 29900,
        currency: 'INR',
        attendeeId: attendee.id
    })
});

const order = await orderResponse.json();

// 3. Initialize Razorpay checkout
const options = {
    key: order.key,
    amount: order.amount,
    currency: order.currency,
    order_id: order.orderId,
    handler: async function(response) {
        // 4. Verify payment
        const verifyResponse = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                attendeeId: attendee.id
            })
        });

        const result = await verifyResponse.json();
        if (result.success) {
            alert('Registration successful!');
        }
    }
};

const rzp = new Razorpay(options);
rzp.open();
```

---

### Paper Submission with File Upload

```javascript
const formData = new FormData();
formData.append('authorName', 'Dr. Jane Smith');
formData.append('email', 'jane@university.edu');
formData.append('title', 'AI in Healthcare');
formData.append('track', 'Machine Learning');
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/paper/submit', {
    method: 'POST',
    body: formData
});

const result = await response.json();
console.log('Paper submitted:', result);
```

---

### Admin: Update Site Settings

```javascript
const token = 'your-supabase-jwt-token';

const response = await fetch('/api/settings', {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        shortName: 'WARS',
        year: '2026',
        location: 'Singapore',
        venue: 'Marina Bay Sands'
    })
});

const settings = await response.json();
console.log('Settings updated:', settings);
```

---

### Validate Coupon Before Payment

```javascript
const response = await fetch('/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        code: 'EARLY2026',
        ticketPrice: 299
    })
});

const result = await response.json();

if (result.valid) {
    console.log('Discount:', result.discountAmount);
    console.log('Final price:', result.finalPrice);
} else {
    console.log('Invalid coupon:', result.message);
}
```

---

## Webhooks

### Razorpay Webhook

```http
POST /api/razorpay/webhook
```

**Headers:**
```http
X-Razorpay-Signature: <signature>
Content-Type: application/json
```

**Payload:**
```json
{
    "event": "payment.captured",
    "payload": {
        "payment": {
            "entity": {
                "id": "pay_xxxxxxxxxxxxx",
                "amount": 29900,
                "currency": "INR",
                "status": "captured",
                "order_id": "order_xxxxxxxxxxxxx"
            }
        }
    }
}
```

---

## Postman Collection

Import this collection for easy API testing:

```json
{
    "info": {
        "name": "ConferenceOS API",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "Public",
            "item": [
                {
                    "name": "Register Attendee",
                    "request": {
                        "method": "POST",
                        "url": "{{baseUrl}}/api/register",
                        "body": {
                            "mode": "raw",
                            "raw": "{\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"email\": \"john@example.com\",\n  \"ticketType\": \"EARLY_BIRD\"\n}"
                        }
                    }
                }
            ]
        }
    ]
}
```

---

## Support

For API support:
- **Email**: api-support@conference.com
- **Documentation**: https://docs.conference.com
- **Status Page**: https://status.conference.com

---

**Last Updated**: February 2026  
**API Version**: 1.0.0
