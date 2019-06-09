import { Linking } from 'react-native';

export function shareTwitter() {
  Linking.openURL('https://twitter.com/intent/tweet?text=Discover Your Why. www.7levelsdeep.com');
}

export function shareFacebook() {
  Linking.openURL(
    'https://www.facebook.com/dialog/share?app_id=1656429184383922&display=popup&href=http://www.7levelsdeep.com&redirect_uri=http://www.7levelsdeep.com/',
  );
}

export function shareLinkedin() {
  Linking.openURL(
    'http://www.linkedin.com/shareArticle?mini=true&url=http://www.7levelsdeep.com&title=Discover%20Your%20Why&description=A%20short%20exercise%20to%20help%20discover%20your%20why',
  );
}

export function shareEmail() {
  Linking.openURL('mailto:?subject=Discover Your Why&body=www.7levelsdeep.com');
}

export function openLink() {
  Linking.openURL('http://www.parkerklein.me/');
}

export function rate() {
  Linking.openURL(
    'https://itunes.apple.com/us/app/7-levels-deep-discover-your-why/id1214661840?mt=8',
  );
}

export function loadParker() {
  Linking.openURL('http://www.parkerklein.me');
}
