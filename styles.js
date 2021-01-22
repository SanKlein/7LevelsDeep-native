import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('screen');

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#fff'
  },
  startApp: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    display: 'flex',
    height: '100%'
  },
  intro: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  reason: {
    flex: 1,
    justifyContent: 'center'
  },
  start: {
    flex: 1
  },
  title: {
    color: '#e85454',
    fontSize: 52,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 48
  },
  otherTitle: {
    color: '#e85454',
    fontSize: 52,
    textAlign: 'center',
    fontWeight: '700',
    paddingTop: 72,
    marginBottom: 16,
    marginTop: 48
  },
  introText: {
    color: '#474747',
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center'
  },
  startButton: {
    backgroundColor: '#e85454',
    height: 56,
    width: width - 32,
    marginLeft: 16,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    padding: 16
  },
  startOverButton: {
    backgroundColor: '#e85454',
    height: 56,
    width: width - 32,
    marginLeft: 16,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    padding: 16,
    marginTop: 64
  },
  rateButton: {
    backgroundColor: '#f0f0f0',
    height: 56,
    width: width - 32,
    marginLeft: 16,
    marginRight: 16,
    margin: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    padding: 16
  },
  startButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18
  },
  why: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 32,
    paddingTop: 0
  },
  whyTitle: {
    color: '#e85454',
    marginBottom: 8,
    fontWeight: '800',
    fontSize: 18
  },
  whyText: {
    color: '#474747',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center'
  },
  instructions: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16
  },
  answerContainer: {
    flex: 1,
    margin: 16,
    marginTop: 48
  },
  answerPromptText: {
    color: '#e85454',
    fontWeight: '700',
    fontSize: 18,
    paddingTop: 16,
    paddingBottom: 16
  },
  answer: {
    flex: 1
  },
  answerText: {
    fontSize: 16,
    color: '#474747',
    lineHeight: 24,
    minHeight: 40
  },
  footer: {
    alignItems: 'center',
    flexShrink: 0,
    flexDirection: 'row',
    padding: 16
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 28,
    flexShrink: 0,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16
  },
  backButtonText: {
    color: '#e85454',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center'
  },
  finishExerciseButton: {
    backgroundColor: '#e85454',
    flex: 1,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    padding: 8
  },
  finishExerciseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center'
  },
  past: {
    alignItems: 'center',
    marginTop: 64
  },
  pastTitle: {
    textAlign: 'center',
    color: '#e85454',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 16
  },
  pastExercises: {
    flex: 1,
    justifyContent: 'flex-start',
    width
  },
  pastExercise: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 16
  },
  pastExerciseButton: {
    flex: 4,
    padding: 16,
    borderRadius: 28
  },
  pastExerciseText: {
    color: '#474747',
    fontSize: 20,
    fontWeight: '700'
  },
  sharePastExerciseButton: {
    paddingTop: 4,
    paddingBottom: 4,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sharePastExerciseButtonText: {
    fontSize: 16,
    textAlign: 'center'
  },
  deletePastExerciseButton: {
    paddingTop: 4,
    paddingBottom: 4,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deletePastExerciseButtonText: {
    color: '#e85454',
    fontSize: 16,
    textAlign: 'center'
  },
  takeAgainButton: {
    backgroundColor: '#f0f0f0',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    marginBottom: 64,
    width: width - 32
  },
  takeAgainButtonText: {
    color: '#e85454',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center'
  },
  share: {
    alignItems: 'center',
    padding: 16,
    justifyContent: 'center'
  },
  shareTitleView: {
    marginBottom: 16
  },
  shareTitle: {
    color: '#474747',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 8
  },
  shareButton: {
    backgroundColor: '#e85454',
    height: 56,
    width: width - 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    padding: 16,
    marginLeft: 16,
    marginRight: 16,
  },
  createdBy: {
    height: 56,
    width,
    marginTop: 32,
    marginBottom: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  createdByText: {
    color: '#474747',
    fontWeight: '700',
    fontSize: 16
  },
  heart: {
    paddingLeft: 8,
    paddingRight: 8
  }
});

export default styles;
