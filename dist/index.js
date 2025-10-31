// ============================================
// BOOKSTORE MCP SERVER - TYPESCRIPT
// ============================================
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
// ============================================
// IN-MEMORY DATABASE
// ============================================
const books = [
    {
        id: "book001",
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "technology",
        price: 450000,
        originalPrice: 500000,
        stock: 25,
        isbn: "9780132350884",
        publisher: "Prentice Hall",
        publishYear: 2008,
        pages: 464,
        language: "English",
        description: "A handbook of agile software craftsmanship",
        rating: 4.7,
        reviewCount: 152,
        imageUrl: "https://example.com/clean-code.jpg"
    },
    {
        id: "book002",
        title: "Sapiens: Lược Sử Loài Người",
        author: "Yuval Noah Harari",
        category: "history",
        price: 280000,
        originalPrice: 320000,
        stock: 45,
        isbn: "9780062316097",
        publisher: "Harper",
        publishYear: 2015,
        pages: 443,
        language: "Vietnamese",
        description: "Từ khi Homo sapiens lần đầu tiên bước chân lên mặt đất cho đến nay",
        rating: 4.8,
        reviewCount: 324,
        imageUrl: "https://example.com/sapiens.jpg"
    },
    {
        id: "book003",
        title: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        category: "business",
        price: 95000,
        originalPrice: 120000,
        stock: 100,
        isbn: "9780671027032",
        publisher: "Pocket Books",
        publishYear: 1936,
        pages: 288,
        language: "Vietnamese",
        description: "Nghệ thuật thu phục lòng người",
        rating: 4.5,
        reviewCount: 892,
        imageUrl: "https://example.com/dacnhantam.jpg"
    },
    {
        id: "book004",
        title: "Nhà Giả Kim",
        author: "Paulo Coelho",
        category: "fiction",
        price: 79000,
        originalPrice: 95000,
        stock: 67,
        isbn: "9780062315007",
        publisher: "HarperOne",
        publishYear: 1988,
        pages: 208,
        language: "Vietnamese",
        description: "Câu chuyện về chàng chăn cừu tìm kiếm kho báu",
        rating: 4.6,
        reviewCount: 445,
        imageUrl: "https://example.com/nhagiakim.jpg"
    },
    {
        id: "book005",
        title: "Atomic Habits",
        author: "James Clear",
        category: "business",
        price: 220000,
        originalPrice: 250000,
        stock: 33,
        isbn: "9780735211292",
        publisher: "Avery",
        publishYear: 2018,
        pages: 320,
        language: "Vietnamese",
        description: "Thay đổi tí hon, hiệu quả bất ngờ",
        rating: 4.9,
        reviewCount: 678,
        imageUrl: "https://example.com/atomic-habits.jpg"
    }
];
const orders = [];
const reviews = [
    {
        id: "review001",
        bookId: "book001",
        customerId: "customer001",
        customerName: "Nguyễn Văn A",
        rating: 5,
        reviewText: "Cuốn sách tuyệt vời cho lập trình viên! Rất thiết thực.",
        createdAt: "2024-10-15T10:30:00Z",
        helpful: 23
    },
    {
        id: "review002",
        bookId: "book002",
        customerId: "customer002",
        customerName: "Trần Thị B",
        rating: 5,
        reviewText: "Góc nhìn thú vị về lịch sử loài người. Đáng đọc!",
        createdAt: "2024-10-20T14:20:00Z",
        helpful: 45
    }
];
const promotions = [
    {
        id: "promo001",
        name: "Giảm giá mùa đông",
        description: "Giảm 15% cho tất cả sách công nghệ",
        discountPercent: 15,
        category: "technology",
        startDate: "2024-10-01",
        endDate: "2024-12-31",
        active: true
    },
    {
        id: "promo002",
        name: "Flash Sale Cuối Tuần",
        description: "Giảm 20% cho đơn hàng trên 500k",
        discountPercent: 20,
        minPurchase: 500000,
        startDate: "2024-10-26",
        endDate: "2024-10-27",
        active: true
    }
];
const discountCodes = new Map([
    ["WELCOME2024", { discount: 50000, minPurchase: 200000, usesLeft: 100 }],
    ["BOOK20", { discountPercent: 20, minPurchase: 300000, usesLeft: 50 }],
    ["FREESHIP", { freeShipping: true, minPurchase: 150000, usesLeft: 200 }]
]);
// ============================================
// HELPER FUNCTIONS
// ============================================
function generateOrderId() {
    return `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
}
function calculateShipping(city, weight, method) {
    let baseFee = 30000;
    // Phí theo thành phố
    const cityRates = {
        "Hà Nội": 1.0,
        "Hồ Chí Minh": 1.0,
        "Đà Nẵng": 1.2,
        "Hải Phòng": 1.1,
        "Cần Thơ": 1.3
    };
    const cityMultiplier = cityRates[city] || 1.5;
    // Phí theo trọng lượng
    const weightFee = Math.ceil(weight / 0.5) * 5000;
    // Phí theo phương thức
    const methodMultiplier = {
        standard: { mult: 1.0, days: "3-5 ngày" },
        fast: { mult: 1.5, days: "1-2 ngày" },
        express: { mult: 2.5, days: "Trong ngày" }
    };
    const methodData = methodMultiplier[method] || methodMultiplier.standard;
    const totalFee = Math.round((baseFee + weightFee) * cityMultiplier * methodData.mult);
    return { fee: totalFee, days: methodData.days };
}
function applyDiscount(code, cartTotal) {
    const discountInfo = discountCodes.get(code);
    if (!discountInfo) {
        return { valid: false, discount: 0, message: "Mã giảm giá không hợp lệ" };
    }
    if (discountInfo.usesLeft <= 0) {
        return { valid: false, discount: 0, message: "Mã giảm giá đã hết lượt sử dụng" };
    }
    if (discountInfo.minPurchase && cartTotal < discountInfo.minPurchase) {
        return {
            valid: false,
            discount: 0,
            message: `Đơn hàng tối thiểu ${discountInfo.minPurchase.toLocaleString('vi-VN')}đ`
        };
    }
    let discount = 0;
    if (discountInfo.discount) {
        discount = discountInfo.discount;
    }
    else if (discountInfo.discountPercent) {
        discount = Math.round(cartTotal * discountInfo.discountPercent / 100);
    }
    return {
        valid: true,
        discount,
        message: `Giảm ${discount.toLocaleString('vi-VN')}đ`
    };
}
// ============================================
// MCP SERVER
// ============================================
const server = new Server({
    name: "bookstore-mcp-server",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// ============================================
// TOOL HANDLERS
// ============================================
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "search_books",
                description: "Tìm kiếm sách theo tên, tác giả, thể loại, giá",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "Từ khóa tìm kiếm" },
                        category: { type: "string", description: "Thể loại sách" },
                        minPrice: { type: "number", description: "Giá tối thiểu" },
                        maxPrice: { type: "number", description: "Giá tối đa" },
                        inStockOnly: { type: "boolean", description: "Chỉ sách còn hàng" }
                    }
                }
            },
            {
                name: "get_book_details",
                description: "Lấy thông tin chi tiết của một cuốn sách",
                inputSchema: {
                    type: "object",
                    properties: {
                        bookId: { type: "string", description: "ID của sách" }
                    },
                    required: ["bookId"]
                }
            },
            {
                name: "check_inventory",
                description: "Kiểm tra tồn kho của sách",
                inputSchema: {
                    type: "object",
                    properties: {
                        bookIds: {
                            type: "array",
                            items: { type: "string" },
                            description: "Danh sách ID sách cần kiểm tra"
                        }
                    },
                    required: ["bookIds"]
                }
            },
            {
                name: "create_order",
                description: "Tạo đơn hàng mới",
                inputSchema: {
                    type: "object",
                    properties: {
                        customerInfo: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                email: { type: "string" },
                                phone: { type: "string" },
                                address: { type: "string" },
                                city: { type: "string" },
                                district: { type: "string" }
                            },
                            required: ["name", "phone", "address", "city"]
                        },
                        items: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    bookId: { type: "string" },
                                    quantity: { type: "number" }
                                }
                            }
                        },
                        discountCode: { type: "string" },
                        paymentMethod: { type: "string" },
                        shippingMethod: { type: "string" },
                        notes: { type: "string" }
                    },
                    required: ["customerInfo", "items", "paymentMethod"]
                }
            },
            {
                name: "get_order_status",
                description: "Kiểm tra trạng thái đơn hàng",
                inputSchema: {
                    type: "object",
                    properties: {
                        orderId: { type: "string", description: "Mã đơn hàng" },
                        phone: { type: "string", description: "Số điện thoại đặt hàng" }
                    }
                }
            },
            {
                name: "get_bestsellers",
                description: "Lấy danh sách sách bán chạy",
                inputSchema: {
                    type: "object",
                    properties: {
                        period: {
                            type: "string",
                            enum: ["week", "month", "year"],
                            description: "Khoảng thời gian"
                        },
                        category: { type: "string", description: "Thể loại" },
                        limit: { type: "number", description: "Số lượng sách", default: 10 }
                    }
                }
            },
            {
                name: "get_recommendations",
                description: "Gợi ý sách dựa trên sở thích",
                inputSchema: {
                    type: "object",
                    properties: {
                        basedOnBookId: { type: "string", description: "Dựa trên sách này" },
                        categories: {
                            type: "array",
                            items: { type: "string" },
                            description: "Thể loại quan tâm"
                        },
                        limit: { type: "number", default: 5 }
                    }
                }
            },
            {
                name: "apply_discount_code",
                description: "Áp dụng mã giảm giá",
                inputSchema: {
                    type: "object",
                    properties: {
                        discountCode: { type: "string", description: "Mã giảm giá" },
                        cartTotal: { type: "number", description: "Tổng giá trị giỏ hàng" }
                    },
                    required: ["discountCode", "cartTotal"]
                }
            },
            {
                name: "get_reviews",
                description: "Lấy đánh giá của sách",
                inputSchema: {
                    type: "object",
                    properties: {
                        bookId: { type: "string", description: "ID sách" },
                        sortBy: {
                            type: "string",
                            enum: ["recent", "helpful", "rating_high"],
                            default: "recent"
                        },
                        limit: { type: "number", default: 10 }
                    },
                    required: ["bookId"]
                }
            },
            {
                name: "add_review",
                description: "Thêm đánh giá cho sách",
                inputSchema: {
                    type: "object",
                    properties: {
                        bookId: { type: "string" },
                        customerId: { type: "string" },
                        customerName: { type: "string" },
                        rating: { type: "number", minimum: 1, maximum: 5 },
                        reviewText: { type: "string" }
                    },
                    required: ["bookId", "customerId", "customerName", "rating", "reviewText"]
                }
            },
            {
                name: "get_promotions",
                description: "Lấy danh sách khuyến mãi đang diễn ra",
                inputSchema: {
                    type: "object",
                    properties: {
                        activeOnly: { type: "boolean", default: true },
                        category: { type: "string" }
                    }
                }
            },
            {
                name: "calculate_shipping",
                description: "Tính phí vận chuyển",
                inputSchema: {
                    type: "object",
                    properties: {
                        city: { type: "string", description: "Thành phố/Tỉnh" },
                        weight: { type: "number", description: "Trọng lượng (kg)" },
                        shippingMethod: {
                            type: "string",
                            enum: ["standard", "fast", "express"],
                            default: "standard"
                        }
                    },
                    required: ["city", "weight"]
                }
            }
        ]
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name } = request.params;
    const args = request.params.arguments ?? {};
    try {
        switch (name) {
            case "search_books": {
                let results = books.filter(book => {
                    if (args.inStockOnly && book.stock <= 0)
                        return false;
                    if (args.category && book.category !== args.category)
                        return false;
                    if (args.minPrice && book.price < args.minPrice)
                        return false;
                    if (args.maxPrice && book.price > args.maxPrice)
                        return false;
                    if (args.query) {
                        const query = args.query.toLowerCase();
                        return book.title.toLowerCase().includes(query) ||
                            book.author.toLowerCase().includes(query);
                    }
                    return true;
                });
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                success: true,
                                count: results.length,
                                books: results
                            }, null, 2)
                        }]
                };
            }
            case "get_book_details": {
                const book = books.find(b => b.id === args.bookId);
                if (!book) {
                    return {
                        content: [{
                                type: "text",
                                text: JSON.stringify({ success: false, error: "Không tìm thấy sách" })
                            }]
                    };
                }
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({ success: true, book }, null, 2)
                        }]
                };
            }
            case "check_inventory": {
                const inventory = args.bookIds.map((id) => {
                    const book = books.find(b => b.id === id);
                    return book ? {
                        bookId: id,
                        title: book.title,
                        stock: book.stock,
                        available: book.stock > 0
                    } : {
                        bookId: id,
                        error: "Không tìm thấy sách"
                    };
                });
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({ success: true, inventory }, null, 2)
                        }]
                };
            }
            case "create_order": {
                // Validate items
                let total = 0;
                let totalWeight = 0;
                const orderItems = [];
                for (const item of args.items) {
                    const book = books.find(b => b.id === item.bookId);
                    if (!book) {
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        success: false,
                                        error: `Không tìm thấy sách ${item.bookId}`
                                    })
                                }]
                        };
                    }
                    if (book.stock < item.quantity) {
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        success: false,
                                        error: `${book.title} không đủ hàng (còn ${book.stock})`
                                    })
                                }]
                        };
                    }
                    const itemTotal = book.price * item.quantity;
                    total += itemTotal;
                    totalWeight += 0.5 * item.quantity; // Giả sử mỗi sách 0.5kg
                    orderItems.push({
                        bookId: book.id,
                        title: book.title,
                        quantity: item.quantity,
                        price: book.price,
                        subtotal: itemTotal
                    });
                    // Update stock
                    book.stock -= item.quantity;
                }
                // Apply discount
                let discount = 0;
                if (args.discountCode) {
                    const discountResult = applyDiscount(args.discountCode, total);
                    if (discountResult.valid) {
                        discount = discountResult.discount;
                        const code = discountCodes.get(args.discountCode);
                        if (code)
                            code.usesLeft--;
                    }
                }
                // Calculate shipping
                const shipping = calculateShipping(args.customerInfo.city, totalWeight, args.shippingMethod || "standard");
                const finalTotal = total - discount + shipping.fee;
                const order = {
                    orderId: generateOrderId(),
                    customerInfo: args.customerInfo,
                    items: orderItems,
                    total: finalTotal,
                    shippingFee: shipping.fee,
                    discount,
                    status: "pending",
                    paymentMethod: args.paymentMethod,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    notes: args.notes
                };
                orders.push(order);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                success: true,
                                message: "Đặt hàng thành công!",
                                order: {
                                    orderId: order.orderId,
                                    items: orderItems,
                                    subtotal: total,
                                    discount,
                                    shippingFee: shipping.fee,
                                    total: finalTotal,
                                    estimatedDelivery: shipping.days,
                                    paymentMethod: order.paymentMethod,
                                    status: order.status
                                }
                            }, null, 2)
                        }]
                };
            }
            case "get_order_status": {
                let order;
                if (args.orderId) {
                    order = orders.find(o => o.orderId === args.orderId);
                }
                else if (args.phone) {
                    order = orders.find(o => o.customerInfo.phone === args.phone);
                }
                if (!order) {
                    return {
                        content: [{
                                type: "text",
                                text: JSON.stringify({
                                    success: false,
                                    error: "Không tìm thấy đơn hàng"
                                })
                            }]
                    };
                }
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({ success: true, order }, null, 2)
                        }]
                };
            }
            case "get_bestsellers": {
                const limit = args.limit || 10;
                let filtered = books;
                if (args.category) {
                    filtered = books.filter(b => b.category === args.category);
                }
                // Sort by review count and rating
                const bestsellers = filtered
                    .sort((a, b) => {
                    const scoreA = a.reviewCount * a.rating;
                    const scoreB = b.reviewCount * b.rating;
                    return scoreB - scoreA;
                })
                    .slice(0, limit)
                    .map((book, index) => ({
                    rank: index + 1,
                    ...book,
                    popularityScore: Math.round(book.reviewCount * book.rating)
                }));
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                success: true,
                                period: args.period || "month",
                                category: args.category || "all",
                                bestsellers
                            }, null, 2)
                        }]
                };
            }
            case "get_recommendations": {
                const limit = args.limit || 5;
                let recommendations = [];
                if (args.basedOnBookId) {
                    const baseBook = books.find(b => b.id === args.basedOnBookId);
                    if (baseBook) {
                        // Recommend same category
                        recommendations = books
                            .filter(b => b.id !== args.basedOnBookId && b.category === baseBook.category)
                            .sort((a, b) => b.rating - a.rating)
                            .slice(0, limit);
                    }
                }
                else if (args.categories && args.categories.length > 0) {
                    recommendations = books
                        .filter(b => args.categories.includes(b.category))
                        .sort((a, b) => b.rating - a.rating)
                        .slice(0, limit);
                }
                else {
                    // Top rated books
                    recommendations = books
                        .sort((a, b) => b.rating - a.rating)
                        .slice(0, limit);
                }
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                success: true,
                                recommendations
                            }, null, 2)
                        }]
                };
            }
            case "apply_discount_code": {
                const result = applyDiscount(args.discountCode, args.cartTotal);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                success: result.valid,
                                discount: result.discount,
                                message: result.message,
                                finalTotal: result.valid ? args.cartTotal - result.discount : args.cartTotal
                            }, null, 2)
                        }]
                };
            }
            case "get_reviews": {
                const limit = args.limit || 10;
                let bookReviews = reviews.filter(r => r.bookId === args.bookId);
                // Sort reviews
                if (args.sortBy === "helpful") {
                    bookReviews.sort((a, b) => b.helpful - a.helpful);
                }
                else if (args.sortBy === "rating_high") {
                    bookReviews.sort((a, b) => b.rating - a.rating);
                }
                else {
                    bookReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                }
                const book = books.find(b => b.id === args.bookId);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                success: true,
                                bookTitle: book?.title,
                                averageRating: book?.rating,
                                totalReviews: book?.reviewCount,
                                reviews: bookReviews.slice(0, limit)
                            }, null, 2)
                        }]
                };
            }
            case "add_review": {
                const book = books.find(b => b.id === args.bookId);
                if (!book) {
                    return {
                        content: [{
                                type: "text",
                                text: JSON.stringify({
                                    success: false,
                                    error: "Không tìm thấy sách"
                                })
                            }]
                    };
                }
                const newReview = {
                    id: `review${reviews.length + 1}`.padStart(9, '0'),
                    bookId: args.bookId,
                    customerId: args.customerId,
                    customerName: args.customerName,
                    rating: args.rating,
                    reviewText: args.reviewText,
                    createdAt: new Date().toISOString(),
                    helpful: 0
                };
                reviews.push(newReview);
                // Update book rating
                const bookReviews = reviews.filter(r => r.bookId === args.bookId);
                const avgRating = bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length;
                book.rating = Math.round(avgRating * 10) / 10;
                book.reviewCount = bookReviews.length;
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                success: true,
                                message: "Đánh giá của bạn đã được thêm!",
                                review: newReview,
                                newBookRating: book.rating
                            }, null, 2)
                        }]
                };
            }
            case "get_promotions": {
                let results = promotions;
                if (args.activeOnly) {
                    const today = new Date().toISOString().split('T')[0];
                    results = promotions.filter(p => p.active &&
                        p.startDate <= today &&
                        p.endDate >= today);
                }
                if (args.category) {
                    results = results.filter(p => !p.category || p.category === args.category);
                }
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                success: true,
                                promotions: results
                            }, null, 2)
                        }]
                };
            }
            case "calculate_shipping": {
                const result = calculateShipping(args.city, args.weight, args.shippingMethod || "standard");
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                success: true,
                                city: args.city,
                                weight: args.weight,
                                method: args.shippingMethod || "standard",
                                fee: result.fee,
                                estimatedDelivery: result.days
                            }, null, 2)
                        }]
                };
            }
            default:
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                success: false,
                                error: `Unknown tool: ${name}`
                            })
                        }]
                };
        }
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        success: false,
                        error: error instanceof Error ? error.message : String(error)
                    })
                }],
            isError: true
        };
    }
});
// ============================================
// START SERVER
// ============================================
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Bookstore MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
