// Package validation provides combined event validation for ATTN Protocol relay.
// ATTN Protocol extends City Protocol, so this package imports City Protocol validation
// for Block events (38808) and supporting Nostr kinds, and adds ATTN Protocol-specific validators.
//
// This package validates:
//   - ATTN Protocol events (38188-38988) via attn-protocol/go-core/validation
//   - City Protocol events (38808) via city-protocol/relay/pkg/validation
//   - Supporting Nostr kinds via city-protocol/relay/pkg/validation
package validation

import (
	"fmt"

	"github.com/nbd-wtf/go-nostr"

	attn_validation "github.com/joinnextblock/attn-protocol/go-core/validation"
	city_validation "github.com/joinnextblock/city-protocol/relay/pkg/validation"
)

// ValidationResult represents the result of event validation.
// Re-exported from city-protocol/relay/pkg/validation.
type ValidationResult = city_validation.ValidationResult

// AllowedEventKinds defines the set of event kinds accepted by the ATTN Protocol relay.
// This extends City Protocol's allowed kinds with ATTN Protocol-specific kinds.
var AllowedEventKinds = func() map[int]bool {
	// Start with City Protocol's allowed kinds (Block + supporting Nostr kinds)
	kinds := make(map[int]bool)
	for k, v := range city_validation.AllowedEventKinds {
		kinds[k] = v
	}

	// Add ATTN Protocol kinds
	for k, v := range attn_validation.ATTNProtocolKinds {
		kinds[k] = v
	}

	return kinds
}()

// ATTNProtocolKinds contains all ATTN Protocol event kinds.
// Re-exported from attn-protocol/go-core/validation.
var ATTNProtocolKinds = attn_validation.ATTNProtocolKinds

// IsATTNProtocolKind returns true if the kind is an ATTN Protocol event kind.
// Re-exported from attn-protocol/go-core/validation.
func IsATTNProtocolKind(kind int) bool {
	return attn_validation.IsATTNProtocolKind(kind)
}

// IsCityProtocolKind returns true if the kind is a City Protocol event kind.
// Re-exported from city-protocol/relay/pkg/validation.
func IsCityProtocolKind(kind int) bool {
	return city_validation.IsCityProtocolKind(kind)
}

// ValidateEvent validates an event based on its kind.
// Routes ATTN Protocol events to ATTN validators and delegates City Protocol events
// and supporting Nostr kinds to City Protocol validation.
//
// ATTN Protocol kinds (38188-38988):
//   - 38188: Marketplace events
//   - 38288: Billboard events
//   - 38388: Promotion events
//   - 38488: Attention events
//   - 38588: Billboard confirmation events
//   - 38688: Attention confirmation events
//   - 38788: Marketplace confirmation events
//   - 38888: Match events
//   - 38988: Attention payment confirmation events
//
// City Protocol kinds (388X8 pattern) and supporting Nostr kinds are delegated to City Protocol.
func ValidateEvent(event *nostr.Event) ValidationResult {
	// First, check if event kind is allowed
	if !AllowedEventKinds[event.Kind] {
		return ValidationResult{
			Valid:   false,
			Message: fmt.Sprintf("Event kind %d is not supported by this relay. Only ATTN Protocol kinds (38188-38988), City Protocol kinds (388X8), and supporting Nostr kinds are accepted.", event.Kind),
		}
	}

	// Route ATTN Protocol events to ATTN validators
	if attn_validation.IsATTNProtocolKind(event.Kind) {
		result := attn_validation.ValidateATTNEvent(event)
		return ValidationResult{Valid: result.Valid, Message: result.Message}
	}

	// Delegate City Protocol events and supporting Nostr kinds to City Protocol validation
	return city_validation.ValidateEvent(event)
}

// ValidateMarketplaceEvent validates Marketplace events (kind 38188).
// Re-exported from attn-protocol/go-core/validation.
func ValidateMarketplaceEvent(event *nostr.Event) ValidationResult {
	result := attn_validation.ValidateMarketplaceEvent(event)
	return ValidationResult{Valid: result.Valid, Message: result.Message}
}

// ValidateBillboardEvent validates Billboard events (kind 38288).
// Re-exported from attn-protocol/go-core/validation.
func ValidateBillboardEvent(event *nostr.Event) ValidationResult {
	result := attn_validation.ValidateBillboardEvent(event)
	return ValidationResult{Valid: result.Valid, Message: result.Message}
}

// ValidatePromotionEvent validates Promotion events (kind 38388).
// Re-exported from attn-protocol/go-core/validation.
func ValidatePromotionEvent(event *nostr.Event) ValidationResult {
	result := attn_validation.ValidatePromotionEvent(event)
	return ValidationResult{Valid: result.Valid, Message: result.Message}
}

// ValidateAttentionEvent validates Attention events (kind 38488).
// Re-exported from attn-protocol/go-core/validation.
func ValidateAttentionEvent(event *nostr.Event) ValidationResult {
	result := attn_validation.ValidateAttentionEvent(event)
	return ValidationResult{Valid: result.Valid, Message: result.Message}
}

// ValidateMatchEvent validates Match events (kind 38888).
// Re-exported from attn-protocol/go-core/validation.
func ValidateMatchEvent(event *nostr.Event) ValidationResult {
	result := attn_validation.ValidateMatchEvent(event)
	return ValidationResult{Valid: result.Valid, Message: result.Message}
}

// ValidateBillboardConfirmationEvent validates Billboard Confirmation events (kind 38588).
// Re-exported from attn-protocol/go-core/validation.
func ValidateBillboardConfirmationEvent(event *nostr.Event) ValidationResult {
	result := attn_validation.ValidateBillboardConfirmationEvent(event)
	return ValidationResult{Valid: result.Valid, Message: result.Message}
}

// ValidateAttentionConfirmationEvent validates Attention Confirmation events (kind 38688).
// Re-exported from attn-protocol/go-core/validation.
func ValidateAttentionConfirmationEvent(event *nostr.Event) ValidationResult {
	result := attn_validation.ValidateAttentionConfirmationEvent(event)
	return ValidationResult{Valid: result.Valid, Message: result.Message}
}

// ValidateMarketplaceConfirmationEvent validates Marketplace Confirmation events (kind 38788).
// Re-exported from attn-protocol/go-core/validation.
func ValidateMarketplaceConfirmationEvent(event *nostr.Event) ValidationResult {
	result := attn_validation.ValidateMarketplaceConfirmationEvent(event)
	return ValidationResult{Valid: result.Valid, Message: result.Message}
}

// ValidateAttentionPaymentConfirmationEvent validates Attention Payment Confirmation events (kind 38988).
// Re-exported from attn-protocol/go-core/validation.
func ValidateAttentionPaymentConfirmationEvent(event *nostr.Event) ValidationResult {
	result := attn_validation.ValidateAttentionPaymentConfirmationEvent(event)
	return ValidationResult{Valid: result.Valid, Message: result.Message}
}

// ValidateBlockEvent validates City Protocol Block events (kind 38808).
// Delegated to city-protocol/relay/pkg/validation.
func ValidateBlockEvent(event *nostr.Event) ValidationResult {
	return city_validation.ValidateBlockEvent(event)
}

// ValidateCityBlockEvent is an alias for ValidateBlockEvent.
// Deprecated: Use ValidateBlockEvent instead.
func ValidateCityBlockEvent(event *nostr.Event) ValidationResult {
	return ValidateBlockEvent(event)
}

// ValidateBlockUpdateEvent is deprecated - use ValidateBlockEvent instead.
// Deprecated: Use ValidateBlockEvent instead.
func ValidateBlockUpdateEvent(event *nostr.Event) ValidationResult {
	return ValidateBlockEvent(event)
}
