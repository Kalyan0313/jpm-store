export const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'JPM Store REST API',
        version: '2.0.0',
        description:
            'Production-grade RESTful API backend for JPM Store e-commerce platform. Features JWT authentication, RBAC authorization, atomic inventory control, and Redis cache-aside caching.',
        contact: {
            name: 'Kalyan Mahato',
            url: 'https://kalyanbuilds.site/',
        },
    },
    servers: [
        {
            url: '/api/v1',
            description: 'API v1 Endpoint',
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter your JWT token in the format: Bearer <token>',
            },
        },
        schemas: {
            ErrorResponse: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'fail' },
                    message: { type: 'string', example: 'Resource not found' },
                },
            },
            HealthResponse: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'success' },
                    message: { type: 'string', example: 'JPM Store Node.js/Express API server is running healthy' },
                    services: {
                        type: 'object',
                        properties: {
                            database: { type: 'string', example: 'connected' },
                            redis: { type: 'string', example: 'connected' },
                        },
                    },
                    timestamp: { type: 'string', example: '2026-09-01T08:50:00.000Z' },
                    environment: { type: 'string', example: 'development' },
                },
            },
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '66d45e12f1234567890abcde' },
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john@example.com' },
                    role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },
            RegisterRequest: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', format: 'password', minLength: 6, example: 'Password123!' },
                },
            },
            LoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', format: 'password', example: 'Password123!' },
                },
            },
            AuthResponse: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'success' },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                    data: {
                        type: 'object',
                        properties: {
                            user: { $ref: '#/components/schemas/User' },
                        },
                    },
                },
            },
            Product: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '66d45e12f1234567890abcdf' },
                    title: { type: 'string', example: 'Samsung Galaxy Watch 6 Classic' },
                    slug: { type: 'string', example: 'samsung-galaxy-watch-6-classic' },
                    description: { type: 'string', example: 'Premium stainless steel smartwatch with rotating bezel.' },
                    price: { type: 'number', example: 349 },
                    discountPercentage: { type: 'number', example: 10 },
                    rating: { type: 'number', example: 4.8 },
                    stock: { type: 'number', example: 25 },
                    brand: { type: 'string', example: 'Samsung' },
                    category: { type: 'string', enum: ['smartwatches', 'earphones', 'laptops', 'mobiles'], example: 'smartwatches' },
                    thumbnail: { type: 'string', example: 'https://example.com/watch.jpg' },
                    images: { type: 'array', items: { type: 'string' } },
                    isFeatured: { type: 'boolean', example: true },
                },
            },
            CreateProductRequest: {
                type: 'object',
                required: ['title', 'description', 'price', 'category', 'brand', 'thumbnail'],
                properties: {
                    title: { type: 'string', example: 'Apple MacBook Pro M3' },
                    description: { type: 'string', example: 'Powerful Apple laptop with M3 chip.' },
                    price: { type: 'number', example: 1999 },
                    category: { type: 'string', enum: ['smartwatches', 'earphones', 'laptops', 'mobiles'], example: 'laptops' },
                    brand: { type: 'string', example: 'Apple' },
                    stock: { type: 'number', example: 20 },
                    thumbnail: { type: 'string', example: 'https://example.com/macbook.jpg' },
                },
            },
            OrderItem: {
                type: 'object',
                required: ['product', 'quantity'],
                properties: {
                    product: { type: 'string', example: '66d45e12f1234567890abcdf' },
                    quantity: { type: 'number', minimum: 1, example: 2 },
                },
            },
            ShippingAddress: {
                type: 'object',
                required: ['fullName', 'street', 'city', 'state', 'postalCode', 'phone'],
                properties: {
                    fullName: { type: 'string', example: 'John Doe' },
                    street: { type: 'string', example: '123 Market Street' },
                    city: { type: 'string', example: 'Bengaluru' },
                    state: { type: 'string', example: 'Karnataka' },
                    postalCode: { type: 'string', example: '560001' },
                    phone: { type: 'string', example: '+91 9876543210' },
                },
            },
            CreateOrderRequest: {
                type: 'object',
                required: ['orderItems', 'shippingAddress'],
                properties: {
                    orderItems: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/OrderItem' },
                    },
                    shippingAddress: { $ref: '#/components/schemas/ShippingAddress' },
                    paymentMethod: { type: 'string', enum: ['COD', 'Card', 'UPI', 'NetBanking'], example: 'COD' },
                },
            },
            Order: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '66d45e12f1234567890abce0' },
                    user: { type: 'string', example: '66d45e12f1234567890abcde' },
                    orderItems: { type: 'array', items: { type: 'object' } },
                    shippingAddress: { $ref: '#/components/schemas/ShippingAddress' },
                    paymentMethod: { type: 'string', example: 'COD' },
                    totalAmount: { type: 'number', example: 698 },
                    orderStatus: { type: 'string', enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], example: 'Processing' },
                    isPaid: { type: 'boolean', example: false },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },
        },
    },
    paths: {
        '/health': {
            get: {
                tags: ['System & Health'],
                summary: 'Service Health Check',
                description: 'Returns API server status, database connection state, and Redis caching state.',
                responses: {
                    200: {
                        description: 'System is healthy',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/HealthResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/auth/register': {
            post: {
                tags: ['Authentication'],
                summary: 'Register new user',
                description: 'Creates a new user account with hashed password and returns a JWT authentication token.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RegisterRequest' },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'User successfully created',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthResponse' },
                            },
                        },
                    },
                    400: {
                        description: 'Validation error or duplicate email',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/auth/login': {
            post: {
                tags: ['Authentication'],
                summary: 'User login',
                description: 'Authenticates user credentials and returns a JWT Bearer token and HttpOnly cookie.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LoginRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Successfully authenticated',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthResponse' },
                            },
                        },
                    },
                    401: {
                        description: 'Invalid email or password',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/auth/me': {
            get: {
                tags: ['Authentication'],
                summary: 'Get current authenticated user profile',
                security: [{ BearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Authenticated user profile data',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', example: 'success' },
                                        data: {
                                            type: 'object',
                                            properties: { user: { $ref: '#/components/schemas/User' } },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized (token missing or invalid)',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/products': {
            get: {
                tags: ['Products'],
                summary: 'List products with filtering, sorting, pagination & Redis caching',
                description: 'Fetches product catalog with support for category, brand, price filters, and pagination. Reads from Redis cache on hit.',
                parameters: [
                    { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Category slug (smartwatches, earphones, laptops, mobiles)' },
                    { name: 'minPrice', in: 'query', schema: { type: 'number' }, description: 'Minimum price filter' },
                    { name: 'maxPrice', in: 'query', schema: { type: 'number' }, description: 'Maximum price filter' },
                    { name: 'sort', in: 'query', schema: { type: 'string', enum: ['price-asc', 'price-desc', 'rating', 'discount'] }, description: 'Sort criteria' },
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 }, description: 'Results per page' },
                ],
                responses: {
                    200: {
                        description: 'Product list retrieved',
                        headers: {
                            'X-Cache': { schema: { type: 'string', enum: ['HIT', 'MISS'] }, description: 'Redis Cache Status' },
                        },
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', example: 'success' },
                                        results: { type: 'number', example: 10 },
                                        total: { type: 'number', example: 45 },
                                        page: { type: 'number', example: 1 },
                                        totalPages: { type: 'number', example: 5 },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                products: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Products'],
                summary: 'Create product (Admin only)',
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CreateProductRequest' },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Product created and Redis catalog cache invalidated',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', example: 'success' },
                                        data: { properties: { product: { $ref: '#/components/schemas/Product' } } },
                                    },
                                },
                            },
                        },
                    },
                    403: { description: 'Forbidden (Requires Admin role)' },
                },
            },
        },
        '/products/{id}': {
            get: {
                tags: ['Products'],
                summary: 'Get product by ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: {
                        description: 'Product details',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', example: 'success' },
                                        data: { properties: { product: { $ref: '#/components/schemas/Product' } } },
                                    },
                                },
                            },
                        },
                    },
                    404: { description: 'Product not found' },
                },
            },
            patch: {
                tags: ['Products'],
                summary: 'Update product by ID (Admin only)',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { type: 'object' },
                        },
                    },
                },
                responses: {
                    200: { description: 'Product updated and cache invalidated' },
                    403: { description: 'Forbidden' },
                    404: { description: 'Product not found' },
                },
            },
            delete: {
                tags: ['Products'],
                summary: 'Delete product by ID (Admin only)',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    204: { description: 'Product deleted' },
                    403: { description: 'Forbidden' },
                },
            },
        },
        '/products/search': {
            get: {
                tags: ['Products'],
                summary: 'Full-text product search',
                parameters: [
                    { name: 'q', in: 'query', required: true, schema: { type: 'string' }, description: 'Search term' },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
                ],
                responses: {
                    200: { description: 'Search results returned' },
                },
            },
        },
        '/orders': {
            post: {
                tags: ['Orders'],
                summary: 'Create new order with atomic inventory decrement',
                description: 'Creates order and performs atomic conditional stock updates on each item to prevent overselling.',
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CreateOrderRequest' },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Order created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', example: 'success' },
                                        data: { properties: { order: { $ref: '#/components/schemas/Order' } } },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Insufficient stock or invalid input',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                    401: { description: 'Unauthorized' },
                },
            },
        },
        '/orders/myorders': {
            get: {
                tags: ['Orders'],
                summary: 'Get logged in user order history',
                security: [{ BearerAuth: [] }],
                responses: {
                    200: {
                        description: 'List of user orders',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', example: 'success' },
                                        results: { type: 'number', example: 3 },
                                        data: { properties: { orders: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: 'Unauthorized' },
                },
            },
        },
    },
};
