import { Alert, Linking, Platform } from 'react-native';

/**
 * Centralizes every "contact someone" deep link in the app.
 *
 * Two real bugs lived in the old per-screen copies of this logic:
 *
 * 1. `Linking.canOpenURL('tel:'/'sms:'/'mailto:')` was gating every button.
 *    On Android 11+ (API 30+), package-visibility restrictions make
 *    `canOpenURL` return false for these schemes unless the calling app
 *    declares them in a <queries> manifest block — which this project (a
 *    managed Expo app with no custom manifest) never did. The dialer/SMS/
 *    email apps would have opened fine via `openURL` directly; the
 *    `canOpenURL` pre-check was the thing silently failing and showing
 *    "Unavailable" even on devices that could handle the request.
 * 2. WhatsApp used the undocumented `whatsapp://send?phone=` scheme, which
 *    is inconsistent across WhatsApp versions/devices. Meta's own
 *    click-to-chat integration uses `https://wa.me/<number>` instead — a
 *    universal https link that always resolves (falls back to a web page
 *    if the app isn't installed) and needs no package-visibility
 *    declaration at all.
 */

const showUnavailable = (message: string) => Alert.alert('Unavailable', message);
const showGenericError = () => Alert.alert('Something went wrong', 'Please try again.');

/** Digits only, no country-code plus sign, no spaces/dashes — required by wa.me. */
const toWhatsAppDigits = (phone: string) => phone.replace(/[^\d]/g, '');

async function open(url: string, onUnsupported: string) {
  try {
    await Linking.openURL(url);
  } catch {
    // openURL throws when genuinely nothing can handle it — that's the
    // reliable signal, not the package-visibility-limited canOpenURL check.
    showUnavailable(onUnsupported);
  }
}

export async function openPhoneDialer(phone: string) {
  await open(`tel:${phone}`, 'No phone app is available on this device.');
}

export async function openSms(phone: string, body: string) {
  const separator = Platform.OS === 'ios' ? '&' : '?';
  await open(`sms:${phone}${separator}body=${encodeURIComponent(body)}`, 'Messaging is not supported on this device.');
}

export async function openWhatsApp(phone: string, text: string) {
  const url = `https://wa.me/${toWhatsAppDigits(phone)}?text=${encodeURIComponent(text)}`;
  try {
    await Linking.openURL(url);
  } catch {
    showGenericError();
  }
}

export async function openEmail(email: string, subject: string, body: string) {
  const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  await open(url, 'No email app is configured on this device.');
}
