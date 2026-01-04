// Package validation provides event validation for ATTN Protocol events.
// It validates custom event kinds (Marketplace, Billboard, Promotion, Attention, Match, etc.)
// according to the ATTN-01 specification, checking required tags and JSON content fields.
//
// This package contains only ATTN Protocol-specific validation.
// Block events (38808) and supporting Nostr kinds are validated by City Protocol.
package validation

import (
	"github.com/nbd-wtf/go-nostr"
)

// ValidationResult represents the result of event validation.
// It indicates whether an event is valid and provides an error message if invalid.
type ValidationResult struct {
	Valid   bool
	Message string
}

// ATTNProtocolKinds contains all ATTN Protocol event kinds (38188-38988).
// Note: Block events (38808) are City Protocol, not ATTN Protocol.
var ATTNProtocolKinds = map[int]bool{
	38188: true, // Marketplace
	38288: true, // Billboard
	38388: true, // Promotion
	38488: true, // Attention
	38588: true, // Billboard Confirmation
	38688: true, // Attention Confirmation
	38788: true, // Marketplace Confirmation
	38888: true, // Match
	38988: true, // Attention Payment Confirmation
}

// IsATTNProtocolKind returns true if the kind is an ATTN Protocol event kind.
func IsATTNProtocolKind(kind int) bool {
	return ATTNProtocolKinds[kind]
}

// ValidateATTNEvent validates an ATTN Protocol event based on its kind.
// This only validates ATTN Protocol kinds (38188-38988).
// For Block events (38808) and supporting kinds, use City Protocol validation.
//
// Parameters:
//   - event: The Nostr event to validate
//
// Returns a ValidationResult indicating if the event is valid and any error message.
func ValidateATTNEvent(event *nostr.Event) ValidationResult {
	// Validate that only official Nostr tags are used for ATTN Protocol events
	if ATTNProtocolKinds[event.Kind] {
		if tag_result := validateOfficialTagsOnly(event); !tag_result.Valid {
			return tag_result
		}
	}

	switch event.Kind {
	case 38188:
		return ValidateMarketplaceEvent(event)
	case 38288:
		return ValidateBillboardEvent(event)
	case 38388:
		return ValidatePromotionEvent(event)
	case 38488:
		return ValidateAttentionEvent(event)
	case 38588:
		return ValidateBillboardConfirmationEvent(event)
	case 38688:
		return ValidateAttentionConfirmationEvent(event)
	case 38788:
		return ValidateMarketplaceConfirmationEvent(event)
	case 38888:
		return ValidateMatchEvent(event)
	case 38988:
		return ValidateAttentionPaymentConfirmationEvent(event)
	default:
		return ValidationResult{
			Valid:   false,
			Message: "Not an ATTN Protocol event kind",
		}
	}
}
