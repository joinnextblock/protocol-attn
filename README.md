# ATTN MARKETPLACE PROTOCOL

## Table of Contents
- [What is the ATTN MARKETPLACE PROTOCOL?](#what-is-the-attn-marketplace-protocol)
- [How does it work?](#how-does-it-work)
- [Why is this better than centralized advertising?](#why-is-this-better-than-centralized-advertising)
- [How do I participate as a content promoter?](#how-do-i-participate-as-a-content-promoter)
- [How do I participate as a content viewer?](#how-do-i-participate-as-a-content-viewer)
- [How do I run a billboard?](#how-do-i-run-a-billboard)
- [How do promotions begin and end?](#how-do-promotions-begin-and-end)
- [What's the economic model?](#whats-the-economic-model)
- [How is trust established?](#how-is-trust-established)
- [Technical Specifications & Documentation](#technical-specifications--documentation)

## What is the ATTN MARKETPLACE PROTOCOL?

A decentralized framework enabling paid content promotion within the Nostr ecosystem. By establishing standardized communication methods for promotional content, the protocol creates new economic opportunities while preserving Nostr's core principles of decentralization and privacy.

### Key Features
- Pay-per-view content promotion system
- Satoshi-based payment infrastructure 
- Market-driven pricing mechanism

## How does it work?

The protocol connects three types of participants through standardized Nostr events:

### Protocol Components
- **Event Kind 28888**: Billboard configuration events
- **Event Kind 18888**: Buyer promotion requests
- **Event Kind 17888**: Seller availability signals
- **Standard Relays**: For event propagation between participants

### Basic Workflow
1. Billboard operators publish configuration events (kind:28888)
2. Sellers announce availability by publishing kind:17888 events
3. Buyers request promotion of specific notes via kind:18888 events
4. Billboards match compatible buyers and sellers
5. Billboards verify content viewing and facilitate payment
6. All parties can monitor engagement via statistical events

## Why is this better than centralized advertising?

### Market-Driven Trust Systems
- Natural competition between billboard operators improves services and lowers fees
- Specialized billboards can emerge for different content niches and audience segments
- Operators build reputation as their primary capital, incentivizing honest behavior
- Similar to how [Cashu](https://cashu.space) mint operators compete in the ecash ecosystem

### Protocol-Level Neutrality
- Defines communication formats and workflows without dictating implementation details
- Allows different technical solutions to verification, payment, and matching challenges
- Enables continuous experimentation and improvement by different operators

### True User Sovereignty
- Viewers explicitly choose what content to view and for what compensation
- Promoters determine their own budgets and targeting parameters
- Direct value exchange without platforms extracting the majority of value
- All participants select which billboard operators they trust

### Resilience Through Decentralization
- No single point of failure or censorship
- Diverse content policies across different billboard operators
- Lower barrier to entry compared to centralized advertising networks
- Persistence of the network despite individual node failures

### Scalability Through Composability
- Specialized implementations can focus on solving specific challenges
- Leverages existing Nostr infrastructure rather than building from scratch
- Allows for progressive enhancement as more sophisticated solutions develop

## How do I participate as a content promoter?

As a Buyer in the protocol, you can:
- Specify Nostr Events to promote
- Set custom bid amounts in `sats_per_second`
- Define required viewing durations for content
- Choose trusted billboard nodes for verification
- Submit promotion requests through Nostr events (kind: 18888)
- Exercise direct control over promotion parameters

Buyers publish kind:18888 events to initiate promotions, specifying their bid, the content to promote, and which billboard operators they trust.

## How do I participate as a content viewer?

As a Seller in the protocol, you can:
- Set personal asking prices in `sats_per_second`
- Select trusted billboard operators
- Earn by viewing promoted content
- Participate through simple Nostr events (kind: 17888)
- Maintain full control over which content to view
- Adjust asking prices based on market conditions

Sellers publish kind:17888 events to signal availability, specifying their asking price and which billboard operators they accept.

## How do I run a billboard?

Billboard operators maintain full autonomy over implementation details. The protocol defines only the communication standards, while operators can:
- Choose how to handle event deletions
- Implement custom matching algorithms
- Select verification methods
- Establish fee structures
- Determine event caching/storage policies
- Deploy anti-fraud measures
- Define business logic

As a Billboard Operator, you:
- Serve as verification infrastructure
- Configure viewing duration requirements
- Set customizable service fees
- Validate transactions between buyers and sellers
- Update market conditions at configurable intervals
- Operate through standard Nostr events (kind: 28888)

This design encourages market-driven selection of effective billboard implementations and practices.

## How do promotions begin and end?

### Promotion Lifecycle
- Promotions begin when buyers publish kind:18888 events
- Promotions remain active until:
  1. The buyer publishes a kind:5 event deleting the promotion
  2. The billboard terminates the promotion based on its criteria
- Billboards must monitor for and respect deletion events

## What's the economic model?

### Economic Architecture
- Market-driven pricing mechanism with no central rate setting
- Direct peer-to-peer economic relationship between buyers and sellers
- Billboard fee structure clearly defined in kind:28888 events
- All monetary values denominated in satoshis for consistency
- Billboards only match BUYERS and SELLERS when bid ≥ ask

## How is trust established?

### Trust Framework
- Decentralized trust model with no central authority
- Explicit pubkey-based billboard selection by both buyers and sellers
- Self-sovereign trust relationships maintained by individual participants
- Trust signals propagated through successful transaction history
- Market incentives naturally align with honest operation

## Technical Specifications & Documentation

### NIP List
- [NIP-X1](./NIP-X1.md): BASIC PROTOCOL
- NIP-XX: BILLBOARD METRICS (coming soon)
- NIP-XX: SELLER PREFERNCES (coming soon)
- NIP-XX: BUYER PREFERNCES (coming soon)
- NIP-XX: BILLBOARD STATISTICS (coming soon)
- NIP-XX: LIGHTNING PAYMENTS (coming soon)
- NIP-XX: ECASH PAYMENTS (coming soon)