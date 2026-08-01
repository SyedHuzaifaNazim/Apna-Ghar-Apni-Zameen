import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

/**
 * There's no image-hosting service wired up (no Cloudinary/S3/etc.
 * credentials), so listing photos are stored as compressed base64 data URIs
 * directly on the Property document — the same "no external service needed"
 * approach already used for maps (OpenStreetMap instead of Google Maps).
 * Resizing to maxWidth + JPEG compression keeps each photo in the tens-of-KB
 * range so a handful of them stay well under MongoDB's 16MB document limit.
 */

const MAX_WIDTH = 1080;
const COMPRESSION_QUALITY = 0.6;

const compress = async (uri: string): Promise<string | null> => {
  try {
    const result = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: MAX_WIDTH } }], {
      compress: COMPRESSION_QUALITY,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    });
    return result.base64 ? `data:image/jpeg;base64,${result.base64}` : null;
  } catch {
    return null;
  }
};

/** Opens the gallery picker, letting the user pick up to `remainingSlots` photos, returns compressed data URIs. */
export async function pickListingImages(remainingSlots: number): Promise<string[]> {
  if (remainingSlots <= 0) return [];

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission needed', 'Please allow photo library access to add listing photos.');
    return [];
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit: remainingSlots,
    quality: 1,
  });

  if (result.canceled || result.assets.length === 0) return [];

  const compressed = await Promise.all(result.assets.map(asset => compress(asset.uri)));
  return compressed.filter((uri): uri is string => uri !== null);
}

/** Opens the camera, returns a single compressed data URI, or null if cancelled/denied. */
export async function captureListingImage(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission needed', 'Please allow camera access to take a listing photo.');
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({ quality: 1 });
  if (result.canceled || result.assets.length === 0) return null;

  return compress(result.assets[0].uri);
}
