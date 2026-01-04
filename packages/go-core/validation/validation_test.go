package validation

import (
	"strings"
	"testing"

	"github.com/nbd-wtf/go-nostr"
)

func TestValidateATTNEvent_ValidPromotion(t *testing.T) {
	pubkey := generateTestPubkey()
	event := createTestPromotionEvent(pubkey, 870500, pubkey, pubkey, pubkey)

	result := ValidateATTNEvent(event)
	if !result.Valid {
		t.Errorf("Expected valid promotion event, got: %s", result.Message)
	}
}

func TestValidateATTNEvent_ValidAttention(t *testing.T) {
	pubkey := generateTestPubkey()
	event := createTestAttentionEvent(pubkey, 870500, pubkey)

	result := ValidateATTNEvent(event)
	if !result.Valid {
		t.Errorf("Expected valid attention event, got: %s", result.Message)
	}
}

func TestValidateATTNEvent_MissingBlockHeight(t *testing.T) {
	pubkey := generateTestPubkey()
	event := createTestPromotionEvent(pubkey, 870500, pubkey, pubkey, pubkey)
	// Remove t tag
	event.Tags = event.Tags[:len(event.Tags)-1]

	result := ValidateATTNEvent(event)
	if result.Valid {
		t.Error("Expected invalid event (missing block height), got valid")
	}
}

func TestValidateATTNEvent_InvalidBlockHeight(t *testing.T) {
	pubkey := generateTestPubkey()
	event := createTestPromotionEvent(pubkey, 870500, pubkey, pubkey, pubkey)
	// Replace t tag with invalid value
	for i, tag := range event.Tags {
		if tag[0] == "t" {
			event.Tags[i] = nostr.Tag{"t", "invalid"}
			break
		}
	}

	result := ValidateATTNEvent(event)
	if result.Valid {
		t.Error("Expected invalid event (invalid block height), got valid")
	}
}

func TestValidateATTNEvent_MissingDTag(t *testing.T) {
	pubkey := generateTestPubkey()
	event := createTestPromotionEvent(pubkey, 870500, pubkey, pubkey, pubkey)
	// Remove d tag
	var new_tags nostr.Tags
	for _, tag := range event.Tags {
		if tag[0] != "d" {
			new_tags = append(new_tags, tag)
		}
	}
	event.Tags = new_tags

	result := ValidateATTNEvent(event)
	if result.Valid {
		t.Error("Expected invalid event (missing d tag), got valid")
	}
}

func TestValidateATTNEvent_MissingMarketplaceCoordinate(t *testing.T) {
	pubkey := generateTestPubkey()
	event := createTestPromotionEvent(pubkey, 870500, pubkey, pubkey, pubkey)
	// Remove marketplace coordinate a tag
	var new_tags nostr.Tags
	for _, tag := range event.Tags {
		if tag[0] != "a" || !strings.HasPrefix(tag[1], "38188:") {
			new_tags = append(new_tags, tag)
		}
	}
	event.Tags = new_tags

	result := ValidateATTNEvent(event)
	if result.Valid {
		t.Error("Expected invalid event (missing marketplace coordinate), got valid")
	}
}

func TestValidateATTNEvent_InvalidJSONContent(t *testing.T) {
	pubkey := generateTestPubkey()
	event := createTestPromotionEvent(pubkey, 870500, pubkey, pubkey, pubkey)
	event.Content = "invalid json"

	result := ValidateATTNEvent(event)
	if result.Valid {
		t.Error("Expected invalid event (invalid JSON content), got valid")
	}
}

func TestValidatePromotionEvent_Valid(t *testing.T) {
	pubkey := generateTestPubkey()
	event := createTestPromotionEvent(pubkey, 870500, pubkey, pubkey, pubkey)

	result := ValidatePromotionEvent(event)
	if !result.Valid {
		t.Errorf("Expected valid promotion event, got: %s", result.Message)
	}
}

func TestValidateAttentionEvent_Valid(t *testing.T) {
	pubkey := generateTestPubkey()
	event := createTestAttentionEvent(pubkey, 870500, pubkey)

	result := ValidateAttentionEvent(event)
	if !result.Valid {
		t.Errorf("Expected valid attention event, got: %s", result.Message)
	}
}

func TestValidateMarketplaceEvent_Valid(t *testing.T) {
	pubkey := generateTestPubkey()
	event := createTestMarketplaceEvent(pubkey, 870500)

	result := ValidateMarketplaceEvent(event)
	if !result.Valid {
		t.Errorf("Expected valid marketplace event, got: %s", result.Message)
	}
}

func TestValidateATTNEvent_NonATTNKindRejected(t *testing.T) {
	pubkey := generateTestPubkey()

	// Non-ATTN kinds should be rejected by ValidateATTNEvent
	non_attn_kinds := []int{0, 1, 5, 38808, 10002, 30000, 34236}

	for _, kind := range non_attn_kinds {
		event := &nostr.Event{
			Kind:    kind,
			PubKey:  pubkey,
			Content: "{}",
			Tags:    nostr.Tags{},
		}

		result := ValidateATTNEvent(event)
		if result.Valid {
			t.Errorf("Expected kind %d to be rejected by ValidateATTNEvent, got valid", kind)
		}
		if !strings.Contains(result.Message, "Not an ATTN Protocol event kind") {
			t.Errorf("Expected rejection message to contain 'Not an ATTN Protocol event kind', got: %s", result.Message)
		}
	}
}

func TestATTNProtocolKinds(t *testing.T) {
	// ATTN Protocol kinds (38188-38988) - note: 38808 is City Protocol, not ATTN
	attn_kinds := []int{38188, 38288, 38388, 38488, 38588, 38688, 38788, 38888, 38988}

	for _, kind := range attn_kinds {
		if !ATTNProtocolKinds[kind] {
			t.Errorf("Expected ATTN Protocol kind %d to be in ATTNProtocolKinds", kind)
		}
	}

	// 38808 (Block) is City Protocol, not ATTN Protocol
	if ATTNProtocolKinds[38808] {
		t.Error("Expected 38808 (Block) to NOT be in ATTNProtocolKinds - it's City Protocol")
	}
}

func TestATTNProtocolKinds_TotalCount(t *testing.T) {
	// 9 ATTN Protocol kinds (38188-38988, excluding 38808 which is City Protocol)
	expected := 9
	actual := len(ATTNProtocolKinds)

	if actual != expected {
		t.Errorf("Expected %d ATTN Protocol kinds, got %d", expected, actual)
	}
}

func TestIsATTNProtocolKind(t *testing.T) {
	// ATTN Protocol kinds should return true
	attn_kinds := []int{38188, 38288, 38388, 38488, 38588, 38688, 38788, 38888, 38988}
	for _, kind := range attn_kinds {
		if !IsATTNProtocolKind(kind) {
			t.Errorf("Expected IsATTNProtocolKind(%d) to return true", kind)
		}
	}

	// 38808 (Block) is City Protocol, should return false
	if IsATTNProtocolKind(38808) {
		t.Error("Expected IsATTNProtocolKind(38808) to return false - it's City Protocol")
	}

	// Non-ATTN kinds should return false
	non_attn_kinds := []int{0, 1, 5, 10002, 30000, 34236}
	for _, kind := range non_attn_kinds {
		if IsATTNProtocolKind(kind) {
			t.Errorf("Expected IsATTNProtocolKind(%d) to return false", kind)
		}
	}
}
