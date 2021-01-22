import { Linking, Share } from 'react-native';

export function share() {
  Share.share({ message: '7 Levels Deep: Discover your why\n\nhttps://itunes.apple.com/us/app/7-levels-deep-discover-your-why/id1214661840?mt=8' });
}

export function openLink() {
  Linking.openURL('https://www.parkerklein.com');
}

export function rate() {
  Linking.openURL(
    'https://itunes.apple.com/us/app/7-levels-deep-discover-your-why/id1214661840?mt=8'
  );
}

export function loadParker() {
  Linking.openURL('https://www.parkerklein.com');
}
