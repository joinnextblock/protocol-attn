# Build stage - use NextBlock Go builder base image
FROM nextblock/go-builder:latest AS builder

WORKDIR /app

# Copy go.mod files for all packages (for replace directives)
COPY packages/go-core/go.mod packages/go-core/go.mod
COPY packages/go-framework/go.mod packages/go-framework/go.mod
COPY packages/go-framework/go.sum packages/go-framework/go.sum
COPY packages/go-marketplace/go.mod packages/go-marketplace/go.mod
COPY packages/go-marketplace/go.sum packages/go-marketplace/go.sum

# Copy source code
COPY packages/go-core/ packages/go-core/
COPY packages/go-framework/ packages/go-framework/
COPY packages/go-marketplace/ packages/go-marketplace/

# Build the marketplace service
WORKDIR /app/packages/go-marketplace
RUN go mod download
RUN CGO_ENABLED=0 go build -ldflags="-w -s" -o /marketplace ./cmd/marketplace

# Runtime stage - use NextBlock Go runtime base image
FROM nextblock/go-runtime:latest

WORKDIR /app

COPY --from=builder /marketplace /app/marketplace

# Base image already has app user, keep using it

EXPOSE 8787

CMD ["/app/marketplace"]
