# BÁO CÁO PHÂN TÍCH FRACTAL MCP SDK

## 1. TỔNG QUAN

Fractal MCP SDK là bộ công cụ toàn diện để xây dựng ứng dụng tương thích với OpenAI Apps SDK. SDK này cho phép tạo các widget tương tác chạy trực tiếp trong ChatGPT sử dụng Model Context Protocol (MCP).

### 1.1. Mục Đích Chính

- Xây dựng MCP server với giao diện widget tùy chỉnh
- Tạo UI component sử dụng React hooks
- Đóng gói và triển khai widget cho production
- Cung cấp giải pháp production-ready trong khi OpenAI SDK chính thức đang phát triển

### 1.2. Kiến Trúc Hệ Sinh Thái

```
┌─────────────────────────────────────────────┐
│           ChatGPT Interface                 │
│  (Hiển thị widget và tương tác người dùng) │
└────────────────┬────────────────────────────┘
                 │
                 ↓ MCP Protocol
┌─────────────────────────────────────────────┐
│         @fractal-mcp/oai-server            │
│  (Xử lý request, trả về structured data)   │
└────────────────┬────────────────────────────┘
                 │
                 ↓ Serve HTML
┌─────────────────────────────────────────────┐
│      Bundled Widget HTML (từ CLI/bundle)   │
│  (Chứa React component + oai-hooks)        │
└─────────────────────────────────────────────┘
```

## 2. CÁC PACKAGE CHÍNH

### 2.1. @fractal-mcp/oai-hooks

**Mục đích:** React hooks để xây dựng widget UI tương tác với ChatGPT

**Tính năng:**

- `useWidgetProps`: Truy cập props từ server
- `useWidgetState`: Quản lý state bền vững của widget
- Phản hồi thay đổi layout (display mode, max height)
- Truy cập context toàn cục ChatGPT (theme, safe area)

**Use Case:** Tạo UI component phản ứng với dữ liệu từ ChatGPT

### 2.2. @fractal-mcp/oai-server

**Mục đích:** Server-side toolkit để xây dựng MCP server với custom widget

**Tính năng:**

- Đăng ký tools với custom UI widgets
- Serve widget HTML và assets qua MCP resources
- Xử lý SSE transport cho real-time communication
- Type-safe input validation với Zod schema

**Use Case:** Backend xử lý logic và trả dữ liệu cho widget

### 2.3. @fractal-mcp/bundle & @fractal-mcp/cli

**Mục đích:** Đóng gói React components thành standalone HTML

**Tính năng:**

- Bundle React components vào HTML files
- Multiple output formats (full HTML, snippets, separate assets)
- Framework-agnostic (React, Vue, Svelte)
- Powered by Vite (build nhanh)
- Built-in testing với Playwright

**Use Case:** Chuyển đổi source code thành file HTML deploy được

### 2.4. @fractal-mcp/mcp-express

**Mục đích:** Express utilities để serve MCP servers

**Tính năng:**

- Tích hợp với Express server
- Kết nối với Fractal registry

**Use Case:** Triển khai production với Express framework

## 3. WORKFLOW PHÁT TRIỂN

### 3.1. Quy Trình Hoàn Chỉnh

```
1. DEVELOP WIDGET UI (React)
   └─> File: ui/MyWidget.tsx
   └─> Sử dụng: @fractal-mcp/oai-hooks

2. BUNDLE WIDGET
   └─> Command: npx @fractal-mcp/cli bundle
   └─> Output: dist/index.html

3. CREATE MCP SERVER
   └─> File: server/index.ts
   └─> Đọc: dist/index.html
   └─> Đăng ký widget với registerOpenAIWidget()
   └─> Sử dụng: @fractal-mcp/oai-server

4. START SERVER
   └─> Command: node dist/server/index.js
   └─> Server chạy tại: http://localhost:8000

5. CONNECT TO CHATGPT
   └─> ChatGPT kết nối tới MCP server
   └─> Người dùng invoke tool → Widget hiển thị
```

### 3.2. Luồng Dữ Liệu Runtime

```
User → ChatGPT → Tool Invocation
                      ↓
                 MCP Server Handler
                      ↓
              Returns { content, structuredContent }
                      ↓
         ChatGPT renders widget HTML
                      ↓
    Widget UI receives props via useWidgetProps()
                      ↓
              User interacts with widget
                      ↓
         State persists via useWidgetState()
```

## 4. PHÂN TÍCH ƯU ĐIỂM

### 4.1. Điểm Mạnh

1. **Type Safety**: Sử dụng TypeScript và Zod validation
2. **Developer Experience**: React hooks quen thuộc
3. **Production Ready**: Đầy đủ công cụ từ dev đến deploy
4. **Framework Agnostic**: Hỗ trợ React, Vue, Svelte
5. **Real-time**: SSE transport cho communication tức thời
6. **Modular**: Các package độc lập, cài đặt theo nhu cầu

### 4.2. Tính Năng Nổi Bật

- **State Management**: Widget state tự động persist
- **Theme Integration**: Tự động adapt với ChatGPT theme
- **Layout Responsive**: Tự động điều chỉnh theo display mode
- **Easy Bundling**: Single command để bundle toàn bộ

## 5. USE CASES THỰC TẾ

### 5.1. Weather Widget

- Hiển thị thời tiết theo location
- Real-time updates
- Interactive UI với temperature unit toggle

### 5.2. Data Visualization

- Charts và graphs trong ChatGPT
- Interactive data exploration
- Export capabilities

### 5.3. Form & Input

- Thu thập input phức tạp từ user
- Multi-step wizards
- Validation và feedback

### 5.4. Media Players

- Audio/video playback
- Playlist management
- Streaming content

### 5.5. Productivity Tools

- Todo lists với persistence
- Calendar integrations
- Note-taking widgets

## 6. KẾT LUẬN & KHUYẾN NGHỊ

### 6.1. Đánh Giá Chung

Fractal MCP SDK là giải pháp **production-ready** tốt nhất hiện tại để xây dựng ứng dụng tích hợp ChatGPT. SDK này:

- Giảm complexity trong việc setup MCP server
- Cung cấp abstraction layer tốt cho widget development
- Đầy đủ tooling từ development đến deployment

### 6.2. Khuyến Nghị Sử Dụng

**NÊN dùng khi:**

- Cần widget UI phức tạp trong ChatGPT
- Yêu cầu state persistence
- Muốn rapid prototyping với React
- Cần type safety và validation

**CÂN NHẮC khi:**

- Dự án đơn giản chỉ cần text response
- Team không quen với React/TypeScript
- Không cần real-time interaction

### 6.3. Roadmap Học Tập

1. **Beginner**: Bắt đầu với example weather widget
2. **Intermediate**: Customize và thêm features
3. **Advanced**: Build complex multi-widget applications
4. **Expert**: Contribute back to SDK development

## 7. TÀI NGUYÊN HỌC TẬP

- **GitHub Repo**: https://github.com/fractal-mcp/sdk
- **Quickstart Guide**: `/docs/quickstart.md`
- **Examples**: `/apps/examples/oai-apps`
- **Documentation**: Trong mỗi package README

## 8. YÊU CẦU HỆ THỐNG

- Node.js 18+
- React 18+ (cho widget UIs)
- TypeScript 5+ (khuyến nghị)
- ChatGPT với Apps SDK enabled

---

**Ngày phân tích:** 31/10/2025  
**Phiên bản SDK:** Latest (check GitHub cho updates)  
**Tình trạng:** Production Ready
